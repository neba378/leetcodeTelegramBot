const { getDailyUserQuestion } = require("../../controllers/user/getQuestion");
const UserModel = require("../../models/UserModel");



const sendDaily = async (bot) => {
  // GET ALL USERS
  const users = await UserModel.find({});

  // Send question question for all users

  users.map(async (user) => {
    const { day, solved } = user;
    // pick a question based on user data
    const pickedQuestion = getDailyUserQuestion(user);

    // send the question for the user

    if (pickedQuestion) {
      const { title, titleSlug, difficulty, frontendQuestionId } =
        pickedQuestion;
      const message = `#Day${day} Challenge \n  \n Title: ${title} \n Link: https://leetcode.com/problems/${titleSlug} \n Difficulty : ${difficulty} \n Solved: ${solved} \n \nCongratulations on completing the challenge! 🎉 You've now conquered ${
        solved + 1
      } coding challenges. Keep up the great work! Each solved challenge brings you one step closer to mastering your coding skills. `;

      // send the quesion to the user
      bot.sendMessage(user._id, message);

      // save the question on the user question list and incrase the day
      user.qList[frontendQuestionId] = 1;
      user.markModified("qList");
      user.day += 1;

      user.save();
    }
  });
};

module.exports = sendDaily;
