const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Vercel pakai /tmp untuk simpan sementara (karena serverless)
const uploadDir = "/tmp/uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = (req, res) => {
  if (req.method === "POST") {
    upload.single("file")(req, res, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (!req.file) return res.status(400).json({ error: "No file uploaded" });

      // ⚠️ File hanya tersimpan sementara di /tmp
      res.json({
        message: "Uploaded OK",
        filename: req.file.filename,
        path: req.file.path,
      });
    });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
