const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60');

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
    return res.status(200).json({});
  }
};
