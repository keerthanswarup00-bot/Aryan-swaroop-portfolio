const crypto = require('crypto');

const ADMIN_HASH = '82580f067c62f6655090f7e49f349c685e1588d189e50118b437d6a830d72dbb';

function checkAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  return crypto.createHash('sha256').update(token).digest('hex') === ADMIN_HASH;
}

function parseMultipart(buffer, boundary) {
  const parts = [];
  const boundaryBuf = Buffer.from('--' + boundary);
  let start = buffer.indexOf(boundaryBuf) + boundaryBuf.length + 2;

  while (true) {
    const end = buffer.indexOf(boundaryBuf, start);
    if (end === -1) break;

    const part = buffer.slice(start, end - 2);
    const headerEnd = part.indexOf('\r\n\r\n');
    if (headerEnd === -1) { start = end + boundaryBuf.length + 2; continue; }

    const headers = part.slice(0, headerEnd).toString();
    const body = part.slice(headerEnd + 4);

    const filenameMatch = headers.match(/filename="([^"]+)"/);
    const contentTypeMatch = headers.match(/Content-Type:\s*(.+)/i);

    if (filenameMatch) {
      parts.push({
        filename: filenameMatch[1],
        contentType: contentTypeMatch ? contentTypeMatch[1].trim() : 'application/octet-stream',
        data: body
      });
    }
    start = end + boundaryBuf.length + 2;
  }
  return parts;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  if (!checkAuth(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    const contentType = req.headers['content-type'] || '';
    const boundaryMatch = contentType.match(/boundary=(.+)/);
    if (!boundaryMatch) return res.status(400).json({ success: false, error: 'No boundary' });

    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const buffer = Buffer.concat(chunks);

    const files = parseMultipart(buffer, boundaryMatch[1]);
    if (!files.length) return res.status(400).json({ success: false, error: 'No file' });

    const file = files[0];
    const { put } = require('@vercel/blob');
    const blob = await put('Aryan_Swaroop_Resume.pdf', file.data, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('[UPLOAD RESUME]', file.filename);
    return res.status(200).json({ success: true, filename: 'Aryan_Swaroop_Resume.pdf', url: blob.url });
  } catch (err) {
    console.error('[UPLOAD RESUME ERROR]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
