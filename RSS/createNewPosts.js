const Post = require("../resources/Post/post.model").PostModel;
const promisePool = require("./promisePool");

const groupData = (newPostData) => {
  let arr = [];
  while (newPostData.length > 0) {
    arr.push(newPostData.slice(0, 10));
    newPostData = newPostData.slice(10, newPostData.length);
    // console.log(arr[arr.length - 1].length);
  }
  return arr;
};

const createNewPosts = (newPostData) => {
  console.log("creating new posts...");
  const groupedData = groupData(newPostData);
  return promisePool(groupedData, async (batch) => {
    try {
      await Post.create(batch);
      return;
    } catch (err) {
      console.log(err);
      // errors.push(err);
    }
    return { res: "poop", errors: [] };
  });
};

module.exports = createNewPosts;
