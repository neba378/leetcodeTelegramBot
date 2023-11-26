const status = require("../controllers/Community/memberStatus");
const { getUserStatus } = require("../controllers/user/getStatus");
const { connectToDatabase } = require("../databaseConn");

const myStatus = async (msg, bot) => {
  connectToDatabase();

  const chatId = msg.chat.id;
  const isPrivate = msg.chat.type === "private";

  if (isPrivate) {
    const response = await getUserStatus(msg);
    bot.sendMessage(chatId, response);
  } else {
    const res = await status(msg);
    if (res != 0) {
      let community = await communityModel.findOne({
        _id: msg.chat.id,
      });
      const tot = community.day;
      const message = `Your status 
    \nSolved: ${res.solved}/${tot}
    \nYou can do more than that :) `;
      bot.sendMessage(msg.chat.id, message, {
        reply_to_message_id: msg.message_id,
      });
    } else {
      bot.sendMessage(msg.chat.id, "Not registered", {
        reply_to_message_id: msg.message_id,
      });
    }
  }
};

module.exports = myStatus;
