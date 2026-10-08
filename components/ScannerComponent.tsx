"use client";
import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface ScannerProps {
  onScanResult: (decodedText: string) => void;
  isProcessing: boolean;
}

export default function ScannerComponent({ onScanResult, isProcessing }: ScannerProps) {
  const scannerRegionId = "qr-reader";
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(scannerRegionId);
    scannerRef.current = html5QrCode;

    const config = {
      fps: 10, 
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0, 
    };

    html5QrCode.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        if (!isProcessing) {
          onScanResult(decodedText);
        }
      },
      (errorMessage) => {}
    ).catch((err) => {
      console.error("Error al iniciar la cámara. Verifica permisos HTTPS.", err);
    });

    return () => {
      if (html5QrCode.isScanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isProcessing, onScanResult]);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col justify-center items-center">
      <div id={scannerRegionId} className="w-full max-w-md h-full object-cover"></div>
      <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
        <div className="w-[250px] h-[250px] border-4 border-white/50 rounded-2xl relative shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
          <div className="w-full h-1 bg-green-400 absolute top-0 animate-[scan_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="mt-8 text-white font-semibold text-lg bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">
          Apunta el código QR del carné
        </p>
      </div>
    </div>
  );
}