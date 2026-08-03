// GET /api/manifest — lists public image keys in the @vercel/blob store.
// Gated behind a shared secret (audit finding B-H5): callers must send the
// token in the `x-admin-token` header, configured via the
// MANIFEST_ADMIN_TOKEN environment variable. Fails closed if unset.
const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  const expected = process.env.MANIFEST_ADMIN_TOKEN;

  if (!expected) {
    res.status(500).json({ error: 'MANIFEST_ADMIN_TOKEN not configured' });
    return;
  }

  const supplied = req.headers['x-admin-token'];
  if (supplied !== expected) {
    res.setHeader('Cache-Control', 'private, no-store');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  res.setHeader('Cache-Control', 'private, no-store');

  if (req.method !== 'GET') return res.status(405).end();

  try {
    const { blobs } = await list({ prefix: 'images/' });
    const manifest = {};
    for (const blob of blobs) {
      const filename = blob.pathname.replace('images/', '');
      manifest[filename] = blob.url;
    }
    return res.status(200).json(manifest);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to list blobs' });
  }
};
