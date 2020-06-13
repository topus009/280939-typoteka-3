'use strict';

const dayjs = require(`dayjs`);
const {sortObjs} = require(`../../utils/utils`);

const getMyData = ({currentUser, comments, posts}) => {
  const myComments = {};
  const myPosts = [];
  const myCategories = new Set();

  Object.keys(comments).forEach((postId) => {
    const postComments = comments[postId];
    for (const comment of postComments) {
      if (comment.userId === currentUser.id) {
        // comments
        if (!myComments[postId]) {
          myComments[postId] = [];
        }
        myComments[postId].push(comment);
      }
    }
  });
  posts.forEach((post) => {
    if (post.userId === currentUser.id) {
      // categories
      const postCategories = post.categories;
      postCategories.forEach((categoryId) => myCategories.add(categoryId));
      // posts
      myPosts.push(post.id);
    }
  });
  return {
    myComments,
    myPosts,
    myCategories: [...myCategories],
  };
};

const getHighlitedMatches = (queryString, string) => {
  let newString = ``;
  const rgxp = new RegExp(`(\\S*)?(` + queryString + `)(\\S*)?`, `ig`);

  if (queryString.trim().length > 0) {
    newString = string.replace(rgxp, (match, $1, $2, $3) => ($1 || ``) + `<b>` + $2 + `</b>` + ($3 || ``));
  }
  return newString.length !== string.length ? newString : ``;
};

const getSearchData = (query, posts) => {
  const results = [];

  posts.forEach((post) => {
    const formattedMatch = getHighlitedMatches(query, post.title);
    if (formattedMatch) {
      results.push({
        ...post,
        title: formattedMatch
      });
    }
  });
  return results;
};

const getHotAndLateatData = ({comments, posts}) => {
  const maxHotCount = 4;
  const maxLatestCount = 3;

  const formatDate = (value) => dayjs(value).valueOf();
  const getCommentsCount = (commentsData) => (id) => {
    if (commentsData[id]) {
      return commentsData[id].length;
    }
    return 0;
  };

  const sortedCommentsByLatesDate =
    Object.keys(comments)
      .reduce((commentsAcc, postId) => [...commentsAcc, ...comments[postId]], [])
      .sort(sortObjs(`createdDate`, true, formatDate))
      .slice(0, maxLatestCount);

  const sortedPostsByCommentsCount =
    posts
      .sort(sortObjs(`id`, true, getCommentsCount(comments)))
      .slice(0, maxHotCount);

  const postsCount = sortedPostsByCommentsCount.map((post) => [post.id, comments[post.id].length]);

  return {
    lastComments: sortedCommentsByLatesDate,
    mostPopularPosts: postsCount
  };
};

const getCategoriesCount = (posts) => {
  const categoriesCount = {};

  posts.forEach((post) => {
    post.categories.forEach((id) => {
      if (!categoriesCount[id]) {
        categoriesCount[id] = [];
        categoriesCount[id].push(null);
      } else {
        categoriesCount[id].push(null);
      }
    });
  });

  Object.keys(categoriesCount).forEach((id) => {
    categoriesCount[id] = categoriesCount[id].length;
  });

  return categoriesCount;
};

const getCategoryPostsData = (posts, id) =>
  posts.filter((post) => post.categories.includes(id));

module.exports = {
  getMyData,
  getSearchData,
  getHotAndLateatData,
  getCategoriesCount,
  getCategoryPostsData,
};
