const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

const User = require("../schemas/user");

// 로그인 API
router.post("/login", async (req, res) => {
  const { nickname, password } = req.body;

  const user = await User.findOne({ nickname });

  // 인증 메세지는 자세히 설명하지 않음
  if (!user || password !== user.password) {
    res.status(400).json({
      errorMessage: "닉네임 또는 패스워드가 틀렸습니다.",
    });
    return;
  }

  // jwt를 생성
  const token = jwt.sign({ userId: user._id }, "customized-secret-key");
  res.cookie("Authorization", `Bearer ${token}`); // JWT를 Cookie로 할당
  res.status(200).json({ token }); // JWT를 Body로 할당
});

module.exports = router;
