'use client';

import { useRef, useEffect, useState } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  User,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { CallType, CallState } from '@/types';

interface ActiveCallProps {
  remoteName: string;
  callType: CallType;
  callState: CallState;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isMuted: boolean;
  isVideoOff: boolean;
  onEndCall: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
}

export function ActiveCall({
  remoteName,
  callType,
  callState,
  localStream,
  remoteStream,
  isMuted,
  isVideoOff,
  onEndCall,
  onToggleMute,
  onToggleVideo,
}: ActiveCallProps) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [useFrontCamera, setUseFrontCamera] = useState(true);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Attach remote stream to audio element (for audio calls or audio track of video calls)
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      console.log('🔊 Attaching remote audio stream');
      remoteAudioRef.current.srcObject = remoteStream;
      // Try to play immediately
      remoteAudioRef.current.play().catch(e => {
        console.warn('Audio autoplay blocked:', e);
      });
    }
  }, [remoteStream]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (callState === 'connected') {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get status text
  const getStatusText = () => {
    switch (callState) {
      case 'calling':
        return 'Anrufen...';
      case 'connecting':
        return 'Verbinden...';
      case 'connected':
        return formatDuration(callDuration);
      default:
        return '';
    }
  };

  // Switch camera (front/back)
  const switchCamera = async () => {
    if (!localStream) return;

    const videoTrack = localStream.getVideoTracks()[0];
    if (!videoTrack) return;

    const newFacing = useFrontCamera ? 'environment' : 'user';

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: newFacing },
        audio: false,
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace track in peer connection
      // Note: This is simplified - in production you'd need to replace the track in the RTCPeerConnection

      // Stop old track
      videoTrack.stop();

      // Update local stream
      localStream.removeTrack(videoTrack);
      localStream.addTrack(newVideoTrack);

      setUseFrontCamera(!useFrontCamera);
    } catch (e) {
      console.warn('Failed to switch camera:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black">
      {/* Hidden audio element for remote audio playback */}
      <audio
        ref={remoteAudioRef}
        autoPlay
        playsInline
        style={{ display: 'none' }}
      />

      {/* Video Area */}
      {callType === 'video' ? (
        <>
          {/* Remote Video (Full Screen) */}
          <div className="relative flex-1">
            {remoteStream ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[var(--background)]">
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[var(--fill-tertiary)]">
                  <User size={64} className="text-[var(--foreground-tertiary)]" />
                </div>
              </div>
            )}

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute right-4 top-safe-top mt-4 h-40 w-28 overflow-hidden rounded-[16px] bg-black shadow-lg">
              {localStream && !isVideoOff ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover"
                  style={{ transform: 'scaleX(-1)' }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[var(--fill-secondary)]">
                  <User size={32} className="text-[var(--foreground-tertiary)]" />
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Audio Call UI */
        <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-b from-[var(--system-blue)] to-[var(--system-blue)]/70">
          {/* Remote Avatar */}
          <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white/20">
            <User size={64} className="text-white" />
          </div>

          {/* Remote Name */}
          <h2 className="mb-2 text-2xl font-bold text-white">
            {remoteName}
          </h2>

          {/* Status */}
          <p className="text-white/80">
            {getStatusText()}
          </p>
        </div>
      )}

      {/* Call Info Overlay (for video calls) */}
      {callType === 'video' && (
        <div className="absolute left-0 right-0 top-safe-top p-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white drop-shadow-lg">
              {remoteName}
            </h2>
            <p className="text-sm text-white/80 drop-shadow-lg">
              {getStatusText()}
            </p>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="safe-area-bottom bg-black/50 backdrop-blur-xl">
        <div className="flex items-center justify-center gap-6 p-6">
          {/* Mute Button */}
          <button
            onClick={onToggleMute}
            className={`flex h-14 w-14 items-center justify-center rounded-full transition-none active:opacity-80 ${
              isMuted
                ? 'bg-white text-black'
                : 'bg-white/20 text-white'
            }`}
            aria-label={isMuted ? 'Stummschaltung aufheben' : 'Stumm schalten'}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </button>

          {/* Video Toggle (only for video calls) */}
          {callType === 'video' && (
            <button
              onClick={onToggleVideo}
              className={`flex h-14 w-14 items-center justify-center rounded-full transition-none active:opacity-80 ${
                isVideoOff
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white'
              }`}
              aria-label={isVideoOff ? 'Kamera einschalten' : 'Kamera ausschalten'}
            >
              {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
          )}

          {/* Switch Camera (only for video calls) */}
          {callType === 'video' && (
            <button
              onClick={switchCamera}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white transition-none active:opacity-80"
              aria-label="Kamera wechseln"
            >
              <RotateCcw size={24} />
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={onEndCall}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--system-red)] text-white transition-none active:opacity-80"
            aria-label="Auflegen"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}
