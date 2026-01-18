'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  error?: string;
  duration?: number;
}

export default function TestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [deviceId] = useState(() => `test-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const updateTest = (name: string, update: Partial<TestResult>) => {
    setResults(prev => prev.map(r => r.name === name ? { ...r, ...update } : r));
  };

  const runTests = async () => {
    setIsRunning(true);
    setLogs([]);

    const tests: TestResult[] = [
      { name: 'Supabase Verbindung', status: 'pending' },
      { name: 'call_signals Tabelle', status: 'pending' },
      { name: 'Chat Nachrichten', status: 'pending' },
      { name: 'Anruf-Signalisierung', status: 'pending' },
      { name: 'Realtime Subscription', status: 'pending' },
      { name: 'Kamera-Zugriff', status: 'pending' },
      { name: 'Mikrofon-Zugriff', status: 'pending' },
      { name: 'WebRTC Peer Connection', status: 'pending' },
      { name: 'ICE Candidate Gathering', status: 'pending' },
      { name: 'Notification Permission', status: 'pending' },
    ];

    setResults(tests);

    // Test 1: Supabase Verbindung
    addLog('Teste Supabase Verbindung...');
    updateTest('Supabase Verbindung', { status: 'running' });
    const start1 = Date.now();
    try {
      const { error } = await supabase.from('chat_messages').select('count').limit(1);
      if (error) throw error;
      updateTest('Supabase Verbindung', { status: 'passed', duration: Date.now() - start1 });
      addLog('✅ Supabase verbunden');
    } catch (e) {
      updateTest('Supabase Verbindung', { status: 'failed', error: String(e), duration: Date.now() - start1 });
      addLog('❌ Supabase Fehler: ' + String(e));
    }

    // Test 2: call_signals Tabelle
    addLog('Teste call_signals Tabelle...');
    updateTest('call_signals Tabelle', { status: 'running' });
    const start2 = Date.now();
    try {
      const { error } = await supabase.from('call_signals').select('count').limit(1);
      if (error) throw error;
      updateTest('call_signals Tabelle', { status: 'passed', duration: Date.now() - start2 });
      addLog('✅ call_signals existiert');
    } catch (e) {
      updateTest('call_signals Tabelle', { status: 'failed', error: String(e), duration: Date.now() - start2 });
      addLog('❌ call_signals Fehler: ' + String(e));
    }

    // Test 3: Chat Nachrichten
    addLog('Teste Chat Nachrichten...');
    updateTest('Chat Nachrichten', { status: 'running' });
    const start3 = Date.now();
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          device_id: deviceId,
          sender_name: 'Test User',
          message: 'Test Nachricht ' + Date.now(),
          message_type: 'text',
        })
        .select()
        .single();
      if (error) throw error;
      // Cleanup
      await supabase.from('chat_messages').delete().eq('id', data.id);
      updateTest('Chat Nachrichten', { status: 'passed', duration: Date.now() - start3 });
      addLog('✅ Chat Nachricht gesendet & gelöscht');
    } catch (e) {
      updateTest('Chat Nachrichten', { status: 'failed', error: String(e), duration: Date.now() - start3 });
      addLog('❌ Chat Fehler: ' + String(e));
    }

    // Test 4: Anruf-Signalisierung
    addLog('Teste Anruf-Signalisierung...');
    updateTest('Anruf-Signalisierung', { status: 'running' });
    const start4 = Date.now();
    try {
      const { data, error } = await supabase
        .from('call_signals')
        .insert({
          device_id: deviceId,
          target_device_id: 'test-target',
          caller_name: 'Test Caller',
          signal_type: 'call-request',
          call_type: 'video',
        })
        .select()
        .single();
      if (error) throw error;
      // Cleanup
      await supabase.from('call_signals').delete().eq('id', data.id);
      updateTest('Anruf-Signalisierung', { status: 'passed', duration: Date.now() - start4 });
      addLog('✅ Anruf-Signal gesendet & gelöscht');
    } catch (e) {
      updateTest('Anruf-Signalisierung', { status: 'failed', error: String(e), duration: Date.now() - start4 });
      addLog('❌ Anruf-Signal Fehler: ' + String(e));
    }

    // Test 5: Realtime Subscription
    addLog('Teste Realtime Subscription...');
    updateTest('Realtime Subscription', { status: 'running' });
    const start5 = Date.now();
    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          channel.unsubscribe();
          reject(new Error('Timeout nach 5s'));
        }, 5000);

        const channel = supabase
          .channel('test-' + deviceId)
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'call_signals' },
            async (payload) => {
              clearTimeout(timeout);
              channel.unsubscribe();
              await supabase.from('call_signals').delete().eq('id', payload.new.id);
              resolve();
            }
          )
          .subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              addLog('   Subscription aktiv, sende Test-Signal...');
              await supabase.from('call_signals').insert({
                device_id: deviceId + '-realtime',
                target_device_id: 'realtime-test',
                caller_name: 'Realtime Test',
                signal_type: 'call-request',
                call_type: 'audio',
              });
            }
          });
      });
      updateTest('Realtime Subscription', { status: 'passed', duration: Date.now() - start5 });
      addLog('✅ Realtime funktioniert');
    } catch (e) {
      updateTest('Realtime Subscription', { status: 'failed', error: String(e), duration: Date.now() - start5 });
      addLog('❌ Realtime Fehler: ' + String(e));
    }

    // Test 6: Kamera-Zugriff
    addLog('Teste Kamera-Zugriff...');
    updateTest('Kamera-Zugriff', { status: 'running' });
    const start6 = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(t => t.stop());
      updateTest('Kamera-Zugriff', { status: 'passed', duration: Date.now() - start6 });
      addLog('✅ Kamera Zugriff erlaubt');
    } catch (e) {
      updateTest('Kamera-Zugriff', { status: 'failed', error: String(e), duration: Date.now() - start6 });
      addLog('❌ Kamera Fehler: ' + String(e));
    }

    // Test 7: Mikrofon-Zugriff
    addLog('Teste Mikrofon-Zugriff...');
    updateTest('Mikrofon-Zugriff', { status: 'running' });
    const start7 = Date.now();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
      updateTest('Mikrofon-Zugriff', { status: 'passed', duration: Date.now() - start7 });
      addLog('✅ Mikrofon Zugriff erlaubt');
    } catch (e) {
      updateTest('Mikrofon-Zugriff', { status: 'failed', error: String(e), duration: Date.now() - start7 });
      addLog('❌ Mikrofon Fehler: ' + String(e));
    }

    // Test 8: WebRTC Peer Connection
    addLog('Teste WebRTC Peer Connection...');
    updateTest('WebRTC Peer Connection', { status: 'running' });
    const start8 = Date.now();
    try {
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
        ]
      });
      pc.createDataChannel('test');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      pc.close();
      updateTest('WebRTC Peer Connection', { status: 'passed', duration: Date.now() - start8 });
      addLog('✅ WebRTC PeerConnection erstellt');
    } catch (e) {
      updateTest('WebRTC Peer Connection', { status: 'failed', error: String(e), duration: Date.now() - start8 });
      addLog('❌ WebRTC Fehler: ' + String(e));
    }

    // Test 9: ICE Candidate Gathering
    addLog('Teste ICE Candidate Gathering...');
    updateTest('ICE Candidate Gathering', { status: 'running' });
    const start9 = Date.now();
    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          pc.close();
          reject(new Error('ICE Timeout nach 10s'));
        }, 10000);

        const pc = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            {
              urls: 'turn:openrelay.metered.ca:80',
              username: 'openrelayproject',
              credential: 'openrelayproject',
            },
          ]
        });

        let foundCandidate = false;
        pc.onicecandidate = (event) => {
          if (event.candidate && !foundCandidate) {
            foundCandidate = true;
            addLog(`   ICE Candidate: ${event.candidate.type} - ${event.candidate.protocol}`);
          }
        };

        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === 'complete') {
            clearTimeout(timeout);
            pc.close();
            if (foundCandidate) {
              resolve();
            } else {
              reject(new Error('Keine ICE Candidates gefunden'));
            }
          }
        };

        pc.createDataChannel('test');
        pc.createOffer().then(offer => pc.setLocalDescription(offer));
      });
      updateTest('ICE Candidate Gathering', { status: 'passed', duration: Date.now() - start9 });
      addLog('✅ ICE Candidates gefunden');
    } catch (e) {
      updateTest('ICE Candidate Gathering', { status: 'failed', error: String(e), duration: Date.now() - start9 });
      addLog('❌ ICE Fehler: ' + String(e));
    }

    // Test 10: Notification Permission
    addLog('Teste Notification Permission...');
    updateTest('Notification Permission', { status: 'running' });
    const start10 = Date.now();
    try {
      if (!('Notification' in window)) {
        throw new Error('Notifications nicht unterstützt');
      }
      const permission = Notification.permission;
      if (permission === 'granted') {
        updateTest('Notification Permission', { status: 'passed', duration: Date.now() - start10 });
        addLog('✅ Notifications erlaubt');
      } else if (permission === 'denied') {
        updateTest('Notification Permission', { status: 'failed', error: 'Notifications blockiert', duration: Date.now() - start10 });
        addLog('❌ Notifications blockiert');
      } else {
        updateTest('Notification Permission', { status: 'failed', error: 'Noch nicht angefragt', duration: Date.now() - start10 });
        addLog('⚠️ Notifications noch nicht angefragt');
      }
    } catch (e) {
      updateTest('Notification Permission', { status: 'failed', error: String(e), duration: Date.now() - start10 });
      addLog('❌ Notification Fehler: ' + String(e));
    }

    setIsRunning(false);
    addLog('🏁 Alle Tests abgeschlossen');
  };

  const testInAppNotification = () => {
    addLog('Zeige Test-Notification...');
    // This would trigger the notification system - for now just show an alert
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Nachricht', {
        body: 'Dies ist eine Test-Benachrichtigung',
        icon: '/icon-192x192.png',
      });
      addLog('✅ Browser-Notification gesendet');
    } else {
      addLog('⚠️ Notifications nicht verfügbar');
    }
  };

  const passedCount = results.filter(r => r.status === 'passed').length;
  const failedCount = results.filter(r => r.status === 'failed').length;
  const totalDuration = results.reduce((sum, r) => sum + (r.duration || 0), 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">🧪 Systemtest</h1>
        <p className="text-gray-400 mb-6">Meal Planner App - Umfassender Funktionstest</p>

        <div className="flex gap-4 mb-6">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            {isRunning ? '⏳ Tests laufen...' : '▶️ Tests starten'}
          </button>
          <button
            onClick={testInAppNotification}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
          >
            🔔 Test Notification
          </button>
          <a
            href="/"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
          >
            ← Zurück zur App
          </a>
        </div>

        {results.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 Ergebnisse</h2>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-green-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-400">{passedCount}</div>
                <div className="text-green-300">Bestanden</div>
              </div>
              <div className="bg-red-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-400">{failedCount}</div>
                <div className="text-red-300">Fehlgeschlagen</div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-blue-400">{totalDuration}ms</div>
                <div className="text-blue-300">Gesamtdauer</div>
              </div>
            </div>

            <div className="space-y-2">
              {results.map((result) => (
                <div
                  key={result.name}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    result.status === 'passed' ? 'bg-green-900/20' :
                    result.status === 'failed' ? 'bg-red-900/20' :
                    result.status === 'running' ? 'bg-yellow-900/20' :
                    'bg-gray-700/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">
                      {result.status === 'passed' ? '✅' :
                       result.status === 'failed' ? '❌' :
                       result.status === 'running' ? '⏳' : '⏸️'}
                    </span>
                    <span>{result.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    {result.error && (
                      <span className="text-sm text-red-400 max-w-xs truncate" title={result.error}>
                        {result.error}
                      </span>
                    )}
                    {result.duration !== undefined && (
                      <span className="text-sm text-gray-400">{result.duration}ms</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">📜 Log</h2>
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <span className="text-gray-500">Klicke auf &quot;Tests starten&quot; um zu beginnen...</span>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="text-gray-300">{log}</div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          Device ID: {deviceId}
        </div>
      </div>
    </div>
  );
}
