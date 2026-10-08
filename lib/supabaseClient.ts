import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function registrarTicketBaseDatos(carnetEscaneado: string, puerta: string, staffId: string): Promise<string> {
  try {
    const { data, error } = await supabase.rpc('registrar_checkin_atomico', {
      p_carnet: carnetEscaneado,
      p_dia: 1,
      p_puerta: puerta,
      p_staff_id: staffId
    });
    if (error) throw error;
    return data.status; 
  } catch (error) {
    console.error("Error en la transacción RPC:", error);
    throw error;
  }
}