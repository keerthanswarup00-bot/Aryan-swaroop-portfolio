const { put } = require('@vercel/blob');
const crypto = require('crypto');

const ADMIN_HASH = '82580f067c62f6655090f7e49f349c685e1588d189e50118b437d6a830d72dbb';

function checkAuth(req) {
  const auth = req.headers.authorization || '';
  const token = auth.replace('Bearer ', '').trim();
  return crypto.createHash('sha256').update(token).digest('hex') === ADMIN_HASH;
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });
  if (!checkAuth(req)) return res.status(401).json({ success: false, error: 'Unauthorized' });

  try {
    const form = await req.formData();
    const file = form.get('file');
    if (!file) return res.status(400).json({ success: false, error: 'No file' });

    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (ext !== '.pdf') return res.status(400).json({ success: false, error: 'Only PDF allowed' });

    const blob = await put('Aryan_Swaroop_Resume.pdf', file, {
      access: 'public',
      contentType: 'application/pdf',
    });

    console.log('[UPLOAD RESUME]', file.name);
    return res.status(200).json({ success: true, filename: 'Aryan_Swaroop_Resume.pdf', url: blob.url });
  } catch (err) {
    console.error('[UPLOAD RESUME ERROR]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};
