let originalImage = new Image();
let uploadedFile = null;

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedFile = file;

  const reader = new FileReader();
  reader.onload = function (event) {
    originalImage.src = event.target.result;
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
  if (!originalImage.src) {
    alert("กรุณาเลือกรูปภาพก่อน");
    return;
  }

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const width = originalImage.width;
  const height = originalImage.height;

  canvas.width = width * scale;
  canvas.height = height * scale;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(originalImage, 0, 0, width * scale, height * scale);

  canvas.style.display = "block";

  // แสดงข้อมูลใหม่
  const resultInfo = document.getElementById("result-info");
  resultInfo.innerHTML = `
    <strong>ข้อมูลภาพที่ขยายแล้ว:</strong><br>
    🔍 ขนาดใหม่: ${canvas.width} x ${canvas.height} px<br>
    🔗 Scale: ${scale}x
  `;
  resultInfo.style.display = "block";

  // ลิงก์ดาวน์โหลด
  const downloadLink = document.getElementById("download");
  downloadLink.href = canvas.toDataURL("image/png");
  downloadLink.style.display = "inline-block";
}
