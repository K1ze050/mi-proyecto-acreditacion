import { registrarTicketBaseDatos } from './supabaseClient';

export async function procesarCheckinCondicional(carnetEscaneado: string, puerta: string, staffId: string): Promise<string> {
  const isOnline = typeof window !== 'undefined' && window.navigator.onLine;

  if (isOnline) {
    try {
      return await registrarTicketBaseDatos(carnetEscaneado, puerta, staffId);
    } catch (error) {
      console.warn('⚠️ Falló Supabase. Pasando a modo offline...', error);
      return await procesarLocalmente(carnetEscaneado, puerta, staffId);
    }
  } else {
    return await procesarLocalmente(carnetEscaneado, puerta, staffId);
  }
}

async function procesarLocalmente(carnet: string, puerta: string, staffId: string): Promise<string> {
  try {
    // Espacio reservado para el Dev 4 (IndexedDB Dexie.js)
    console.log(`Guardando carnet ${carnet} en IndexedDB para Background Sync.`);
    return new Promise(resolve => setTimeout(() => resolve('OK'), 150)); 
  } catch (error) {
    return 'ERROR';
  }
}