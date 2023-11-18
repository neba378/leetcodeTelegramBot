const { log } = require("console");
const { default: mongoose } = require("mongoose");

require("dotenv").config();
const uri =
  "mongodb+srv://nebiyumusbah378:nebiyusadamishaq@cluster0.tlhkvat.mongodb.net/";

let client;

async function connectToDatabase() {
  try {
    const uri =
      "mongodb+srv://nebiyumusbah378:nebiyusadamishaq@cluster0.tlhkvat.mongodb.net/";
    if (mongoose.connection.readyState != 1) {
      await mongoose.connect(uri);
      console.log("Connected to the database");
    } else {
      console.log("Database already connected!");
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  connectToDatabase,
};
