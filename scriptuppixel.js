let originalImage = new Image();
let uploadedFile = null;

document.getElementById("upload").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;
  uploadedFile = file;

  // ลบ Blob URL เก่า ถ้ามี เพื่อป้องกัน memory leak
  if (window.originalBlobUrl) {
    URL.revokeObjectURL(window.originalBlobUrl);
  }

  // สร้าง Blob URL ใหม่จากไฟล์ที่อัพโหลด
  window.originalBlobUrl = URL.createObjectURL(file);

  originalImage.src = window.originalBlobUrl;
  document.getElementById("original-preview").src = window.originalBlobUrl;
  document.getElementById("original-link").href = window.originalBlobUrl;
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
  const format = document.getElementById("format").value;

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

  ctx.imageSmoothingEnabled = true; // เปิด smoothing ให้ภาพเนียน
  ctx.imageSmoothingQuality = 'high'; // ระบุคุณภาพสูง

  ctx.filter = 'blur(0.8px)'; // เบลอเล็กน้อยให้เรียบเนียน
  ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);
  ctx.filter = 'none'; // รีเซ็ต filter เผื่อใช้วาดอย่างอื่นต่อ

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

  const mimeTypeMap = {
    jpg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp'
  };
  const mimeType = mimeTypeMap[format] || 'image/jpeg';

  const dataURL = canvas.toDataURL(mimeType);

  // ลิงก์เปิดภาพขยาย
  // ลบ Object URL เก่าถ้ามี เพื่อไม่ให้ memory leak
if (window.canvasBlobUrl) {
  URL.revokeObjectURL(window.canvasBlobUrl);
}

// สร้าง Blob จาก canvas
canvas.toBlob(function(blob) {
  window.canvasBlobUrl = URL.createObjectURL(blob);
  document.getElementById("canvas-link").href = window.canvasBlobUrl;
}, mimeType);


  // ลิงก์ดาวน์โหลด
  const downloadLink = document.getElementById("download");
  downloadLink.href = dataURL;
  downloadLink.download = newFilename;
  downloadLink.style.display = "inline-block";

  // แสดงส่วนโดเนท
  document.getElementById("donate-section").style.display = "block";
}

function resetPage() {
  // รีเซ็ต input ไฟล์และค่าต่างๆ
  document.getElementById("upload").value = "";
  uploadedFile = null;
  originalImage.src = "";

  document.getElementById("original-preview").src = "";
  document.getElementById("original-link").href = "#";
  document.getElementById("canvas").width = 0;
  document.getElementById("canvas").height = 0;
  document.getElementById("canvas-link").href = "#";

  document.getElementById("original-info").style.display = "none";
  document.getElementById("result-info").style.display = "none";
  document.getElementById("comparison").style.display = "none";
  
  const downloadLink = document.getElementById("download");
  downloadLink.style.display = "none";
  downloadLink.href = "";
  downloadLink.download = "";

  document.getElementById("donate-section").style.display = "none";

  // รีเซ็ต scale และ format เป็นค่าพื้นฐาน
  document.getElementById("scale").value = 2;
  document.getElementById("format").value = "jpg";
}

const dropContainer = document.getElementById('dropcontainer');
const uploadInput = document.getElementById('upload');
const originalInfo = document.getElementById('original-info');

dropContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  dropContainer.style.backgroundColor = '#eee';
  dropContainer.style.borderColor = '#111';
});

dropContainer.addEventListener('dragleave', (e) => {
  e.preventDefault();
  dropContainer.style.backgroundColor = '';
  dropContainer.style.borderColor = '#555';
});

dropContainer.addEventListener('drop', (e) => {
  e.preventDefault();
  dropContainer.style.backgroundColor = '';
  dropContainer.style.borderColor = '#555';

  if (e.dataTransfer.files.length > 0) {
    uploadInput.files = e.dataTransfer.files;  // ใส่ไฟล์ที่ลากลงไปใน input
    handleFiles(e.dataTransfer.files);
  }
});

uploadInput.addEventListener('change', (e) => {
  if (uploadInput.files.length > 0) {
    handleFiles(uploadInput.files);
  }
});

function handleFiles(files) {
  const file = files[0];
  if (!file.type.startsWith('image/')) {
    alert('กรุณาเลือกไฟล์ภาพเท่านั้น');
    return;
  }

  uploadedFile = file; // <-- เพิ่มบรรทัดนี้

  window.originalBlobUrl = URL.createObjectURL(file);
  originalImage.src = window.originalBlobUrl;
  document.getElementById("original-preview").src = window.originalBlobUrl;
  document.getElementById("original-link").href = window.originalBlobUrl;

  const reader = new FileReader();
  reader.onload = (event) => {
    originalInfo.style.display = 'block';
    originalInfo.innerHTML = `
      <strong>ชื่อไฟล์:</strong> ${file.name}<br>
      <strong>ประเภท:</strong> ${file.type}<br>
      <strong>ขนาดไฟล์:</strong> ${(file.size / 1024).toFixed(2)} KB
    `;
  };
  reader.readAsDataURL(file);
}


