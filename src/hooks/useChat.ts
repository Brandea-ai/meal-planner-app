'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, getDeviceId } from '@/lib/supabase';
import { ChatMessage, NewChatMessage, ChatExport, MealType } from '@/types';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: NewChatMessage) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  exportChat: () => ChatExport;
  senderName: string;
  setSenderName: (name: string) => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [senderName, setSenderNameState] = useState<string>('');
  const channelRef = useRef<RealtimeChannel | null>(null);
  const deviceIdRef = useRef<string>('');

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
          createdAt: msg.created_at,
          updatedAt: msg.updated_at,
        }));
        setMessages(formattedMessages);
      }
    } catch (e) {
      console.warn('Failed to load chat:', e);
      setError('Chat konnte nicht geladen werden');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newMsg = payload.new as Record<string, unknown>;
            const formattedMsg: ChatMessage = {
              id: newMsg.id as string,
              deviceId: newMsg.device_id as string,
              senderName: newMsg.sender_name as string,
              message: newMsg.message as string,
              messageType: (newMsg.message_type as ChatMessage['messageType']) || 'text',
              mealReference: newMsg.meal_reference as number | undefined,
              mealType: newMsg.meal_type as MealType | undefined,
              rating: newMsg.rating as number | undefined,
              createdAt: newMsg.created_at as string,
              updatedAt: newMsg.updated_at as string,
            };

            setMessages((prev) => {
              // Avoid duplicates
              if (prev.some((m) => m.id === formattedMsg.id)) {
                return prev;
              }
              return [...prev, formattedMsg];
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as { id: string }).id;
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Chat realtime subscription active');
        }
      });

    channelRef.current = channel;
  }, []);

  // Initialize
  useEffect(() => {
    const deviceId = getDeviceId();
    deviceIdRef.current = deviceId;
    loadMessages(deviceId);
    setupRealtimeSubscription(deviceId);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [loadMessages, setupRealtimeSubscription]);

  // Send a new message
  const sendMessage = useCallback(async (newMessage: NewChatMessage) => {
    const deviceId = deviceIdRef.current;
    if (!deviceId || !newMessage.message.trim()) return;

    try {
      const { error: insertError } = await supabase
        .from('chat_messages')
        .insert({
          device_id: deviceId,
          sender_name: newMessage.senderName || 'Anonym',
          message: newMessage.message.trim(),
          message_type: newMessage.messageType || 'text',
          meal_reference: newMessage.mealReference,
          meal_type: newMessage.mealType,
          rating: newMessage.rating,
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

  // Export chat as JSON for AI processing
  const exportChat = useCallback((): ChatExport => {
    const deviceId = deviceIdRef.current;
    const now = new Date();

    // Calculate week boundaries
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    // Calculate summary statistics
    const feedbackMessages = messages.filter((m) => m.messageType === 'feedback');
    const ratingsWithValues = feedbackMessages.filter((m) => m.rating != null);
    const averageRating = ratingsWithValues.length > 0
      ? ratingsWithValues.reduce((sum, m) => sum + (m.rating || 0), 0) / ratingsWithValues.length
      : null;

    // Count meal references
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
      messages,
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
    deleteMessage,
    exportChat,
    senderName,
    setSenderName,
  };
}
