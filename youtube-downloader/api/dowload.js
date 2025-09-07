import ytdl from 'ytdl-core';

export default async function handler(req, res) {
  const url = req.query.url;
  const format = req.query.format || 'mp4';

  if (!url) return res.status(400).send('กรุณาใส่ URL');

  try {
    res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);
    ytdl(url, { quality: format === 'mp3' ? 'highestaudio' : 'highestvideo', filter: format === 'mp3' ? 'audioonly' : null }).pipe(res);
  } catch (err) {
    res.status(500).send('เกิดข้อผิดพลาด: ' + err.message);
  }
}
