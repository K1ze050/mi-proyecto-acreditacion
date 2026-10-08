import * as jose from 'jose';

export async function decodificarQR(tokenJWT: string): Promise<string> {
  try {
    const publicKeyString = process.env.NEXT_PUBLIC_QR_PUBLIC_KEY;
    if (!publicKeyString) throw new Error('Falta la clave pública');

    const publicKey = await jose.importSPKI(publicKeyString, 'RS256');
    const { payload } = await jose.jwtVerify(tokenJWT, publicKey, {
      issuer: 'simposio-ing-xix',
    });
    
    return payload.sub as string;
  } catch (error) {
    throw new Error('INVALID_FORMAT_OR_EXPIRED');
  }
}