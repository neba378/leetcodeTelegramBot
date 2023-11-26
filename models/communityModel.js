const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema({
  _id: Number,
  groupName: String,
  day: {
    type: Number,
    default: 1,
  },
  member: [
    {
      _id: Number,
      name: String,
      solved: Number,
      is_bot: Boolean,
    },
  ],
});
module.exports = mongoose.model("communities", communitySchema);
