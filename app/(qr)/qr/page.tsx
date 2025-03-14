'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { checkInAttendee } from './actions';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { QRScanner } from '@/components/qr-scan';

export default function VerifyPage() {
  const [qrCode, setQrCode] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<{
    success?: boolean;
    message?: string;
    attendeeName?: string;
  }>({});
  const router = useRouter();

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!qrCode) return;
    
    try {
      const result = await checkInAttendee(qrCode);
      setVerificationStatus(result);
      if (result.success) {
        // Reset form after successful verification
        setQrCode('');
      }
    } catch (error) {
      setVerificationStatus({
        success: false,
        message: 'An error occurred during verification.',
      });
    }
  };

  const startScanner = () => {
    setIsScanning(true);
  };

  const handleScanResult = async (result: string) => {
    setIsScanning(false);
    setQrCode(result);
    
    try {
      const verificationResult = await checkInAttendee(result);
      setVerificationStatus(verificationResult);
      if (verificationResult.success) {
        // Reset form after successful verification
        setQrCode('');
      }
    } catch (error) {
      setVerificationStatus({
        success: false,
        message: 'An error occurred during verification.',
      });
    }
  };

  return (
    <div className="container mx-auto max-w-md py-12">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Attendee Check-in</h1>
        <p className="text-muted-foreground">
          Scan or enter the QR code to verify attendee registration
        </p>
      </div>

      {verificationStatus.message && (
        <Alert 
          variant={verificationStatus.success ? "default" : "destructive"} 
          className="mb-6"
        >
          {verificationStatus.success ? 
            <CheckCircle2 className="h-4 w-4" /> : 
            <AlertCircle className="h-4 w-4" />
          }
          <AlertTitle>
            {verificationStatus.success ? "Check-in Successful" : "Verification Failed"}
          </AlertTitle>
          <AlertDescription>
            {verificationStatus.success && verificationStatus.attendeeName ? 
              <>
                <p>{verificationStatus.message}</p>
                <p className="font-semibold mt-1">{verificationStatus.attendeeName}</p>
              </> : 
              verificationStatus.message
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="bg-card rounded-lg border shadow-sm p-6">
        {isScanning ? (
          <div className="mb-6">
            <QRScanner onScan={handleScanResult} onClose={() => setIsScanning(false)} />
          </div>
        ) : (
          <Button 
            onClick={startScanner} 
            className="w-full mb-6"
          >
            Scan QR Code
          </Button>
        )}

        <div className="text-center mb-4">
          <span className="text-muted-foreground">or</span>
        </div>

        <form onSubmit={handleManualSubmit}>
          <div className="mb-4">
            <label htmlFor="qrCode" className="block text-sm font-medium mb-2">
              Enter Registration ID
            </label>
            <input
              type="text"
              id="qrCode"
              value={qrCode}
              onChange={(e) => setQrCode(e.target.value)}
              className="w-full p-2 border rounded-md bg-muted"
              placeholder="e.g., ABC12345"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!qrCode}>
            Verify
          </Button>
        </form>
      </div>
    </div>
  );
}
