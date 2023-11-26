const mongoose = require("mongoose");
const UserModel = require("../../models/UserModel");
const { connectToDatabase } = require("../../databaseConn");

const findOrCreateUser = async (msg) => {
  const { id, first_name, last_name, username } = msg.from;

  try {
    // Check if the user exists
    let user = await UserModel.findOne({ _id: id });

    if (user) {
      console.log("user already exist");
      // await UserModel.deleteOne({ _id: id });
      return `User : @${username} already registerd. Thankyou :)`;
    }

    // If user doesn't exist, create a new one
    console.log("no user found creating the user");
    user = await UserModel.create({
      _id: id,
      firstName: first_name,
      lastName: last_name,
      username: username,
      solved: 0,
      qList: {},
      day: 1,
      createdAt: new Date(),
    });

    console.log("Created User:", user);
    return `User : @${username} successfully registered. Thankyou :)`;
  } catch (error) {
    console.error("Error while creating a User:", error);
  }
};

const printAllUsers = async () => {
  connectToDatabase();
  const users = await UserModel.find({});
  console.log(users);
};

module.exports = { findOrCreateUser, printAllUsers };
