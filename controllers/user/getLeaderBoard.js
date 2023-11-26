const UserModel = require("../../models/UserModel");

const getLeaderBoard = async (msg) => {
  const { id } = msg.from;
  try {
    // Find, sort, and limit to the top 5 users by 'solved' in descending order
    const topUsers = await UserModel.find().sort({ solved: -1 }).limit(10);

    let leaderboardText = "------------ Leaderboard ------------\n \n";

    // check if user it in top 10
    const isUserInTopList = topUsers.find((user) => user._id === id);

    if (isUserInTopList) {
        leaderboardText += '🌟Congratulations! You are in the top 10! 🚀 \n \n';
    }


    // add the top 1o users to the list with format
    topUsers.forEach((user, index) => {
      leaderboardText += `${index + 1}.  ${
        user.username ? `@${user.username}` : user.firstName
      } solved: ${user.solved}\n`;
    });


    // add some motivational finish to the end 

    leaderboardText +=
      "\n 🚀 Climb that LeetCode mountain, friend! 🏔️ Remember, every coding challenge is just a step closer to greatness. You're not just solving problems; you're building your coding kingdom! \n";

    leaderboardText +=
      "\n 💪 Keep coding, stay awesome, and conquer those challenges like the coding ninja you are! 💻✨";

    return leaderboardText;
  } catch (error) {
    console.error("Error on LeaderBoard finding, sorting, and limiting users:");
    return "Someting went Wrong Sorry try again later!";
  }
};

module.exports = { getLeaderBoard };