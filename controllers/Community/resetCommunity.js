const mongoose = require("mongoose");
const communityModel = require("../../models/communityModel");

const resetCommunity = async (msg) => {
  const result = await communityModel.updateOne(
    { _id: msg.chat.id },
    { day: 1, member: [] }
  );
};

module.exports = resetCommunity;
