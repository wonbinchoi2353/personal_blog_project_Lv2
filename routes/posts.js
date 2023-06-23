const express = require("express");
const router = express.Router();
const Post = require("../schemas/posts");
const authMiddleware = require("../middlewares/auth-middleware");

const data = [];

// 게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }

  const nickname = res.locals.user.nickname;
  const userId = res.locals.user._id;
  const { title, content } = req.body;

  try {
    await Post.create({
      userId: userId,
      nickname: nickname,
      title,
      content,
    });

    res.status(201).json({
      message: "게시글 작성에 성공하였습니다.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 목록 조회
router.get("/posts", async (req, res) => {
  const data = await Post.find({});

  try {
    const posts = data.map((post) => {
      return {
        postId: post._id,
        userId: post.userId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      };
    });
    res.json({ posts: posts });
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "게시글 조회에 실패하였습니다." });
  }
});

// 게시글 상세 조회
router.get("/posts/:postId", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }

  const { postId } = req.params;

  try {
    const data = await Post.find();
    const posts = data
      .filter((post) => post._id.toString() === postId)
      .map((post) => {
        return {
          postId: post._id,
          userId: post.userId,
          nickname: post.nickname,
          title: post.title,
          content: post.content,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        };
      });
    res.json({ posts: posts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(412)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const nickname = res.locals.user.nickname;
  const { title, content } = req.body;
  const { postId } = req.params;
  try {
    const existsPost = await Post.find({ _id: postId, nickname: nickname });
    if (existsPost.length) {
      await Post.updateOne(
        { _id: postId },
        { $set: { title: title, content: content } }
      );
      res.json({ message: "게시글을 수정하였습니다." });
    } else {
      res.status(401).json({
        success: false,
        message: "게시글이 정상적으로 수정되지 않았습니다.",
      });
    }
  } catch (error) {
    res
      .status(400)
      .json({ success: false, message: "게시글 수정에 실패하였습니다." });
  }
});

// 게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }

  const nickname = res.locals.user.nickname;
  const { postId } = req.params;

  try {
    const existsPost = await Post.find({ _id: postId, nickname: nickname });
    if (existsPost.length) {
      await Post.deleteOne({ _id: postId });
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
