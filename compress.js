let originalImage = new Image();
let uploadedFile = null;

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedFile = file;

  if (window.originalBlobUrl) URL.revokeObjectURL(window.originalBlobUrl);
  window.originalBlobUrl = URL.createObjectURL(file);

  originalImage.src = window.originalBlobUrl;
  document.getElementById("original-preview").src = window.originalBlobUrl;
  document.getElementById("original-link").href = window.originalBlobUrl;
});

originalImage.onload = function () {
  const infoDiv = document.getElementById("original-info");
  const file = uploadedFile;
  if (!file) return;

  infoDiv.innerHTML = `
    <strong>ข้อมูลภาพต้นฉบับ:</strong><br>
    🖼️ ชื่อไฟล์: ${file.name}<br>
    📁 ประเภท: ${file.type}<br>
    💾 ขนาดไฟล์: ${(file.size/1024).toFixed(2)} KB<br>
    📐 ขนาดภาพ: ${originalImage.width} x ${originalImage.height} px
  `;
  infoDiv.style.display = "block";
};

function compressImage() {
  if (!originalImage.src) {
    alert("กรุณาเลือกรูปภาพก่อน");
    return;
  }

  const format = document.getElementById("format").value;
  const quality = parseFloat(document.getElementById("quality").value);

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = originalImage.width;
  canvas.height = originalImage.height;

  ctx.drawImage(originalImage, 0, 0);

  document.getElementById("comparison").style.display = "flex";

  const originalName = uploadedFile.name.split('.').slice(0,-1).join('.');
  const newFilename = `compressed_${originalName}.${format}`;

  const mimeTypeMap = { jpg:'image/jpeg', png:'image/png', webp:'image/webp' };
  const mimeType = mimeTypeMap[format] || 'image/jpeg';

canvas.toBlob(function(blob) {
  const blobUrl = URL.createObjectURL(blob);
  document.getElementById("canvas-link").href = blobUrl;

  const downloadLink = document.getElementById("download");
  downloadLink.href = blobUrl;
  downloadLink.download = newFilename;
  downloadLink.style.display = "inline-block";

  const compressedSizeKB = (blob.size / 1024).toFixed(2); // ขนาดไฟล์หลังบีบอัด KB
  const originalSizeKB = (uploadedFile.size / 1024).toFixed(2); // ขนาดต้นฉบับ KB
  const reductionPercent = ((uploadedFile.size - blob.size) / uploadedFile.size * 100).toFixed(2); // ลดลง %

  const resultInfo = document.getElementById("result-info");
  resultInfo.innerHTML = `
    <strong>ข้อมูลภาพบีบอัด:</strong><br>
    🖼️ ชื่อไฟล์: ${newFilename}<br>
    🔍 ขนาด: ${canvas.width} x ${canvas.height} px<br>
    💾 ขนาดไฟล์หลังบีบอัด: ${compressedSizeKB} KB<br>
    📉 ลดลง: ${reductionPercent}% จากไฟล์ต้นฉบับ (${originalSizeKB} KB)<br>
    🧾 รูปแบบไฟล์: ${format.toUpperCase()}<br>
    🎚️ คุณภาพ: ${quality}
  `;
  resultInfo.style.display = "block";
}, mimeType, quality);

document.getElementById("donate-section").style.display = "block";

}
