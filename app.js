require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");
const { connectToDatabase, getDatabase } = require("./databaseConn");

//controllers
const {
  findOrCreateUser,
  printAllUsers,
} = require("./controllers/user/userController");

// views
const sendDaily = require("./views/tasks/sendDaily");
const leaderBoard = require("./views/leaderBoard");
const myStatus = require("./views/myStatus");
const reset = require("./views/reset");
const submit = require("./views/submit");

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

// For Registering Users
bot.onText(/\/register/, async (msg) => {
  await connectToDatabase();

  const userId = msg.from.id;
  const isPrivate = msg.chat.type === "private";

  if (isPrivate) {
    // check if the user exists already in the users collection if not create it
    const fOCResponse = await findOrCreateUser(msg);
    bot.sendMessage(userId, fOCResponse);
    // printAllUsers();
  }
});

// save summtion for both Users and Members
bot.onText(/\/submit/, async (msg) => {
  submit(msg, bot);
});

// reset the Community or User
bot.onText(/\/reset/, async (msg) => {
  reset(msg, bot);
});

// show status of member or User
bot.onText(/\/myStatus/, async (msg) => {
  myStatus(msg, bot);
});

// get Leader Board

bot.onText(/\/leaderBoard/, async (msg) => {
  leaderBoard(msg, bot);
});

// -------------------------------------//

// ---   SECADULED TASKS SECTION ------ //

// -------------------------------------//

// send dayily quession for users
cron.schedule("*/30 10 10 * * *", async () => {
  sendDaily(bot);
});
