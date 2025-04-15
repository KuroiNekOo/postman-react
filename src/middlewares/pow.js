function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }
  
  export default async function powMiddleware(req, next) {
    const encoder = new TextEncoder();
    const challenge = "test";
    let nonce = 0;
  
    const targetPrefix = '000';
  
    while (true) {
      const data = `${challenge}${nonce}`;
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(data));
      const hashHex = bufferToHex(hashBuffer);
  
      if (hashHex.startsWith(targetPrefix)) break;
      nonce++;
    }
  
    // Injecter la preuve de travail dans les headers
    req.options.headers = {
      ...(req.options.headers || {}),
      'X-PoW-Challenge': challenge,
      'X-PoW-Nonce': nonce,
    };

    req.body = {
        ...req.body,
        challenge: challenge,
        nonce,
    }
  
    await next();
  }