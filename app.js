const express = require("express");
const cookieParser = require("cookie-parser");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const connect = require("./schemas");

const app = express();
const port = 3000;

connect(); // mongoose 연결

// post 사용하기 위한 문법, body parser
app.use(express.json());
app.use(cookieParser());
app.use("/", [postsRouter, commentsRouter, usersRouter, authRouter]);

app.get("/", (req, res) => {
  res.send("블로그 페이지 입니다.");
});

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸습니다.");
});
