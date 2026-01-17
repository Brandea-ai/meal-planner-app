'use client';

import { useState, useEffect, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Html5Qrcode } from 'html5-qrcode';
import { getDeviceId } from '@/lib/supabase';

interface DeviceSyncProps {
  onSync: (deviceId: string) => void;
  onClose: () => void;
}

export function DeviceSync({ onSync, onClose }: DeviceSyncProps) {
  const [mode, setMode] = useState<'choose' | 'show' | 'scan'>('choose');
  const [deviceId] = useState(() => getDeviceId());
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = 'qr-scanner-container';

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    setScanError(null);
    setIsScanning(true);

    try {
      const html5QrCode = new Html5Qrcode(scannerContainerId);
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // QR Code successfully scanned
          if (decodedText.startsWith('meal-planner:')) {
            const scannedDeviceId = decodedText.replace('meal-planner:', '');
            html5QrCode.stop().then(() => {
              onSync(scannedDeviceId);
            });
          } else {
            setScanError('Ungültiger QR-Code');
          }
        },
        () => {
          // Ignore scan errors (happens on every frame without QR code)
        }
      );
    } catch (err) {
      console.error('Scanner error:', err);
      setScanError('Kamera konnte nicht gestartet werden. Bitte erlaube den Kamera-Zugriff.');
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      await scannerRef.current.stop();
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleShowQR = () => {
    setMode('show');
  };

  const handleScanQR = () => {
    setMode('scan');
    setTimeout(() => {
      startScanner();
    }, 100);
  };

  const handleBack = async () => {
    await stopScanner();
    setMode('choose');
    setScanError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 dark:bg-gray-800">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {mode === 'choose' && 'Geräte verbinden'}
            {mode === 'show' && 'QR-Code zeigen'}
            {mode === 'scan' && 'QR-Code scannen'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="Schließen"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Choose Mode */}
        {mode === 'choose' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Verbinde dieses Gerät mit einem anderen, um deine Daten zu synchronisieren.
            </p>

            <button
              onClick={handleShowQR}
              className="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900/50">
                📱
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">QR-Code zeigen</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scanne diesen Code mit dem anderen Gerät
                </p>
              </div>
            </button>

            <button
              onClick={handleScanQR}
              className="flex w-full items-center gap-4 rounded-xl border-2 border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50 dark:border-gray-600 dark:hover:border-blue-500 dark:hover:bg-blue-950/30"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl dark:bg-green-900/50">
                📷
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">QR-Code scannen</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Scanne den Code vom anderen Gerät
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Show QR Code */}
        {mode === 'show' && (
          <div className="space-y-4">
            <div className="flex justify-center rounded-xl bg-white p-4">
              <QRCodeSVG
                value={`meal-planner:${deviceId}`}
                size={200}
                level="M"
                includeMargin
              />
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Scanne diesen QR-Code mit deinem anderen Gerät, um die Daten zu synchronisieren.
            </p>
            <button
              onClick={handleBack}
              className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Zurück
            </button>
          </div>
        )}

        {/* Scan QR Code */}
        {mode === 'scan' && (
          <div className="space-y-4">
            <div
              id={scannerContainerId}
              className="overflow-hidden rounded-xl bg-black"
              style={{ minHeight: 250 }}
            />

            {scanError && (
              <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
                {scanError}
              </div>
            )}

            {isScanning && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Halte die Kamera auf den QR-Code des anderen Geräts
              </p>
            )}

            <button
              onClick={handleBack}
              className="w-full rounded-xl bg-gray-100 py-3 font-semibold text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
