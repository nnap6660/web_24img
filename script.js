let originalImage = new Image();
let uploadedFile = null;

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedFile = file;

  const reader = new FileReader();
  reader.onload = function (event) {
    originalImage.src = event.target.result;
    document.getElementById("original-preview").src = event.target.result;
  };
  reader.readAsDataURL(file);
});

originalImage.onload = function () {
  showOriginalInfo();
};

function showOriginalInfo() {
  const infoDiv = document.getElementById("original-info");
  const file = uploadedFile;

  if (!file) return;

  const sizeKB = (file.size / 1024).toFixed(2);
  const type = file.type;
  const name = file.name;
  const width = originalImage.width;
  const height = originalImage.height;

  infoDiv.innerHTML = `
    <strong>ข้อมูลภาพต้นฉบับ:</strong><br>
    🖼️ ชื่อไฟล์: ${name}<br>
    📁 ประเภท: ${type}<br>
    💾 ขนาดไฟล์: ${sizeKB} KB<br>
    📐 ขนาดภาพ: ${width} x ${height} px
  `;
  infoDiv.style.display = "block";
}

function upscaleImage() {
  const scale = parseInt(document.getElementById("scale").value);
  const format = document.getElementById("format").value; // ⬅️ ดึงค่านามสกุล

  if (!originalImage.src) {
    alert("กรุณาเลือกรูปภาพก่อน");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = originalImage.width;
  const height = originalImage.height;

  const newWidth = width * scale;
  const newHeight = height * scale;

  canvas.width = newWidth;
  canvas.height = newHeight;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

  document.getElementById("comparison").style.display = "flex";

  const originalName = uploadedFile.name.split('.').slice(0, -1).join('.');
  const newFilename = `upscaled_${originalName}.${format}`;
  
  const resultInfo = document.getElementById("result-info");
  resultInfo.innerHTML = `
    <strong>ข้อมูลภาพที่ขยายแล้ว:</strong><br>
    🖼️ ชื่อไฟล์: ${newFilename}<br>
    🔍 ขนาดใหม่: ${newWidth} x ${newHeight} px<br>
    🔗 ขยาย: ${scale}x<br>
    🧾 รูปแบบไฟล์: ${format.toUpperCase()}
  `;
  resultInfo.style.display = "block";

  // สร้างลิงก์ดาวน์โหลด
  const downloadLink = document.getElementById("download");

  // เลือก MIME type ตามนามสกุล
  const mimeTypeMap = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };
  const mimeType = mimeTypeMap[format] || 'image/jpeg'; // fallback

  downloadLink.href = canvas.toDataURL(mimeType);

  downloadLink.download = newFilename;
  downloadLink.style.display = "inline-block";
}

