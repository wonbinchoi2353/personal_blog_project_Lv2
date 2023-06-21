const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  password: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// 작성 시간, 수정 시간 설정
postsSchema.set("timestamps", true);

// 콜렉션 이름 Posts
module.exports = mongoose.model("Posts", postsSchema);
