const mongoose = require("mongoose");
const communityModel = require("../../models/communityModel");

const createMember = async (msg) => {
  const group_id = msg.chat.id;
  const member_id = msg.from.id;

  try {
    let community = await communityModel.findOne({
      _id: group_id,
    });

    if (!community) {
      console.log("Group does not exist");
      return "Group does not exist";
    }

    // Check if the member already exists in the group
    const existingMember = community.member.find(
      (member) => member._id === member_id
    );

    if (existingMember) {
      console.log("Member already exists");
      return "Good";
    }

    // Add a new member to the existing community
    community.member.push({
      _id: member_id,
      name: msg.from.first_name,
      solved: 0,
      is_bot: msg.from.is_bot,
    });

    // Save the updated community with the new member
    await community.save();

    console.log(`Registered Person: ${msg.from.first_name}`);
    return `Registered Person: ${msg.from.first_name}`;
  } catch (error) {
    console.error(error);
    return "Error creating community";
  }
};

const addOne = async (msg) => {
  const group_id = msg.chat.id;

  let community = await communityModel.findOne({
    _id: group_id,
  });
  const memberToUpdate = community.member.find(
    (member) => member._id === msg.from.id
  );
  memberToUpdate.solved += 1;
  await community.save();
};

module.exports = { createMember, addOne };
