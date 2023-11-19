require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const UserModel = require("./models/UserModel");
const { connectToDatabase, getDatabase } = require("./databaseConn");
const { getDailyUserQuession } = require("./controllers/user/getQuession");
const {findOrCreateUser,printAllUsers,} = require("./controllers/user/userController");

// SETUP
const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

async function main() {
  await connectToDatabase();

  try {
    bot.on("new_chat_members", async (msg) => {
      const groupChatId = msg.chat.id;
      const newMembers = msg.new_chat_members;

      console.log(`Bot added to group: ${groupChatId}`);
      console.log("New members:", newMembers);

      const result = await collection.insertOne(data);
      console.log("Document inserted:", result.insertedId);
    });
  } catch (error) {
    console.error("Error performing database operation", error);
  }
}

main().catch(console.error);

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

4️⃣ /leaderboard - View the leaderboard and see the top performers who have solved the most problems. Compete with fellow enthusiasts and strive to climb up the ranks.

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

  if (isPrivate) {
    // check if the user exist orady in the users collection if not create it
    const fOCResponse = await findOrCreateUser(msg);
    bot.sendMessage(userId, fOCResponse);
    printAllUsers();
  }
});

function fetchDailyProblem() {
  try {
    return problemList[problemNumber++];
  } catch (error) {
    console.log("Index out of range");
  }
  return {
    title: "Sorry, No questions for today!",
    description: "None",
    link: "",
    day: -1,
  };
}
let day = 1;
function sendDailyProblem() {
  const problem = fetchDailyProblem();
  console.log(problem);

  userList.forEach((user) => {
    const message =
      "📚 *Daily LeetCode Problem*\n\n" +
      day++ +
      "\n\n" +
      "Title: " +
      problem.title +
      "\n\n" +
      "Link :\n\n" +
      "https://leetcode.com/problems/" +
      problem.titleSlug;
    bot.sendMessage(user.id, message, { parse_mode: "Markdown" });
  });
}

cron.schedule("26 10 * * *", () => {
  sendDailyProblem();
  console.log("sent!");
});

// TODO: TASK: FOR ISHAK GIVE A DAYILY QUESSION FOR USERS
cron.schedule("*/30 * * * * *", async () => {
  // GET ALL USERS
  const users = await UserModel.find({});

  // Send dayliy quession for all users

  users.map(async (user) => {
    const { day, solved } = user;
    // pick a qusseion based on user data
    const pickedQuession = getDailyUserQuession(user);

    // send the quesstion for the user

    if (pickedQuession) {
      const { title, titleSlug, difficulty, frontendQuestionId } =
        pickedQuession;
      const message = `#Day${day} Challenge \n  \n Title: ${title} \n Link: https://leetcode.com/problems/${titleSlug} \n Difficulty : ${difficulty} \n Solved: ${solved} \n \nCongratulations on completing the challenge! 🎉 You've now conquered ${
        solved + 1
      } coding challenges. Keep up the great work! Each solved challenge brings you one step closer to mastering your coding skills. `;

      // send the quesion to the user
      bot.sendMessage(user._id, message);

      // save the quession on the user quession list and incrase the day
      user.qList[frontendQuestionId] = 1;
      user.markModified("qList");
      user.day += 1;

      user.save();
    }
  });
});
