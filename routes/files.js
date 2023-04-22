const router = require("express").Router()
require("dotenv").config()
const multer = require("multer")
const path = require("path")
const File = require("../models/file")
const { v4: uuid4 } = require("uuid")

// Define multer disk storage
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`
    callback(null, uniqueName)
  }
})

// Create multer instance with storage and file size limit
const upload = multer({
  storage,
  limits: { fileSize: 100000 * 100 }
}).single("file")

// File upload endpoint
router.post("/", async (req, res) => {
  try {
    // Handle file upload
    upload(req, res, async (err) => {
      // Validate request
      if (!req.file) {
        return res.status(400).json({ error: "All fields are required." })
      }
      if (err) {
        return res.status(500).send({ error: err.message })
      }

      // Create new file object and store in DB
      const file = new File({
        filename: req.file.filename,
        uuid: uuid4(),
        path: req.file.path,
        size: req.file.size
      })
      const response = await file.save()

      return res.json({
        uuid: file.uuid,
        fileName: file.filename,
        fileSize: file.size,
        downloadLink: `${process.env.APP_BASE_URL}/api/downloads/${file.uuid}`
      })
    })
  } catch (err) {
    console.error("Error:", err)
    return res.status(500).send({ error: "File upload failed." })
  }
})

module.exports = router
