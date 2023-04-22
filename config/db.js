require("dotenv").config()

const mongoose = require("mongoose")

function connectDB() {
  //DB connection
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    useUnifiedTopology: true
  })

  const connection = mongoose.connection

  connection
    .once("open", () => {
      console.log("DB connected.")
    })
    .on("error", (error) => {
      console.log("Connection failed.", error)
    })
}

module.exports = connectDB
