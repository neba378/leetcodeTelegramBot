const mongoose = require("mongoose");

const communityModel = require("../../models/communityModel");

const createCommunity = async (msg) => {
  const group_id = msg.chat.id;
  const group_name = msg.chat.title;
  try {
    let existingGroup = await communityModel.findOne({
      _id: group_id,
    });

    if (existingGroup) {
      console.log("Already registered Group");
      return "Already registered Group";
    }

    console.log("Registering!");
    const newGroup = new communityModel({
      _id: group_id,
      groupName: group_name,
      day: 1,
      member: {},
    });

    await newGroup.save();
    console.log(`Registered group: ${group_name}`);
    return `Registered group: ${group_name}`;
  } catch (error) {
    console.error(error);
    return "Error creating community";
  }
};

const printAllGroups = async () => {
  const groups = await communityModel.find({});
};

module.exports = { createCommunity, printAllGroups };
