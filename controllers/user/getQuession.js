const easy = require("../../data/topInterviewQuessionsEasyList145.json");
const medium = require("../../data/topInterviewQuessionMediumList86.json");

const getDailyUserQuession = (user) => {
  const { day, qList } = user;
  const { questions: easyQ } = easy.data.problemsetQuestionList;
  const { questions: mediumQ } = medium.data.problemsetQuestionList;

  const topicRanges = [
    { topics: ["Array"], start: 1, end: 5 },
    { topics: ["Two Pointers"], start: 6, end: 10 },
    { topics: ["Stack"], start: 11, end: 15 },
    { topics: ["Binary Search"], start: 16, end: 20 },
    { topics: ["Sliding Window"], start: 21, end: 25 },
    { topics: ["Linked List"], start: 26, end: 30 },
    { topics: ["Trees"], start: 31, end: 35 },
  ];

  // find and assign quession topic based on user day
  const selectedRange = topicRanges.find(
    (range) => day >= range.start && day <= range.end
  );

  if (selectedRange) {
    const { start, end } = selectedRange;
    const selectedTopics = selectedRange.topics;
    let selectedQuestions;

    // check if there are given 2 esay quession in selected Topic if so give them the meduim quession
    if (day < start + 2) {
      selectedQuestions = easyQ.filter(
        (question) =>
          question.topicTags.some((tag) => tag.name == selectedTopics[0]) &&
          !qList[question.frontendQuestionId]
      );
    } else {
      selectedQuestions = mediumQ.filter(
        (question) =>
          question.topicTags.some((tag) => tag.name == selectedTopics[0]) &&
          !qList[question.frontendQuestionId]
      );
    }
    return selectedQuestions[0];
  } else {
    console.log("No matching topic range found for the given day.");
  }
};

module.exports = { getDailyUserQuession };

// problemsetQuestionList": {
//     "total": 86,
//     "questions": [
//         {
//             "acRate": 41.553185344078145,
//             "difficulty": "Medium",
//             "freqBar": null,
//             "frontendQuestionId": "2",
//             "isFavor": false,
//             "paidOnly": false,
//             "status": "ac",
//             "title": "Add Two Numbers",
//             "titleSlug": "add-two-numbers",
//             "topicTags": [
//                 {
//                     "name": "Linked List",
//                     "id": "VG9waWNUYWdOb2RlOjc=",
//                     "slug": "linked-list"
//                 },
//                 {
//                     "name": "Math",
//                     "id": "VG9waWNUYWdOb2RlOjg=",
//                     "slug": "math"
//                 },
//                 {
//                     "name": "Recursion",
//                     "id": "VG9waWNUYWdOb2RlOjMx",
//                     "slug": "recursion"
//                 }
//             ],
//             "hasSolution": true,
//             "hasVideoSolution": true
//         },
