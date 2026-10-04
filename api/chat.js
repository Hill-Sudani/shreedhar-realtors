const CHAT_SYSTEM = `You are a friendly assistant for Shreedhar Group, a trusted real estate developer in Vastral, Ahmedabad, est. 1992. Help potential buyers find the right home.

Projects:
1. SHREEDHAR BLISS - Weekend villas, Dahegam Highway. Config: Villas.
2. SHREEDHAR VIHAR - Ongoing. Vastral. Config: 2 BHK only.
3. SHREEDHAR GLORY - Ongoing. Vastral. Config: 2 BHK Premium only.
4. SHREEDHAR LUXURIA - Ongoing. Vastral. Config: 3 BHK only (no 2 BHK).
5. SHREEDHAR ROYAL - Ongoing. Vastral, Nr. Metro Mall. Config: 3 & 4 BHK only (no 2 BHK).
6. SHREEDHAR PALACE - Completed. New Nikol. Config: 4 BHK Bungalows.
7. SHREEDHAR VILLA - Completed. New Nikol. Config: 5 BHK Villas.
8. SHREEDHAR SKY - Completed. Vastral. Config: 2 BHK + Shops.
9. SHREEDHAR SPARSH - Completed. S.P. Ring Road, Vastral. Config: 2 & 3 BHK + Shops.
10. SHREEDHAR STAR - Completed. Devasya School Road, Odhav. Config: 3 BHK + Shops.
11. SHREEDHAR GREENS - Completed. Vastral. Config: 2 & 3 BHK.

Contact: +91 98795 03547. WhatsApp: +91 98795 03547.

Rules:
- Respond in English by default. Switch language only if user writes in Gujarati or Hindi.
- Never make up prices - say please contact us for current pricing.
- Keep responses to 2-4 sentences.
- For site visits, give the contact number.
- Never invent details not listed above.`;

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimits = new Map();

function isAllowedOrigin(origin) {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    if (url.protocol === 'http:' && url.hostname === 'localhost') return true;
    if (url.protocol !== 'https:' || url.port) return false;

    const hostname = url.hostname.toLowerCase();
    if (hostname === 'shreedhargroup.vercel.app') return true;

    const projectHosts = [
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
      process.env.VERCEL_PROJECT_PRODUCTION_URL
    ]
      .filter((value) => typeof value === 'string')
      .map((value) => value.toLowerCase());

    return hostname.endsWith('.vercel.app') && projectHosts.includes(hostname);
  } catch {
    return false;
  }
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (typeof value === 'string' && value.trim()) {
    return value.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || 'unknown';
}

// Origin can be forged by non-browser clients, and this per-instance limiter does not share state,
// so both checks are deterrents rather than full protection.
function isRateLimited(ip) {
  const now = Date.now();
  const current = rateLimits.get(ip);

  if (!current || now - current.startedAt >= RATE_LIMIT_WINDOW_MS) {
    if (rateLimits.size > 1000) {
      for (const [key, value] of rateLimits) {
        if (now - value.startedAt >= RATE_LIMIT_WINDOW_MS) rateLimits.delete(key);
      }
    }
    rateLimits.set(ip, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > RATE_LIMIT_MAX_REQUESTS;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!isAllowedOrigin(req.headers?.origin)) {
    return res.status(403).json({ error: 'Origin not allowed' });
  }

  if (isRateLimited(getClientIp(req))) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const body = req.body;
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body) ||
    Object.keys(body).length !== 1 ||
    !Array.isArray(body.messages)
  ) {
    return res.status(400).json({ error: 'Invalid request body' });
  }

  if (
    body.messages.some(
      (item) =>
        item &&
        typeof item === 'object' &&
        typeof item.content === 'string' &&
        ((item.role === 'user' && item.content.length > 500) ||
          (item.role === 'assistant' && item.content.length > 2000))
    )
  ) {
    return res.status(400).json({ error: 'Message content is too long' });
  }

  const messages = body.messages
    .filter(
      (item) =>
        item &&
        typeof item === 'object' &&
        (item.role === 'user' || item.role === 'assistant') &&
        typeof item.content === 'string'
    )
    .slice(-8);

  if (messages.length === 0 || messages[messages.length - 1].role !== 'user') {
    return res.status(400).json({ error: 'Last message must be from the user' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'Chat service unavailable' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: CHAT_SYSTEM }, ...messages],
        temperature: 0.7,
        max_tokens: 300,
      })
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(502).json({ error: 'Chat service unavailable' });
    }

    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      return res.status(502).json({ error: 'Chat service unavailable' });
    }

    return res.status(200).json({ choices: [{ message: { content } }] });
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
