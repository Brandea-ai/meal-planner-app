'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Smartphone, Camera, ArrowLeft } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-sm rounded-t-[20px] bg-[var(--background)] p-6 sm:rounded-[20px]">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {mode !== 'choose' ? (
            <button
              onClick={handleBack}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-tertiary)] transition-none active:opacity-80"
              aria-label="Zurück"
            >
              <ArrowLeft size={20} className="text-[var(--foreground)]" />
            </button>
          ) : (
            <div className="w-10" />
          )}
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {mode === 'choose' && 'Geräte verbinden'}
            {mode === 'show' && 'QR-Code zeigen'}
            {mode === 'scan' && 'QR-Code scannen'}
          </h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-tertiary)] transition-none active:opacity-80"
            aria-label="Schließen"
          >
            <X size={20} className="text-[var(--foreground)]" />
          </button>
        </div>

        {/* Choose Mode */}
        {mode === 'choose' && (
          <div className="space-y-3">
            <p className="text-center text-sm text-[var(--foreground-secondary)]">
              Verbinde dieses Gerät mit einem anderen, um deine Daten zu synchronisieren.
            </p>

            <button
              onClick={handleShowQR}
              className="flex w-full items-center gap-4 rounded-[12px] bg-[var(--fill-tertiary)] p-4 text-left transition-none active:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-blue)]">
                <Smartphone size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">QR-Code zeigen</p>
                <p className="text-sm text-[var(--foreground-tertiary)]">
                  Scanne diesen Code mit dem anderen Gerät
                </p>
              </div>
            </button>

            <button
              onClick={handleScanQR}
              className="flex w-full items-center gap-4 rounded-[12px] bg-[var(--fill-tertiary)] p-4 text-left transition-none active:opacity-80"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--system-green)]">
                <Camera size={24} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-[var(--foreground)]">QR-Code scannen</p>
                <p className="text-sm text-[var(--foreground-tertiary)]">
                  Scanne den Code vom anderen Gerät
                </p>
              </div>
            </button>
          </div>
        )}

        {/* Show QR Code */}
        {mode === 'show' && (
          <div className="space-y-4">
            <div className="flex justify-center rounded-[12px] bg-white p-6">
              <QRCodeSVG
                value={`meal-planner:${deviceId}`}
                size={200}
                level="M"
                includeMargin
              />
            </div>
            <p className="text-center text-sm text-[var(--foreground-secondary)]">
              Scanne diesen QR-Code mit deinem anderen Gerät, um die Daten zu synchronisieren.
            </p>
          </div>
        )}

        {/* Scan QR Code */}
        {mode === 'scan' && (
          <div className="space-y-4">
            <div
              id={scannerContainerId}
              className="overflow-hidden rounded-[12px] bg-black"
              style={{ minHeight: 250 }}
            />

            {scanError && (
              <div className="rounded-[10px] bg-[var(--system-red)]/15 p-3 text-sm text-[var(--system-red)]">
                {scanError}
              </div>
            )}

            {isScanning && (
              <p className="text-center text-sm text-[var(--foreground-secondary)]">
                Halte die Kamera auf den QR-Code des anderen Geräts
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
