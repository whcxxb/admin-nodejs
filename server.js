const express = require('express')
const { User } = require('./models')
const app = express()
const cors = require('cors')
app.use(cors())
// // 清空User
// User.deleteMany({}, (err, data) => {
//   console.log('清空User')
// })

// 解析post请求的body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 导入jsonwebtoken生成 jwt 字符串的包
const jwt = require('jsonwebtoken')
//导入将客户端发送过来的 JWT 字符串，解析还原成 JSON 对象的包
const expressJWT = require('express-jwt')
const secretKey = 'itcast'

// 验证token是否过期并规定哪些路由不用验证
app.use(expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({ path: ['/api/login', '/api/register'] }))

// 生成token
const addToken = (username) => {
  const token = jwt.sign({ username }, secretKey, { expiresIn: '2h' })
  return token
}

// 注册
app.post('/api/register', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    res.send({
      code: 0,
      success: true,
      msg: '注册成功'
    })
  } catch (error) {
    res.send({
      code: 1,
      success: false,
      msg: '用户名重复'
    })
  }
})
// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  User.findOne({ username }, (err, data) => {
    if (data) {
      if (data.password === password) {
        const tokenStr = addToken(username)
        res.send({
          code: 0,
          success: true,
          token: tokenStr,
          msg: '登录成功'
        })
      } else {
        res.send({
          code: 1,
          success: false,
          msg: '密码错误'
        })
      }
    } else {
      res.send({
        code: 1,
        success: false,
        msg: '用户不存在'
      })
    }
  })
})

// 获取用户信息
app.get('/api/userinfo', (req, res) => {
  const { username } = req.user
  User.findOne({ username }).then((data) => {
    const { id, username, createTime } = data
    res.send({
      code: 0,
      success: true,
      data: {
        id,
        username,
        createTime
      }
    })
  })
})

// 获取所有用户名
app.get('/api/userlist', async (req, res) => {
  const userlist = await User.find().select('username id createTime')
  res.send(userlist)
})

// 错误中间件
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('无效的token')
  }
  res.send({
    status: 500,
    message: '未知的错误'
  })
  next()
})

app.listen('3000', (req, res) => {
  console.log('Server is running on port 3000')
})
