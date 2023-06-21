const express = require("express");
const router = express.Router();
const Post = require("../schemas/posts");

const data = [];

// 게시글 작성
router.post("/posts", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const { user, password, title, content } = req.body;
  try {
    const createdPosts = await Post.create({
      user,
      password,
      title,
      content,
    });
    res.json({
      message: "게시글을 생성하였습니다.",
      data: createdPosts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const posts = await Post.find();
  const data = posts.map((post) => {
    return {
      postId: post._id,
      user: post.user,
      title: post.title,
      createdAt: post.createdAt,
    };
  });
  res.json({ data: data });
});

// 게시글 상세 조회
router.get("/posts/:_postId", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const { _postId } = req.params;
  try {
    const posts = await Post.find();
    const data = posts
      .filter((post) => post._id.toString() === _postId)
      .map((post) => {
        return {
          postId: post._id,
          user: post.user,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
        };
      });
    res.json({ data: data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 수정
router.put("/posts/:_postId", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const { password, title, content } = req.body;
  const { _postId } = req.params;
  try {
    const existsPost = await Post.find({ _id: _postId });
    if (existsPost.length && existsPost[0].password === password) {
      await Post.updateOne(
        { _id: _postId },
        { $set: { password: password, title: title, content: content } }
      );
      res.json({ message: "게시글을 수정하였습니다." });
    } else {
      res
        .status(404)
        .json({ success: false, message: "게시글 조회에 실패하였습니다." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 삭제
router.delete("/posts/:_postId", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const { password } = req.body;
  const { _postId } = req.params;
  try {
    const existsPost = await Post.find({ _id: _postId });
    if (existsPost.length && existsPost[0].password === password) {
      await Post.deleteOne({ _id: _postId });
      res.json({ message: "게시글을 삭제하였습니다." });
    } else {
      res
        .status(404)
        .json({ success: false, message: "게시글 조회에 실패하였습니다." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
