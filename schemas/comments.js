const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
  },
});

// 작성 시간, 수정 시간 설정
commentsSchema.set("timestamps", true);

// 콜렉션 이름 Comments
module.exports = mongoose.model("Comments", commentsSchema);
