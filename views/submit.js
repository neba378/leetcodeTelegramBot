const { createMember, addOne } = require("../controllers/Community/RegisterMember");
const { saveSubmiton } = require("../controllers/user/saveSubmition");
const { connectToDatabase } = require("../databaseConn");

const submit = async (msg,bot) => {
  await connectToDatabase();

  const chatId = msg.chat.id;
  const isPrivate = msg.chat.type === "private";

  if (isPrivate) {
    const isValidSoluion = true;

    if (isValidSoluion) {
      const response = await saveSubmiton(msg);
      bot.sendMessage(chatId, response);
    } else {
      bot.sendMessage(chatId, "Not accepted! Try again");
    }
  } else {
    //code for creating new member in an existing group and saving there summtion

    const response = await createMember(msg);
    if (response == "Good") {
      //sadam's validator function here

      if (true) {
        bot.sendMessage(chatId, "Accepted", {
          reply_to_message_id: msg.message_id,
        });
        addOne(msg);
      } else {
        bot.sendMessage(chatId, "Not accepted! Try again");
      }
    }
  }
};

module.exports = submit;
