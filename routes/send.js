const router = require("express").Router()
const File = require("../models/file")
const sendMail = require("../services/emailService")
const emailTemplate = require("../services/emailTemplate")

router.post("/", async (req, res) => {
  console.log("======", req.body)
  const { uuid, emailTo, emailFrom } = req.body

  // validate request
  if (!uuid || !emailTo || !emailFrom) {
    return res.status(400).json({ error: "All fields are required." })
  }

  // get file from DB
  const file = await File.findOne({ uuid })

  // check if email has already been sent for this file
  if (file.sender) {
    return res.status(400).json({ error: "Email already sent." })
  }

  // update file with sender and receiver email
  file.sender = emailFrom
  file.receiver = emailTo
  const response = await file.save()

  // send email with download link
  sendMail({
    from: emailFrom,
    to: emailTo,
    subject: "inShare file sharing",
    text: `${emailFrom} shared a file with you`,
    html: emailTemplate({
      emailFrom,
      downloadLink: `${process.env.APP_BASE_URL}/api/downloads/${file.uuid}`,
      size: parseInt(file.size / 1000) + " KB",
      expires: "24 hours"
    })
  })

  return res.json({ success: true })
})

module.exports = router
