const express = require("express")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.static("public"))
app.use(express.json())

// Connect to DB
const connectDB = require("./config/db")
connectDB()

// Routes
app.use("/api/uploads", require("./routes/files"))
app.use("/api/downloads", require("./routes/download"))
app.use("/api/send", require("./routes/send"))

// Error handling
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: "Internal Server Error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})
