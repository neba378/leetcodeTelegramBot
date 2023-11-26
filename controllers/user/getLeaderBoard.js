const UserModel = require("../../models/UserModel");


const getLeaderBoard = async () => {
    try {
        // Find, sort, and limit to the top 5 users by 'solved' in descending order
        const topUsers = await UserModel.find().sort({ solved: -1 }).limit(5);
    
        console.log('Top 5 Users:', topUsers);
        // Handle the top 5 users as needed
      } catch (error) {
        console.error('Error on LeaderBoard finding, sorting, and limiting users:', error);
      }
}

module.exports = {getLeaderBoard}