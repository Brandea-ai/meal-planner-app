'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Smartphone, Camera, ArrowLeft, Info, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { getDeviceId } from '@/lib/supabase';

// Type for html5-qrcode (dynamically imported)
type Html5QrcodeType = import('html5-qrcode').Html5Qrcode;

interface DeviceSyncProps {
  onSync: (deviceId: string) => void;
  onClose: () => void;
}

export function DeviceSync({ onSync, onClose }: DeviceSyncProps) {
  const [mode, setMode] = useState<'choose' | 'show' | 'scan' | 'info' | 'success'>('choose');
  const [deviceId, setDeviceIdState] = useState<string>('');
  const [scanError, setScanError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDeviceId, setScannedDeviceId] = useState<string>('');
  const scannerRef = useRef<Html5QrcodeType | null>(null);
  const isScannerRunning = useRef(false); // Track if scanner is actually running
  const scannerContainerId = 'qr-scanner-container';

  // Get device ID on client side only (avoids hydration mismatch)
  useEffect(() => {
    setDeviceIdState(getDeviceId());
  }, []);

  // Safe scanner stop function
  const safeStopScanner = async () => {
    if (scannerRef.current && isScannerRunning.current) {
      try {
        await scannerRef.current.stop();
      } catch {
        // Silently ignore - scanner might already be stopped
      }
      isScannerRunning.current = false;
    }
    scannerRef.current = null;
  };

  useEffect(() => {
    // Cleanup scanner on unmount
    return () => {
      safeStopScanner();
    };
  }, []);

  const startScanner = async () => {
    setScanError(null);
    setIsScanning(true);

    try {
      // Dynamically import html5-qrcode to avoid SSR issues
      const { Html5Qrcode } = await import('html5-qrcode');

      // Check if container exists
      const container = document.getElementById(scannerContainerId);
      if (!container) {
        setScanError('Scanner-Container nicht gefunden');
        setIsScanning(false);
        return;
      }

      // Stop any existing scanner first
      await safeStopScanner();

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
            const newDeviceId = decodedText.replace('meal-planner:', '');
            isScannerRunning.current = false;
            setScannedDeviceId(newDeviceId);
            html5QrCode.stop().then(() => {
              scannerRef.current = null;
              setIsScanning(false);
              setMode('success');
            }).catch(() => {
              scannerRef.current = null;
              setIsScanning(false);
              setMode('success');
            });
          } else {
            setScanError('Ungültiger QR-Code. Bitte scanne einen gültigen Meal-Planner QR-Code.');
          }
        },
        () => {
          // Ignore scan errors (happens on every frame without QR code)
        }
      );

      // Mark scanner as running AFTER successful start
      isScannerRunning.current = true;
    } catch (err) {
      console.error('Scanner error:', err);
      isScannerRunning.current = false;
      scannerRef.current = null;

      const errorMessage = err instanceof Error ? err.message : 'Unbekannter Fehler';

      if (errorMessage.includes('Permission') || errorMessage.includes('NotAllowed')) {
        setScanError('Kamera-Zugriff verweigert. Bitte erlaube den Kamera-Zugriff in deinen Browser-Einstellungen.');
      } else if (errorMessage.includes('NotFound') || errorMessage.includes('DevicesNotFound')) {
        setScanError('Keine Kamera gefunden. Bitte stelle sicher, dass dein Gerät eine Kamera hat.');
      } else {
        setScanError('Kamera konnte nicht gestartet werden. Bitte versuche es erneut.');
      }
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    await safeStopScanner();
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
            <button
              onClick={() => setMode('info')}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fill-tertiary)] transition-none active:opacity-80"
              aria-label="Info"
            >
              <Info size={20} className="text-[var(--system-blue)]" />
            </button>
          )}
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {mode === 'choose' && 'Geräte verbinden'}
            {mode === 'show' && 'QR-Code zeigen'}
            {mode === 'scan' && 'QR-Code scannen'}
            {mode === 'info' && 'So funktioniert\'s'}
            {mode === 'success' && 'Erfolgreich!'}
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
              {deviceId ? (
                <QRCodeSVG
                  value={`meal-planner:${deviceId}`}
                  size={200}
                  level="M"
                  includeMargin
                />
              ) : (
                <div className="flex h-[200px] w-[200px] items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--fill-secondary)] border-t-[var(--system-blue)]" />
                </div>
              )}
            </div>
            <p className="text-center text-sm text-[var(--foreground-secondary)]">
              Scanne diesen QR-Code mit deinem anderen Gerät, um die Daten zu synchronisieren.
            </p>
            {deviceId && (
              <p className="text-center font-mono text-xs text-[var(--foreground-tertiary)]">
                ID: {deviceId.slice(0, 8)}...
              </p>
            )}
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

        {/* Info Section */}
        {mode === 'info' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-[10px] bg-[var(--fill-tertiary)] p-3">
                <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-[var(--system-green)]" />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Was wird synchronisiert?</p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Dein Fortschritt, Einstellungen, Einkaufsliste, Notizen und eigene Artikel werden auf allen verbundenen Geräten verfügbar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[10px] bg-[var(--fill-tertiary)] p-3">
                <Smartphone size={20} className="mt-0.5 flex-shrink-0 text-[var(--system-blue)]" />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Wie funktioniert es?</p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Zeige den QR-Code auf diesem Gerät und scanne ihn mit deinem anderen Gerät. Beide Geräte teilen dann dieselben Daten.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-[10px] bg-[var(--fill-tertiary)] p-3">
                <Info size={20} className="mt-0.5 flex-shrink-0 text-[var(--system-orange)]" />
                <div>
                  <p className="font-medium text-[var(--foreground)]">Wichtig zu wissen</p>
                  <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                    Nach dem Scannen werden die Daten des gescannten Geräts übernommen. Änderungen werden automatisch auf allen Geräten synchronisiert.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setMode('choose')}
              className="w-full rounded-[12px] bg-[var(--system-blue)] py-3.5 font-semibold text-white transition-none active:opacity-80"
            >
              Verstanden
            </button>
          </div>
        )}

        {/* Success Screen */}
        {mode === 'success' && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--system-green)]/15">
                <CheckCircle2 size={48} className="text-[var(--system-green)]" />
              </div>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-[var(--foreground)]">
                QR-Code erkannt!
              </h3>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">
                Du wirst mit dem anderen Gerät verbunden. Deine Daten werden synchronisiert.
              </p>
              {scannedDeviceId && (
                <p className="mt-2 font-mono text-xs text-[var(--foreground-tertiary)]">
                  Geräte-ID: {scannedDeviceId.slice(0, 8)}...
                </p>
              )}
            </div>

            <div className="rounded-[10px] bg-[var(--system-orange)]/15 p-3">
              <p className="text-sm text-[var(--system-orange)]">
                <strong>Hinweis:</strong> Nach dem Verbinden werden die Daten des anderen Geräts übernommen. Deine aktuellen lokalen Daten werden ersetzt.
              </p>
            </div>

            <button
              onClick={() => {
                onSync(scannedDeviceId);
              }}
              className="w-full rounded-[12px] bg-[var(--system-green)] py-3.5 font-semibold text-white transition-none active:opacity-80"
            >
              Jetzt verbinden
            </button>

            <button
              onClick={() => {
                setScannedDeviceId('');
                setMode('choose');
              }}
              className="w-full rounded-[12px] bg-[var(--fill-tertiary)] py-3 text-sm font-medium text-[var(--foreground)] transition-none active:opacity-80"
            >
              Abbrechen
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
