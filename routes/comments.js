const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comments");
const authMiddleware = require("../middlewares/auth-middleware");

const data = [];

// 댓글 생성
router.post("/posts/:postId/comments", authMiddleware, async (req, res) => {
  const nickname = res.locals.user.nickname;
  const userId = res.locals.user._id;
  const { comment } = req.body;

  try {
    if (!req.body || !req.params) {
      throw new Error("데이터 형식이 올바르지 않습니다.");
    }
    if (!req.body.comment) {
      throw new Error("댓글 내용을 입력해주세요.");
    }
    await Comment.create({
      userId: userId,
      nickname: nickname,
      comment,
    });
    res.status(201).json({
      message: "댓글을 작성하였습니다.",
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
router.get("/posts/:postId/comments", async (req, res) => {
  if (!req.body || !req.params) {
    res
      .status(400)
      .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
  }
  const data = await Comment.find();
  const comments = data.map((comment) => {
    return {
      commentId: comment._id,
      userId: comment.userId,
      nickname: comment.nickname,
      comment: comment.comment,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  });
  res.json({ comments: comments });
});

// 댓글 수정
router.put(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    const nickname = res.locals.user.nickname;
    const { comment } = req.body;
    const { commentId } = req.params;
    try {
      if (!req.body || !req.params) {
        throw new Error("데이터 형식이 올바르지 않습니다.");
      }
      if (!req.body.comment) {
        throw new Error("댓글 내용을 입력해주세요.");
      }
      const existsComment = await Comment.find({
        _id: commentId,
        nickname: nickname,
      });
      if (existsComment.length) {
        await Comment.updateOne(
          { _id: commentId },
          { $set: { comment: comment } }
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
  }
);

// 댓글 삭제
router.delete(
  "/posts/:postId/comments/:commentId",
  authMiddleware,
  async (req, res) => {
    if (!req.body || !req.params) {
      res
        .status(400)
        .json({ success: false, message: "데이터 형식이 올바르지 않습니다." });
    }
    const nickname = res.locals.user.nickname;
    const { commentId } = req.params;
    try {
      const existsComment = await Comment.find({
        _id: commentId,
        nickname: nickname,
      });
      if (existsComment.length) {
        await Comment.deleteOne({ _id: commentId });
        res.json({ message: "댓글을 삭제하였습니다." });
      } else {
        res
          .status(404)
          .json({ success: false, message: "댓글 조회에 실패하였습니다." });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

module.exports = router;
