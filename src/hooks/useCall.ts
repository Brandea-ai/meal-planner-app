'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId } from '@/lib/supabase';
import { CallType, CallState, CallSignal, CallSession } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  startIncomingCallAlert,
  stopIncomingCallAlert,
  startDialTone,
  stopDialTone,
  playConnectedSound,
  playEndedSound,
  requestNotificationPermission,
} from '@/utils/callNotifications';

// ICE Servers for NAT traversal - includes multiple TURN servers for reliability
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    // STUN servers
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
    { urls: 'stun:stun4.l.google.com:19302' },
    // Free TURN servers from Open Relay Project
    {
      urls: 'turn:openrelay.metered.ca:80',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:80?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
    {
      urls: 'turn:openrelay.metered.ca:443?transport=tcp',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  iceCandidatePoolSize: 10,
};

// Generate or retrieve a unique call user ID (separate from device ID)
// Each family member gets their own call ID even though they share device_id
function getCallUserId(): string {
  if (typeof window === 'undefined') return '';

  let callUserId = localStorage.getItem('meal-planner-call-user-id');
  if (!callUserId) {
    callUserId = `call-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('meal-planner-call-user-id', callUserId);
  }
  return callUserId;
}

interface UseCallReturn {
  // State
  callState: CallState;
  callSession: CallSession | null;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  error: string | null;
  isMuted: boolean;
  isVideoOff: boolean;
  callUserId: string;

  // Actions
  startCall: (callType: CallType) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleVideo: () => void;

  // Incoming call info
  incomingCall: { callerName: string; callType: CallType; callUserId: string } | null;
}

export function useCall(senderName: string): UseCallReturn {
  const [callState, setCallState] = useState<CallState>('idle');
  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [incomingCall, setIncomingCall] = useState<{ callerName: string; callType: CallType; callUserId: string } | null>(null);

  // Initialize callUserId directly from localStorage
  const [callUserId] = useState<string>(() => getCallUserId());

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const deviceIdRef = useRef<string>(getDeviceId());
  const callUserIdRef = useRef<string>(callUserId);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callStateRef = useRef<CallState>('idle');
  const localStreamRef = useRef<MediaStream | null>(null);

  // Call timeout duration (30 seconds)
  const CALL_TIMEOUT = 30000;

  // Keep callStateRef in sync
  useEffect(() => {
    callStateRef.current = callState;
  }, [callState]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Clear call timeout
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    // Stop all sounds
    stopIncomingCallAlert();
    stopDialTone();
    playEndedSound();

    // Stop local stream (both ref and state)
    localStreamRef.current?.getTracks().forEach(track => track.stop());
    localStreamRef.current = null;
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setRemoteStream(null);
    setCallSession(null);
    setCallState('idle');
    setIncomingCall(null);
    setIsMuted(false);
    setIsVideoOff(false);
    setError(null);
    pendingCandidatesRef.current = [];
  }, [localStream]);

  // Send signal to database with retry logic
  const sendSignal = useCallback(async (
    targetCallUserId: string,
    signalType: CallSignal['signalType'],
    callType: CallType,
    signalData?: RTCSessionDescriptionInit | RTCIceCandidateInit | null,
    retries = 3
  ) => {
    const deviceId = deviceIdRef.current;
    const myCallUserId = callUserIdRef.current;
    if (!deviceId || !myCallUserId) return;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error } = await supabase.from('call_signals').insert({
          device_id: deviceId,
          target_device_id: targetCallUserId,
          caller_name: senderName || 'Anonym',
          signal_type: signalType,
          call_type: callType,
          signal_data: signalData ? { ...signalData, from_call_user_id: myCallUserId } : { from_call_user_id: myCallUserId },
        });

        if (error) throw error;
        return; // Success
      } catch (e) {
        console.warn(`Failed to send signal (attempt ${attempt}/${retries}):`, e);
        if (attempt < retries) {
          // Exponential backoff: 100ms, 200ms, 400ms
          await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt - 1)));
        }
      }
    }
    console.error('Failed to send signal after all retries');
  }, [senderName]);

  // Broadcast to all family members (using device_id as broadcast channel) with retry
  const broadcastSignal = useCallback(async (
    signalType: CallSignal['signalType'],
    callType: CallType,
    signalData?: RTCSessionDescriptionInit | RTCIceCandidateInit | null,
    retries = 3
  ) => {
    const deviceId = deviceIdRef.current;
    const myCallUserId = callUserIdRef.current;
    if (!deviceId || !myCallUserId) return;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { error } = await supabase.from('call_signals').insert({
          device_id: myCallUserId,
          target_device_id: deviceId,
          caller_name: senderName || 'Anonym',
          signal_type: signalType,
          call_type: callType,
          signal_data: signalData ? { ...signalData, from_call_user_id: myCallUserId } : { from_call_user_id: myCallUserId },
        });

        if (error) throw error;
        return; // Success
      } catch (e) {
        console.warn(`Failed to broadcast signal (attempt ${attempt}/${retries}):`, e);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 100 * Math.pow(2, attempt - 1)));
        }
      }
    }
    console.error('Failed to broadcast signal after all retries');
  }, [senderName]);

  // Create peer connection
  const createPeerConnection = useCallback((remoteCallUserId: string, callType: CallType) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Handle ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(remoteCallUserId, 'ice-candidate', callType, event.candidate.toJSON());
      }
    };

    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      console.log('🔗 Connection state:', pc.connectionState);
      if (pc.connectionState === 'connected') {
        console.log('✅ WebRTC VERBUNDEN!');
        setCallState('connected');
        playConnectedSound();
      } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        console.log('❌ WebRTC Verbindung fehlgeschlagen:', pc.connectionState);
        cleanup();
      }
    };

    // Handle ICE connection state (more granular)
    pc.oniceconnectionstatechange = () => {
      console.log('🧊 ICE state:', pc.iceConnectionState);
      if (pc.iceConnectionState === 'failed') {
        console.log('❌ ICE Verbindung fehlgeschlagen - versuche Neustart');
        pc.restartIce();
      }
    };

    // Handle ICE gathering state
    pc.onicegatheringstatechange = () => {
      console.log('📡 ICE gathering:', pc.iceGatheringState);
    };

    // Handle signaling state
    pc.onsignalingstatechange = () => {
      console.log('📶 Signaling state:', pc.signalingState);
    };

    // Handle incoming tracks
    pc.ontrack = (event) => {
      console.log('🎥 Received remote track:', event.track.kind, '- stream ID:', event.streams[0]?.id);
      setRemoteStream(event.streams[0]);
    };

    peerConnectionRef.current = pc;
    return pc;
  }, [sendSignal, cleanup]);

  // Get user media
  const getUserMedia = useCallback(async (callType: CallType): Promise<MediaStream> => {
    try {
      const constraints: MediaStreamConstraints = {
        audio: true,
        video: callType === 'video' ? { facingMode: 'user', width: 640, height: 480 } : false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      return stream;
    } catch (e) {
      console.error('Failed to get user media:', e);
      setError('Kamera/Mikrofon konnte nicht aktiviert werden');
      throw e;
    }
  }, []);

  // Start a call (broadcast to family)
  const startCall = useCallback(async (callType: CallType) => {
    const myCallUserId = callUserIdRef.current;
    if (!myCallUserId || callState !== 'idle') return;

    setError(null);
    setCallState('calling');

    try {
      // IMPORTANT: Get local media FIRST before sending call request
      // This prevents race condition where call-accept arrives before media is ready
      const stream = await getUserMedia(callType);
      localStreamRef.current = stream;

      // Start dial tone (ringback tone)
      startDialTone();

      // Set timeout for unanswered calls
      callTimeoutRef.current = setTimeout(() => {
        if (callStateRef.current === 'calling') {
          setError('Keine Antwort - Anruf abgebrochen');
          cleanup();
        }
      }, CALL_TIMEOUT);

      // Broadcast call request to all family members
      await broadcastSignal('call-request', callType);

    } catch (e) {
      console.error('Failed to start call:', e);
      setError('Anruf konnte nicht gestartet werden');
      stopDialTone();
      cleanup();
    }
  }, [callState, broadcastSignal, getUserMedia, cleanup]);

  // Accept incoming call
  const acceptCall = useCallback(async () => {
    if (!incomingCall || callState !== 'incoming') return;

    // Stop ringtone and notification when accepting
    stopIncomingCallAlert();

    setError(null);
    setCallState('connecting');

    try {
      // Create session
      const session: CallSession = {
        callId: `${incomingCall.callUserId}-${Date.now()}`,
        remoteDeviceId: incomingCall.callUserId,
        remoteName: incomingCall.callerName,
        callType: incomingCall.callType,
        state: 'connecting',
        startedAt: new Date().toISOString(),
        isInitiator: false,
      };
      setCallSession(session);

      // Send accept signal directly to caller
      await sendSignal(incomingCall.callUserId, 'call-accept', incomingCall.callType);

      // Get local media
      const stream = await getUserMedia(incomingCall.callType);
      localStreamRef.current = stream;

      // Create peer connection
      const pc = createPeerConnection(incomingCall.callUserId, incomingCall.callType);

      // Add local tracks
      console.log('📤 Receiver adding local tracks:', stream.getTracks().map(t => t.kind));
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // NOTE: Don't process pending ICE candidates here!
      // They will be processed in handleSignal after remote description is set

      setIncomingCall(null);
    } catch (e) {
      console.error('Failed to accept call:', e);
      setError('Anruf konnte nicht angenommen werden');
      cleanup();
    }
  }, [incomingCall, callState, sendSignal, getUserMedia, createPeerConnection, cleanup]);

  // Reject incoming call
  const rejectCall = useCallback(() => {
    if (!incomingCall) return;

    // Stop ringtone and notification when rejecting
    stopIncomingCallAlert();

    sendSignal(incomingCall.callUserId, 'call-reject', incomingCall.callType);
    setIncomingCall(null);
    cleanup();
  }, [incomingCall, sendSignal, cleanup]);

  // End call
  const endCall = useCallback(() => {
    if (callSession) {
      sendSignal(callSession.remoteDeviceId, 'call-end', callSession.callType);
    } else if (callState === 'calling') {
      // Cancel outgoing call
      broadcastSignal('call-end', 'audio');
    }
    cleanup();
  }, [callSession, callState, sendSignal, broadcastSignal, cleanup]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
      }
    }
  }, [localStream]);

  // Handle incoming signals
  const handleSignal = useCallback(async (signal: CallSignal) => {
    const myCallUserId = callUserIdRef.current;
    const deviceId = deviceIdRef.current;

    // Get sender's call_user_id from signal data
    const senderCallUserId = (signal.signalData as Record<string, unknown>)?.from_call_user_id as string;

    // Ignore our own signals
    if (senderCallUserId === myCallUserId || signal.deviceId === myCallUserId) return;

    // Check if this signal is for us
    // Either: targeted directly to our call_user_id, OR broadcast to our device_id
    const isDirectSignal = signal.targetDeviceId === myCallUserId;
    const isBroadcast = signal.targetDeviceId === deviceId;

    if (!isDirectSignal && !isBroadcast) return;

    console.log('Received signal:', signal.signalType, 'from:', signal.callerName);

    switch (signal.signalType) {
      case 'call-request':
        // Incoming call (broadcast)
        if (callStateRef.current === 'idle' && isBroadcast) {
          setIncomingCall({
            callerName: signal.callerName,
            callType: signal.callType,
            callUserId: senderCallUserId || signal.deviceId,
          });
          setCallState('incoming');

          // Start ringtone and browser notification
          startIncomingCallAlert(
            signal.callerName,
            signal.callType,
            undefined, // onAccept handled by UI
            undefined  // onReject handled by UI
          );
        }
        break;

      case 'call-accept':
        // Call was accepted
        if (callStateRef.current === 'calling' && isDirectSignal) {
          // Stop dial tone when call is accepted
          stopDialTone();
          setCallState('connecting');

          // Create session
          const session: CallSession = {
            callId: `${myCallUserId}-${Date.now()}`,
            remoteDeviceId: senderCallUserId,
            remoteName: signal.callerName,
            callType: signal.callType,
            state: 'connecting',
            startedAt: new Date().toISOString(),
            isInitiator: true,
          };
          setCallSession(session);

          // Create peer connection and send offer
          const pc = createPeerConnection(senderCallUserId, signal.callType);

          // Add local tracks - use ref for immediate access
          const stream = localStreamRef.current || localStream;
          if (stream) {
            console.log('📤 Adding local tracks to peer connection:', stream.getTracks().map(t => t.kind));
            stream.getTracks().forEach(track => {
              pc.addTrack(track, stream);
            });
          } else {
            console.error('❌ No local stream available when call was accepted!');
          }

          // Create and send offer
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          await sendSignal(senderCallUserId, 'offer', signal.callType, offer);
        }
        break;

      case 'call-reject':
        // Call was rejected
        if (callStateRef.current === 'calling') {
          stopDialTone();
          setError('Anruf wurde abgelehnt');
          cleanup();
        }
        break;

      case 'call-end':
        // Call ended by other party
        stopDialTone();
        stopIncomingCallAlert();
        cleanup();
        break;

      case 'offer':
        // Received SDP offer
        if ((callStateRef.current === 'incoming' || callStateRef.current === 'connecting') && isDirectSignal) {
          console.log('📥 Received offer, current PC:', !!peerConnectionRef.current);

          // CRITICAL: Ensure we have a peer connection with local tracks
          let pc = peerConnectionRef.current;
          if (!pc) {
            console.log('📥 Creating new PC for offer (fallback)');
            pc = createPeerConnection(senderCallUserId, signal.callType);
          }

          // CRITICAL FIX: Ensure local tracks are added BEFORE creating answer
          // This was missing and caused no audio to be sent!
          const stream = localStreamRef.current || localStream;
          if (stream && pc.getSenders().length === 0) {
            console.log('📤 Adding local tracks in offer handler:', stream.getTracks().map(t => t.kind));
            stream.getTracks().forEach(track => {
              pc!.addTrack(track, stream);
            });
          } else if (!stream) {
            console.error('❌ No local stream available when processing offer!');
            // Try to get media now
            try {
              const newStream = await getUserMedia(signal.callType);
              localStreamRef.current = newStream;
              console.log('📤 Got media and adding tracks:', newStream.getTracks().map(t => t.kind));
              newStream.getTracks().forEach(track => {
                pc!.addTrack(track, newStream);
              });
            } catch (e) {
              console.error('❌ Failed to get media in offer handler:', e);
            }
          }

          console.log('📥 PC senders after track setup:', pc.getSenders().map(s => s.track?.kind));

          const sdpData = { ...signal.signalData } as Record<string, unknown>;
          delete sdpData.from_call_user_id;
          const sdp = sdpData as unknown as RTCSessionDescriptionInit;

          await pc.setRemoteDescription(new RTCSessionDescription(sdp));

          // Process pending ICE candidates now that remote description is set
          if (pendingCandidatesRef.current.length > 0) {
            console.log(`Processing ${pendingCandidatesRef.current.length} pending ICE candidates after offer`);
            for (const candidate of pendingCandidatesRef.current) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {
                console.warn('Failed to add pending ICE candidate:', e);
              }
            }
            pendingCandidatesRef.current = [];
          }

          // Create and send answer
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          await sendSignal(senderCallUserId, 'answer', signal.callType, answer);
        }
        break;

      case 'answer':
        // Received SDP answer
        if (peerConnectionRef.current && (callStateRef.current === 'calling' || callStateRef.current === 'connecting') && isDirectSignal) {
          const answerData = { ...signal.signalData } as Record<string, unknown>;
          delete answerData.from_call_user_id;
          const sdp = answerData as unknown as RTCSessionDescriptionInit;

          await peerConnectionRef.current.setRemoteDescription(
            new RTCSessionDescription(sdp)
          );

          // CRITICAL FIX: Process pending ICE candidates after setting remote description
          // This was missing and caused call failures!
          if (pendingCandidatesRef.current.length > 0) {
            console.log(`Processing ${pendingCandidatesRef.current.length} pending ICE candidates`);
            for (const candidate of pendingCandidatesRef.current) {
              try {
                await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
              } catch (e) {
                console.warn('Failed to add pending ICE candidate:', e);
              }
            }
            pendingCandidatesRef.current = [];
          }
        }
        break;

      case 'ice-candidate':
        // Received ICE candidate
        if (isDirectSignal) {
          const candidateData = { ...signal.signalData } as Record<string, unknown>;
          delete candidateData.from_call_user_id;
          const candidate = candidateData as unknown as RTCIceCandidateInit;

          // Validate candidate before processing
          if (!candidate || (!candidate.candidate && !candidate.sdpMid && candidate.sdpMLineIndex === undefined)) {
            console.warn('Invalid ICE candidate received, skipping');
            break;
          }

          if (peerConnectionRef.current && peerConnectionRef.current.remoteDescription) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            } catch (e) {
              // Don't crash on invalid candidates - just log and continue
              console.warn('Failed to add ICE candidate:', e);
            }
          } else {
            // Queue candidate for later processing
            pendingCandidatesRef.current.push(candidate);
          }
        }
        break;
    }
  }, [localStream, sendSignal, createPeerConnection, cleanup, getUserMedia]);

  // Request notification permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Setup realtime subscription for signals
  useEffect(() => {
    const deviceId = getDeviceId();
    const userId = getCallUserId();
    deviceIdRef.current = deviceId;
    callUserIdRef.current = userId;

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    // Subscribe to signals targeted at our device_id (broadcasts) or our call_user_id (direct)
    const channel = supabase
      .channel(`call_signals_${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'call_signals',
        },
        (payload) => {
          const signal = payload.new as Record<string, unknown>;

          // Filter: only process signals for our device_id or call_user_id
          if (signal.target_device_id !== deviceId && signal.target_device_id !== userId) {
            return;
          }

          const formattedSignal: CallSignal = {
            id: signal.id as string,
            deviceId: signal.device_id as string,
            targetDeviceId: signal.target_device_id as string,
            callerName: signal.caller_name as string,
            signalType: signal.signal_type as CallSignal['signalType'],
            callType: signal.call_type as CallType,
            signalData: signal.signal_data as RTCSessionDescriptionInit | RTCIceCandidateInit | null,
            createdAt: signal.created_at as string,
            expiresAt: signal.expires_at as string,
          };
          handleSignal(formattedSignal);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Call signaling subscription active for:', userId);
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [handleSignal]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
    };
  }, [localStream]);

  return {
    callState,
    callSession,
    localStream,
    remoteStream,
    error,
    isMuted,
    isVideoOff,
    callUserId,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
    incomingCall,
  };
}
