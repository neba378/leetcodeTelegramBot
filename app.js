require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const communityModel = require("./models/communityModel");

//models
const UserModel = require("./models/UserModel");

const { connectToDatabase, getDatabase } = require("./databaseConn");
//controllers
const status = require("./controllers/Community/memberStatus");
const {
  createMember,
  addOne,
} = require("./controllers/Community/RegisterMember");
const { getDailyUserQuestion } = require("./controllers/user/getQuestion");

const resetCommunity = require("./controllers/Community/resetCommunity");

const {
  findOrCreateUser,
  printAllUsers,
} = require("./controllers/user/userController");

const {
  createCommunity,
  printAllGroups,
} = require("./controllers/Community/CommunityController");
const RegisterMember = require("./controllers/Community/RegisterMember");

// SETUP
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log("the starter name is: " + msg.from.first_name);

  const introduction =
    "📚 *Welcome to the LeetCode Daily Problems Bot!* 🚀\n\nAre you ready to supercharge your coding skills and tackle daily programming challenges? Look no further! This bot is here to provide you with a daily dose of brain-teasing LeetCode problems.\n\nEvery day, you'll receive a new problem carefully selected from the vast LeetCode collection. These problems cover a wide range of data structures, algorithms, and programming concepts, helping you sharpen your problem-solving abilities and prepare for technical interviews.\n\nHere's what you can expect from our bot:\n✅ Daily Delivery: Receive a fresh problem right in your Telegram chat every day.\n⚡️ Challenge Yourself: Solve the problem within the suggested time frame to enhance your coding speed and efficiency.\n🏆 Leaderboard: Compete with fellow enthusiasts and see who solves the most problems.\n🔔 Event Notifications: Stay informed about upcoming contests and coding events to further boost your skills.\n🎯 Random Recommendations: Get a surprise challenge from the LeetCode collection with a single command.\n\nTo get started, simply register with the bot using the /register command. Once registered, you'll automatically start receiving daily problems. Use the /help command to explore additional bot features and commands.\n\nSo, are you ready to embark on this coding adventure? Let's solve some LeetCode problems together and level up our programming prowess!\n\nIf you have any questions or need assistance, feel free to reach out. Happy coding! 🚀✨";
  bot.sendMessage(chatId, introduction, {
    parse_mode: "Markdown",
  });
  console.log(msg);
  console.log();
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpManual = `📚 *LeetCode Daily Problems Bot Help Manual* 🤖

Welcome to the help manual for the LeetCode Daily Problems Bot! This guide will provide you with an overview of the bot's features and commands.

1️⃣ /register - Register with the bot to start receiving daily coding problems. Once registered, you'll automatically receive a fresh problem every day.

2️⃣ /problem - Fetch the current daily problem directly in your chat. Use this command if you want to access the problem without waiting for the daily delivery.

3️⃣ /submit <solution> - Submit your solution to the current daily problem. Replace <solution> with your code or algorithmic approach. Be sure to double-check your solution before submitting.

4️⃣ /leader-board - View the leader-board and see the top performers who have solved the most problems. Compete with fellow enthusiasts and strive to climb up the ranks.

5️⃣ /recommend - Get a random recommendation from the vast LeetCode problem collection. Use this command when you want to tackle a challenge outside of the daily problem.

6️⃣ /events - Stay informed about upcoming coding contests and events. Get notifications about coding competitions, webinars, and other coding-related activities.

7️⃣ /help - Display this help manual. Use this command whenever you need a quick reminder of the available commands and features.

Remember, the bot is designed to help you enhance your coding skills, prepare for technical interviews, and have fun while solving LeetCode problems. Don't hesitate to reach out if you have any questions or need assistance.

Happy coding! 🚀✨`;
  bot.sendMessage(chatId, helpManual, {
    parse_mode: "Markdown",
  });
});

bot.onText(/\/register/, async (msg) => {
  // TODO: Task for ishak :- if user starts the bot from private chat handle the functionality

  // check if the /register command is from private chat
  const userId = msg.chat.id;
  const isPrivate = msg.chat.type === "private";
  connectToDatabase();
  if (isPrivate) {
    // check if the user exists already in the users collection if not create it
    const fOCResponse = await findOrCreateUser(msg);
    bot.sendMessage(userId, fOCResponse);
    printAllUsers();
  }
});

// TODO: TASK: FOR ISHAK GIVE A DAILY question FOR USERS
cron.schedule("*/30 * * * * *", async () => {
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
});

bot.onText(/\/got/, async (msg) => {
  const userId = msg.chat.id;
  const isPrivate = msg.chat.type === "private";
  if (isPrivate) {
    const fOCResponse = await findOrCreateUser(msg);
    bot.sendMessage(userId, fOCResponse);
    printAllUsers();
  }
});

//code to create community
bot.onText(/\/stCommunity/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  connectToDatabase();
  bot.getChatMember(chatId, userId).then(async (chatMember) => {
    // Check if the user is an administrator
    if (
      chatMember.status === "administrator" ||
      chatMember.status == "creator"
    ) {
      const response = await createCommunity(msg);
      bot.sendMessage(chatId, response);
    } else {
      bot.sendMessage(chatId, "You are not an admin.");
      console.log(
        "Community Not Created! because " + chatMember.status + " is no Admin!"
      );
    }
  });
});

//code for creating new member in an existing group
bot.onText(/\/submit/, async (msg) => {
  await connectToDatabase();

  const chatId = msg.chat.id;
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
});
//To reset the community
bot.onText(/\/reset/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  await connectToDatabase();
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
      console.log("not reset! because " + chatMember.status + " is no Admin!");
    }
  });
});

// show status of member
bot.onText(/\/myStatus/, async (msg) => {
  connectToDatabase();
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
});
