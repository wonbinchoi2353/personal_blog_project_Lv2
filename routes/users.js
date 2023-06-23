const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

// 회원가입 API
router.post("/signup", async (req, res) => {
  const { nickname, password, confirm } = req.body;

  if (password !== confirm) {
    res.status(412).json({
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
    return;
  }

  // nickname이 동일한 데이터가 있는지 확인하기 위해 가져오기
  const existsUsers = await User.findOne({ nickname });
  if (existsUsers) {
    // 보안을 위해 인증 메세지는 자세히 설명하지 않음
    res.status(412).json({
      errorMessage: "중복된 닉네임입니다.",
    });
    return;
  }

  try {
    const user = new User({ nickname, password });
    await user.save();

    res.status(201).json({ message: "회원가입에 성공하였습니다." });
  } catch (error) {
    res
      .status(400)
      .json({ message: "요청한 데이터 형식이 올바르지 않습니다." });
  }
});

module.exports = router;
