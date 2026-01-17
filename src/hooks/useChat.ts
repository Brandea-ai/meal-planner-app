'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId } from '@/lib/supabase';
import { ChatMessage, NewChatMessage, ChatExport, MealType } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';
import {
  encryptMessage,
  decryptMessage,
  getStoredPassword,
  storePassword,
  hasPasswordSetup,
  verifyStoredPassword,
} from '@/lib/crypto';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: NewChatMessage) => Promise<void>;
  updateMessage: (messageId: string, newText: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  exportChat: () => ChatExport;
  senderName: string;
  setSenderName: (name: string) => void;
  // Encryption
  isEncrypted: boolean;
  needsPassword: boolean;
  isPasswordSetup: boolean;
  setPassword: (password: string) => Promise<void>;
  verifyPassword: (password: string) => Promise<boolean>;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [senderName, setSenderNameState] = useState<string>('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [isPasswordSetup, setIsPasswordSetup] = useState(false);
  const [password, setPasswordState] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasEncryptedMessages, setHasEncryptedMessages] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const deviceIdRef = useRef<string>('');
  const passwordRef = useRef<string | null>(null);
  const firstMessageRef = useRef<string | null>(null);

  // Check if there are existing encrypted messages in the database
  const checkForEncryptedMessages = useCallback(async (deviceId: string): Promise<boolean> => {
    try {
      const { data } = await supabase
        .from('chat_messages')
        .select('message')
        .eq('device_id', deviceId)
        .limit(1);

      if (data && data.length > 0) {
        const msg = data[0].message;
        // Check if message looks like base64 encrypted data (not plain text)
        // Encrypted messages are base64 and typically start with letters/numbers
        // and don't contain normal sentence patterns
        const isEncrypted = /^[A-Za-z0-9+/=]{20,}$/.test(msg);
        if (isEncrypted) {
          firstMessageRef.current = msg;
        }
        return isEncrypted;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  // Check encryption status on mount
  useEffect(() => {
    const initEncryption = async () => {
      if (typeof window === 'undefined') return;

      const deviceId = getDeviceId();
      deviceIdRef.current = deviceId;

      const hasSetup = hasPasswordSetup();
      const storedPassword = getStoredPassword();

      // Check if there are encrypted messages in database
      const hasExisting = await checkForEncryptedMessages(deviceId);
      setHasEncryptedMessages(hasExisting);

      if (storedPassword) {
        passwordRef.current = storedPassword;
        setPasswordState(storedPassword);
        setNeedsPassword(false);
        setIsPasswordSetup(true);
      } else if (hasSetup || hasExisting) {
        // Need password if local setup exists OR if there are encrypted messages
        setNeedsPassword(true);
        setIsPasswordSetup(hasExisting); // Treat as setup if encrypted messages exist
      }
    };

    initEncryption();
  }, [checkForEncryptedMessages]);

  // Load sender name from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('meal-planner-sender-name') || '';
      setSenderNameState(savedName);
    }
  }, []);

  // Save sender name to localStorage
  const setSenderName = useCallback((name: string) => {
    setSenderNameState(name);
    if (typeof window !== 'undefined') {
      localStorage.setItem('meal-planner-sender-name', name);
    }
  }, []);

  // Decrypt a message
  const decryptMessageContent = useCallback(async (encryptedMessage: string): Promise<string> => {
    const pwd = passwordRef.current;
    if (!pwd) return encryptedMessage;

    try {
      return await decryptMessage(encryptedMessage, pwd);
    } catch {
      return '[Verschlüsselt]';
    }
  }, []);

  // Decrypt all messages
  const decryptMessages = useCallback(async (encryptedMessages: ChatMessage[]): Promise<ChatMessage[]> => {
    const pwd = passwordRef.current;
    if (!pwd) return encryptedMessages;

    return Promise.all(
      encryptedMessages.map(async (msg) => ({
        ...msg,
        message: await decryptMessageContent(msg.message),
      }))
    );
  }, [decryptMessageContent]);

  // Load messages from Supabase
  const loadMessages = useCallback(async (deviceId: string) => {
    if (!deviceId) return;

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: true });

      if (fetchError) {
        console.warn('Error loading chat messages:', fetchError);
        setError('Chat konnte nicht geladen werden');
      } else {
        const formattedMessages: ChatMessage[] = (data || []).map((msg) => ({
          id: msg.id,
          deviceId: msg.device_id,
          senderName: msg.sender_name,
          message: msg.message,
          messageType: msg.message_type || 'text',
          mealReference: msg.meal_reference,
          mealType: msg.meal_type,
          rating: msg.rating,
          replyTo: msg.reply_to,
          isEdited: msg.is_edited || false,
          createdAt: msg.created_at,
          updatedAt: msg.updated_at,
        }));

        // Decrypt messages if password is available
        if (passwordRef.current) {
          const decrypted = await decryptMessages(formattedMessages);
          setMessages(decrypted);
        } else {
          setMessages(formattedMessages);
        }
      }
    } catch (e) {
      console.warn('Failed to load chat:', e);
      setError('Chat konnte nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, [decryptMessages]);

  // Setup realtime subscription
  const setupRealtimeSubscription = useCallback((deviceId: string) => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (!deviceId) return;

    const channel = supabase
      .channel(`chat_messages_${deviceId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages',
          filter: `device_id=eq.${deviceId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Record<string, unknown>;
            let messageText = newMsg.message as string;

            // Decrypt if password available
            if (passwordRef.current) {
              try {
                messageText = await decryptMessage(messageText, passwordRef.current);
              } catch {
                messageText = '[Verschlüsselt]';
              }
            }

            const formattedMsg: ChatMessage = {
              id: newMsg.id as string,
              deviceId: newMsg.device_id as string,
              senderName: newMsg.sender_name as string,
              message: messageText,
              messageType: (newMsg.message_type as ChatMessage['messageType']) || 'text',
              mealReference: newMsg.meal_reference as number | undefined,
              mealType: newMsg.meal_type as MealType | undefined,
              rating: newMsg.rating as number | undefined,
              replyTo: newMsg.reply_to as string | undefined,
              isEdited: (newMsg.is_edited as boolean) || false,
              createdAt: newMsg.created_at as string,
              updatedAt: newMsg.updated_at as string,
            };

            setMessages((prev) => {
              if (prev.some((m) => m.id === formattedMsg.id)) {
                return prev;
              }
              return [...prev, formattedMsg];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedMsg = payload.new as Record<string, unknown>;
            let messageText = updatedMsg.message as string;

            // Decrypt if password available
            if (passwordRef.current) {
              try {
                messageText = await decryptMessage(messageText, passwordRef.current);
              } catch {
                messageText = '[Verschlüsselt]';
              }
            }

            const formattedMsg: ChatMessage = {
              id: updatedMsg.id as string,
              deviceId: updatedMsg.device_id as string,
              senderName: updatedMsg.sender_name as string,
              message: messageText,
              messageType: (updatedMsg.message_type as ChatMessage['messageType']) || 'text',
              mealReference: updatedMsg.meal_reference as number | undefined,
              mealType: updatedMsg.meal_type as MealType | undefined,
              rating: updatedMsg.rating as number | undefined,
              replyTo: updatedMsg.reply_to as string | undefined,
              isEdited: (updatedMsg.is_edited as boolean) || false,
              createdAt: updatedMsg.created_at as string,
              updatedAt: updatedMsg.updated_at as string,
            };

            setMessages((prev) =>
              prev.map((m) => (m.id === formattedMsg.id ? formattedMsg : m))
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Chat realtime subscription active (encrypted)');
        }
      });

    channelRef.current = channel;
  }, []);

  // Initialize
  useEffect(() => {
    const deviceId = getDeviceId();
    deviceIdRef.current = deviceId;

    // Only load messages if we have password or encryption isn't set up yet
    if (passwordRef.current || !hasPasswordSetup()) {
      loadMessages(deviceId);
      setupRealtimeSubscription(deviceId);
    }

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [loadMessages, setupRealtimeSubscription]);

  // Set password (for both new setup and login)
  const setPassword = useCallback(async (pwd: string) => {
    passwordRef.current = pwd;
    setPasswordState(pwd);
    storePassword(pwd);
    setNeedsPassword(false);
    setIsPasswordSetup(true);

    // Reload and decrypt messages
    const deviceId = deviceIdRef.current;
    if (deviceId) {
      await loadMessages(deviceId);
      setupRealtimeSubscription(deviceId);
    }
  }, [loadMessages, setupRealtimeSubscription]);

  // Verify password by trying to decrypt an existing message
  const verifyPasswordFn = useCallback(async (pwd: string): Promise<boolean> => {
    // First check local hash if available
    const localValid = await verifyStoredPassword(pwd);
    if (localValid) return true;

    // If there are encrypted messages, try to decrypt one
    if (firstMessageRef.current) {
      try {
        const decrypted = await decryptMessage(firstMessageRef.current, pwd);
        // If decryption returns error message, password is wrong
        if (decrypted.includes('[Entschlüsselung fehlgeschlagen')) {
          return false;
        }
        // Decryption succeeded - password is correct
        return true;
      } catch {
        return false;
      }
    }

    // No encrypted messages and no local hash - this is a new setup
    return true;
  }, []);

  // Send a new message (encrypted)
  const sendMessage = useCallback(async (newMessage: NewChatMessage) => {
    const deviceId = deviceIdRef.current;
    const pwd = passwordRef.current;
    if (!deviceId || !newMessage.message.trim()) return;

    try {
      // Encrypt the message if password is set
      let messageToSend = newMessage.message.trim();
      if (pwd) {
        messageToSend = await encryptMessage(messageToSend, pwd);
      }

      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          device_id: deviceId,
          sender_name: newMessage.senderName || 'Anonym',
          message: messageToSend,
          message_type: newMessage.messageType || 'text',
          meal_reference: newMessage.mealReference,
          meal_type: newMessage.mealType,
          rating: newMessage.rating,
          reply_to: newMessage.replyTo,
        });

      if (insertError) {
        console.warn('Error sending message:', insertError);
        setError('Nachricht konnte nicht gesendet werden');
      }
    } catch (e) {
      console.warn('Failed to send message:', e);
      setError('Nachricht konnte nicht gesendet werden');
    }
  }, []);

  // Update an existing message (encrypted)
  const updateMessage = useCallback(async (messageId: string, newText: string) => {
    const pwd = passwordRef.current;
    if (!newText.trim()) return;

    try {
      // Encrypt the message if password is set
      let messageToSend = newText.trim();
      if (pwd) {
        messageToSend = await encryptMessage(messageToSend, pwd);
      }

      const { error: updateError } = await supabase
        .from('chat_messages')
        .update({
          message: messageToSend,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (updateError) {
        console.warn('Error updating message:', updateError);
        setError('Nachricht konnte nicht bearbeitet werden');
      }
    } catch (e) {
      console.warn('Failed to update message:', e);
      setError('Nachricht konnte nicht bearbeitet werden');
    }
  }, []);

  // Delete a message
  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (deleteError) {
        console.warn('Error deleting message:', deleteError);
        setError('Nachricht konnte nicht gelöscht werden');
      }
    } catch (e) {
      console.warn('Failed to delete message:', e);
      setError('Nachricht konnte nicht gelöscht werden');
    }
  }, []);

  // Export chat as JSON for AI processing (decrypted)
  const exportChat = useCallback((): ChatExport => {
    const deviceId = deviceIdRef.current;
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const feedbackMessages = messages.filter((m) => m.messageType === 'feedback');
    const ratingsWithValues = feedbackMessages.filter((m) => m.rating != null);
    const averageRating = ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, m) => sum + (m.rating || 0), 0) / ratingsWithValues.length
      : null;

    const mealCounts: Record<string, number> = {};
    messages.forEach((m) => {
      if (m.mealReference && m.mealType) {
        const key = `${m.mealReference}-${m.mealType}`;
        mealCounts[key] = (mealCounts[key] || 0) + 1;
      }
    });

    const topDiscussedMeals = Object.entries(mealCounts)
      .map(([key, count]) => {
        const [day, mealType] = key.split('-');
        return { day: parseInt(day), mealType: mealType as MealType, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      exportedAt: now.toISOString(),
      deviceId,
      weekStart: weekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      messages, // Already decrypted in state
      summary: {
        totalMessages: messages.length,
        feedbackCount: feedbackMessages.length,
        averageRating,
        topDiscussedMeals,
      },
    };
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    updateMessage,
    deleteMessage,
    exportChat,
    senderName,
    setSenderName,
    // Encryption
    isEncrypted: !!password,
    needsPassword,
    isPasswordSetup,
    setPassword,
    verifyPassword: verifyPasswordFn,
  };
}
