const crypto = require('crypto');

const ADMIN_HASH = '82580f067c62f6655090f7e49f349c685e1588d189e50118b437d6a830d72dbb';

function checkAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  return crypto.createHash('sha256').update(token).digest('hex') === ADMIN_HASH;
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const sep = Buffer.from('--' + boundary);
  let pos = buffer.indexOf(sep) + sep.length + 2;

  while (true) {
    const next = buffer.indexOf(sep, pos);
    if (next === -1) break;

    const raw = buffer.slice(pos, next - 2);
    const hdrEnd = raw.indexOf('\r\n\r\n');
    if (hdrEnd === -1) { pos = next + sep.length + 2; continue; }

    const hdr = raw.slice(0, hdrEnd).toString();
    const body = raw.slice(hdrEnd + 4);

    const fn = hdr.match(/filename="([^"]+)"/);
    if (!fn) { pos = next + sep.length + 2; continue; }

    const ct = (hdr.match(/Content-Type:\s*(.+)/i) || [,'application/octet-stream'])[1].trim();
    parts.push({ filename: fn[1], contentType: ct, body });
    pos = next + sep.length + 2;
  }
  return parts;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!checkAuth(req)) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const ct = req.headers['content-type'] || '';
    const bm = ct.match(/boundary=(.+)/);
    if (!bm) return res.status(400).json({ error: 'No boundary' });

    const chunks = [];
    for await (const c of req) chunks.push(c);
    const buf = Buffer.concat(chunks);

    const files = parseMultipart(buf, bm[1]);
    if (!files.length) return res.status(400).json({ error: 'No file found' });

    const file = files[0];
    const ext = ('.' + file.filename.split('.').pop().toLowerCase());
    if (!['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'].includes(ext)) {
      return res.status(400).json({ error: 'Type not allowed: ' + ext });
    }

    // Convert Buffer to Blob for @vercel/blob v2
    const blob = new Blob([file.body], { type: file.contentType });

    const { put } = require('@vercel/blob');
    const result = await put('images/' + file.filename, blob, {
      access: 'public',
      contentType: file.contentType,
    });

    console.log('[UPLOAD OK]', file.filename, result.url);
    return res.status(200).json({ success: true, filename: file.filename, url: result.url });
  } catch (err) {
    console.error('[UPLOAD ERR]', err.message, err.stack);
    return res.status(500).json({ error: err.message });
  }
};
