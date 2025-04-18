function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export default async function powMiddleware(req, next) {
  const encoder = new TextEncoder();

  // Tu peux générer un "fingerprint" basique (par ex. User-Agent + random)
  const fingerprint = navigator.userAgent + Math.random().toString(36).substring(2);
  const timestamp = Date.now().toString();

  let nonce = 0;
  const difficulty = 3; // nombre de zéros requis (même que backend)
  const targetPrefix = '0'.repeat(difficulty);

  let hashHex;

  while (true) {
    const data = fingerprint + timestamp + nonce;
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    hashHex = bufferToHex(hashBuffer);

    if (hashHex.startsWith(targetPrefix)) break;
    nonce++;
  }

  // Ajouter les headers requis
  req.options = req.options || {};
  req.options.headers = {
    ...(req.options.headers || {}),
    'X-Timestamp': timestamp,
    'X-Fingerprint': fingerprint,
    'X-PoW-Nonce': nonce,
    'X-PoW-Solution': hashHex,
  };

  await next();
}
