'use strict';

const {Router} = require(`express`);
const axios = require(`../axios`);
const {postImgUpload} = require(`../../utils/upload`);

const postsRouter = new Router();

postsRouter.get(`/post/:id`, async (req, res, next) => {
  try {
    const {id} = req.params;
    const {data} = await axios.get(`/pages/posts/post/${id}`);
    res.render(`pages/posts/post`, data);
  } catch (error) {
    next(error);
  }
});

postsRouter.post(`/post/:id`, async (req, res, next) => {
  const {id} = req.params;
  try {
    const apiReq = await axios.post(`/common/comments/post/${id}`, req.body);
    if (apiReq.status === 200) {
      res.redirect(`/my/comments`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/posts/post/${id}`);
      res.render(`pages/posts/post`, {...data, errors: error.text});
      return;
    }
    next(error);
  }
});

postsRouter.get(`/post/:id/edit`, async (req, res) => {
  const {id} = req.params;
  const {data} = await axios.get(`/pages/posts/post/${id}/edit`);
  res.render(`pages/posts/post-form`, data);
});

postsRouter.post(`/post/:id/edit`, postImgUpload, async (req, res, next) => {
  const {id} = req.params;
  const postData = req.body;
  if (req.file) {
    postData.file = req.file;
  }
  try {
    const apiReq = await axios.put(`/common/posts/${id}`, postData);
    if (apiReq.status === 200) {
      res.redirect(`/my/posts`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/posts/post/${id}/edit`);
      const prevPostData = {
        ...data,
        post: {
          ...data.post,
          ...postData,
        },
        errors: error.text
      };
      res.render(`pages/posts/post-form`, prevPostData);
      return;
    }
    next(error);
  }
});

postsRouter.get(`/new`, async (req, res) => {
  const {data} = await axios.get(`/pages/posts/new`);
  res.render(`pages/posts/post-form`, data);
});

postsRouter.post(`/new`, postImgUpload, async (req, res, next) => {
  const postData = req.body;
  if (req.file) {
    postData.file = req.file;
  }
  try {
    const apiReq = await axios.post(`/common/posts`, postData);
    if (apiReq.status === 200) {
      res.redirect(`/my/posts`);
    }
  } catch (error) {
    if (error.statusCode === 400 && Array.isArray(error.text)) {
      const {data} = await axios.get(`/pages/posts/new`);
      const prevPostData = {
        ...data,
        post: {
          ...data.post,
          ...postData,
        },
        errors: error.text
      };
      res.render(`pages/posts/post-form`, prevPostData);
      return;
    }
    next(error);
  }
});

module.exports = postsRouter;
