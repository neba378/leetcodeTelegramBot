const { log } = require("console");
const { default: mongoose } = require("mongoose");

require("dotenv").config();
const url = process.env.DATA_BASE_URL
let client;

async function connectToDatabase() {
  try {
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
