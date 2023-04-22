const router = require("express").Router()
const File = require("../models/file")

router.get("/:uuid", async (req, res) => {
  // console.log(req)
  try {
    const file = await File.findOne({ uuid: req.params.uuid })
    // console.log("file", file)
    if (!file) {
      return res.render("download", { error: "Link has expired" })
    }

    const filePath = `${__dirname}/../${file.path}`
    // console.log("filePath", filePath)
    res.download(filePath)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
})

module.exports = router
