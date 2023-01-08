const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose.connect('mongodb://127.0.0.1:27017/express-auth', {
  useNewUrlParser: true
})

// 定义user模型
const UserSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  }
})
const User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
