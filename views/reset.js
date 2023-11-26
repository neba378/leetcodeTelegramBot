const resetCommunity = require("../controllers/Community/resetCommunity");
const { resetUser } = require("../controllers/user/resetUser");
const { connectToDatabase } = require("../databaseConn");

const reset = async (msg, bot) => {
  await connectToDatabase();

  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const isPrivate = msg.chat.type === "private";

  if (isPrivate) {
    const response = await resetUser(msg);
    bot.sendMessage(chatId, response);
  } else {
    bot.getChatMember(chatId, userId).then(async (chatMember) => {
      // Check if the user is an administrator
      if (
        chatMember.status === "administrator" ||
        chatMember.status == "creator"
      ) {
        await resetCommunity(msg);
        bot.sendMessage(msg.chat.id, "Successfully Reset");
      } else {
        bot.sendMessage(chatId, "You are not an admin.");
        console.log(
          "not reset! because " + chatMember.status + " is no Admin!"
        );
      }
    });
  }
};

module.exports = reset;
