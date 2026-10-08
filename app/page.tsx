"use client";
import { useState } from "react";
import ScannerComponent from "@/components/ScannerComponent";
import SemaphoreOverlay from "@/components/SemaphoreOverlay";
import { procesarCheckinCondicional } from "@/lib/offlineFallback";
import { decodificarQR } from "@/lib/qrDecoder";

// Definimos los tipos de estado permitidos para evitar errores de TypeScript
type AppState = 'IDLE' | 'PROCESSING' | 'OK' | 'ALERTA' | 'ERROR';

export default function LectorPuertaPage() {
  const [appState, setAppState] = useState<AppState>('IDLE'); 
  
  const handleScanResult = async (decodedText: string) => {
    setAppState('PROCESSING');
    
    try {
      // 1. Decodificar la firma criptográfica del Dev 1
      const carnetOficial = await decodificarQR(decodedText);
      
      // 2. Procesar validando estado de red (Supabase o IndexedDB)
      const statusResult = await procesarCheckinCondicional(carnetOficial, 'Puerta 1', 'operador_1');
      
      // 3. Feedback visual y auditivo
      if (statusResult === 'OK') {
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]); 
        new Audio('/Sonido acierto.mp3').play().catch(e => console.warn('Audio bloqueado', e));
        setAppState('OK');
      } else {
        if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200]); 
        new Audio('/Sonido error.mp3').play().catch(e => console.warn('Audio bloqueado', e));
        setAppState('ALERTA');
      }

    } catch (error) {
      console.error("QR Rechazado o Error Crítico:", error);
      if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200]);
      new Audio('/Sonido error.mp3').play().catch(e => console.warn('Audio bloqueado', e));
      setAppState('ERROR');
    }
    
    // Restaurar escáner a los 2.5 segundos
    setTimeout(() => {
      setAppState((prev) => (prev !== 'IDLE' ? 'IDLE' : prev));
    }, 2500);
  };

  const handleDismissSemaphore = () => {
    setAppState('IDLE');
  };

  return (
    <main className="w-full h-screen bg-black">
      <ScannerComponent 
        onScanResult={handleScanResult} 
        isProcessing={appState !== 'IDLE'} 
      />
      <SemaphoreOverlay 
        status={appState === 'PROCESSING' ? 'IDLE' : appState} 
        onDismiss={handleDismissSemaphore} 
      />
    </main>
  );
}