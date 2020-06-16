"use strict";

const dayjs = require(`dayjs`);
const ApiUsers = require(`../users/users`);
const axios = require(`../axios`);

module.exports = {
  getAll() {
    return axios.get(`/comments`).then((res) => res.data);
  },

  async getCommentsByPostId(id) {
    const comments = await this.getAll();
    return comments[id];
  },

  async getMyComments() {
    const [
      comments,
      currentUser
    ] = await Promise.all([
      this.getAll(),
      ApiUsers.getUserByName(`Topolov Sergey`)
    ]);
    const myComments = {};

    Object.keys(comments).forEach((postId) => {
      const postComments = comments[postId];
      for (const comment of postComments) {
        if (comment.userId === currentUser.id) {
          if (!myComments[postId]) {
            myComments[postId] = [];
          }
          myComments[postId].push(comment);
        }
      }
    });
    return myComments;
  },

  async getLatestComments() {
    const MAX_LATEST_COUNT = 3;
    const comments = await this.getAll();

    const formatDate = (value) => dayjs(value).valueOf();

    const sortedCommentsByLatesDate =
      Object.keys(comments)
        .reduce((commentsAcc, postId) => [...commentsAcc, ...comments[postId]], [])
        .sort((a, b) => (formatDate(b.createdDate) - formatDate(a.createdDate)))
        .slice(0, MAX_LATEST_COUNT);
    return sortedCommentsByLatesDate;
  }
};
