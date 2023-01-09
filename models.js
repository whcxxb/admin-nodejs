const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose
  .connect('mongodb://127.0.0.1:27017/expree-auth', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败')
  })

// 定义user模型
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // 不能重复
    unique: true,
    // 字符串小写
    lowercase: true,
    // 必填
    required: true,
    trim: true
  },
  password: {
    type: String
  }
})
const User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
