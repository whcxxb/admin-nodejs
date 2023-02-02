const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
mongoose
  .connect('mongodb://101.42.17.104:27017/expree-auth', {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('数据库连接成功')
  })
  .catch((err) => {
    console.log('数据库连接失败')
  })

// user schema
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
  },
  createTime: {
    type: Date,
    default: Date.now()
  },
  isEnable: {
    type: Boolean,
    default: true
  }
})
// Picture schema
const PictureSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})
// Article schema
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imgArr: {
    type: Array,
    default: [],
    required: false
  },
  createTime: {
    type: Date,
    default: Date.now()
  }
})
const User = mongoose.model('User', UserSchema)
const Picture = mongoose.model('Picture', PictureSchema)
const Article = mongoose.model('Article', ArticleSchema)
module.exports = {
  User,
  Picture,
  Article
}
