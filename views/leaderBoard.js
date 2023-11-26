const { connectToDatabase } = require("../databaseConn");
const { getLeaderBoard } = require("../controllers/user/getLeaderBoard");

const leaderBoard = async (msg, bot) => {
  await connectToDatabase();

  const userId = msg.from.id;
  const isPrivate = msg.chat.type === "private";

  if (isPrivate) {
    const response = await getLeaderBoard(msg);
    bot.sendMessage(userId, response);
  } else {
    // TODO: task for SADAM to send the leader Board of top 10 Members of the group
  }
};

module.exports = leaderBoard;
