const { Mongoose } = require("mongoose");
const communityModel = require("../../models/communityModel");

const status = async (msg) => {
  const groupId = msg.chat.id;
  const memberId = msg.from.id;
  try {
    const group = await communityModel.findOne(
      { _id: groupId },
      { member: { $elemMatch: { _id: memberId } } }
    );

    if (!group) {
      console.log("Group not found");
      return "Group not found";
    }

    const member = group.member[0];

    if (!member) {
      console.log("Member not found");
      return 0;
    }

    console.log("Member status:");

    return member;
  } catch (error) {
    console.error(error);
    return "Error getting member status";
  }
};

module.exports = status;
