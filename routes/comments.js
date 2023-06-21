const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comments");

const data = [];

// 댓글 생성
router.post("/posts/:_postId/comments", async (req, res) => {
  const { user, password, content } = req.body;
  try {
    if (!req.body || !req.params) {
      throw new Error("데이터 형식이 올바르지 않습니다.");
    }
    if (!req.body.content) {
      throw new Error("댓글 내용을 입력해주세요.");
    }
    const createdComments = await Comment.create({
      user,
      password,
      content,
    });
    res.json({
      message: "댓글을 생성하였습니다.",
      data: createdComments,
    });
  } catch (error) {
    console.error(error.message);

    switch (error.message) {
      case "데이터 형식이 올바르지 않습니다.":
        res.status(400).json({
          success: false,
          message: "데이터 형식이 올바르지 않습니다.",
        });
        break;
      case "댓글 내용을 입력해주세요.":
        res
          .status(400)
          .json({ success: false, message: "댓글 내용을 입력해주세요." });
        break;
      default:
        res.status(500).json({ success: false, message: error.message });
        break;
    }
  }
});

// 댓글 목록 조회
router.get("/posts/:_postId/comments", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const posts = await Comment.find();
  const data = posts.map((comment) => {
    return {
      commentId: comment._id,
      user: comment.user,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  });
  res.json({ data: data });
});

// 댓글 수정
router.put("/posts/:_postId/comments/:_commentId", async (req, res) => {
  const { password, content } = req.body;
  const { _commentId } = req.params;
  try {
    if (!req.body || !req.params) {
      throw new Error("데이터 형식이 올바르지 않습니다.");
    }
    if (!req.body.content) {
      throw new Error("댓글 내용을 입력해주세요.");
    }
    const existsComment = await Comment.find({ _id: _commentId });
    if (existsComment.length && existsComment[0].password === password) {
      await Comment.updateOne(
        { _id: _commentId },
        { $set: { password: password, content: content } }
      );
      res.json({ message: "댓글을 수정하였습니다." });
    } else {
      throw new Error("댓글 조회에 실패하였습니다.");
    }
  } catch (error) {
    console.error(error.message);

    switch (error.message) {
      case "데이터 형식이 올바르지 않습니다.":
        res.status(400).json({
          success: false,
          message: "데이터 형식이 올바르지 않습니다.",
        });
        break;
      case "댓글 내용을 입력해주세요.":
        res
          .status(400)
          .json({ success: false, message: "댓글 내용을 입력해주세요." });
        break;
      case "댓글 조회에 실패하였습니다.":
        res
          .status(404)
          .json({ success: false, message: "댓글 조회에 실패하였습니다." });
        break;
      default:
        res.status(500).json({ success: false, message: error.message });
        break;
    }
  }
});

// 댓글 삭제
router.delete("/posts/:_postId/comments/:_commentId", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const { password } = req.body;
  const { _commentId } = req.params;
  try {
    const existsComment = await Comment.find({ _id: _commentId });
    if (existsComment.length && existsComment[0].password === password) {
      await Comment.deleteOne({ _id: _commentId });
      res.json({ message: "댓글을 삭제하였습니다." });
    } else {
      res
        .status(404)
        .json({ success: false, message: "댓글 조회에 실패하였습니다." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
