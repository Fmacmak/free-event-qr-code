'use client';

import { useState, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (result: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: QRScannerProps) {
  const [scanner, setScanner] = useState<Html5Qrcode | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    // Initialize scanner
    const newScanner = new Html5Qrcode('reader');
    setScanner(newScanner);

    // Cleanup on unmount
    return () => {
      if (newScanner && isStarted) {
        newScanner.stop().catch(console.error);
      }
    };
  }, []);

  useEffect(() => {
    if (scanner && !isStarted) {
      startScanner();
    }
  }, [scanner]);

  const startScanner = async () => {
    if (!scanner) return;

    try {
      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // On successful scan
          scanner.stop().catch(console.error);
          onScan(decodedText);
        },
        (errorMessage) => {
          // Handle scan error (usually just not finding a QR code)
          console.log(errorMessage);
        }
      );
      setIsStarted(true);
    } catch (err) {
      console.error('Error starting scanner:', err);
    }
  };

  const handleClose = () => {
    if (scanner && isStarted) {
      scanner.stop().catch(console.error);
    }
    onClose();
  };

  return (
    <div className="flex flex-col items-center">
      <div id="reader" className="w-full max-w-sm aspect-square mb-4"></div>
      <Button variant="outline" onClick={handleClose}>
        Cancel
      </Button>
    </div>
  );
}