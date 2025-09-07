import ytdl from "ytdl-core";

export default async function handler(req, res) {
  const { url, format } = req.query;

  if (!url) return res.status(400).send("กรุณาใส่ URL");

  try {
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="video.${format}"`
    );

    if (format === "mp3") {
      ytdl(url, { filter: "audioonly" }).pipe(res);
    } else {
      ytdl(url).pipe(res);
    }
  } catch (err) {
    res.status(500).send("เกิดข้อผิดพลาด: " + err.message);
  }
}
