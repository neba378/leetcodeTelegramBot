const { default: mongoose } = require("mongoose");

require("dotenv").config();
const url = process.env.DATA_BASE_URL;

async function connectToDatabase() {
  try {
    await mongoose.connect(url);
    console.log("Connected to the database");
  } catch (error) {
    console.log("DATA BASE CONNECTION ERROR : ",error);
  }
}

module.exports = {
  connectToDatabase,
};
