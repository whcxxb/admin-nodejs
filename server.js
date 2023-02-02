const express = require('express')
const { User } = require('./models')
const multer = require('multer')
const app = express()
const cors = require('cors')
app.use(cors())
// // 清空User
// User.deleteMany({}, (err, data) => {
//   console.log('清空User')
// })

// User.updateMany({}, { isEnable: true }, (err, data) => {
//   console.log('更新所有用户为启用')
// })

// 更新admin 禁用
// User.updateOne({ username: 'admin ' }, { isEnable: true }, (err, data) => {
//   console.log('更新admin 禁用')
// })

// 解析post请求的body
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 导入jsonwebtoken生成 jwt 字符串的包
const jwt = require('jsonwebtoken')
//导入将客户端发送过来的 JWT 字符串，解析还原成 JSON 对象的包
const expressJWT = require('express-jwt')
// 导入bcrypt加密包
const bcrypt = require('bcryptjs')
const secretKey = 'itcast'

// 验证token是否过期并规定哪些路由不用验证
app.use(
  expressJWT({ secret: secretKey, algorithms: ['HS256'] }).unless({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    path: ['/api/login', '/api/register', '/api/userlist', '/api/upload', '/static/img', '/static/img/:filename']
  })
)
// 生成token
const addToken = (username) => {
  const token = jwt.sign({ username }, secretKey, { expiresIn: '2h' })
  return token
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/img')
  },
  filename: function (req, file, cb) {
    let str = file.originalname.split('.')
    cb(null, Date.now() + '.' + str[1])
  }
})
const upload = multer({ storage: storage })

// 上传图片
app.post('/api/upload', upload.single('file'), (req, res) => {
  const { filename } = req.file
  if (filename) {
    res.send({
      code: 0,
      success: true,
      msg: '上传成功',
      data: {
        imgUrl: `http://101.42.17.104:3000/static/img/${filename}`
      }
    })
  } else {
    res.send({
      code: 1,
      success: false,
      msg: '上传失败'
    })
  }
})
// 读取图片文件
// app.use('/static', express.static('static'))
app.get('/static/img/:filename', (req, res) => {
  const { filename } = req.params
  res.sendFile(__dirname + '/static/img/' + filename)
})

// 注册
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    const user = await User.findOne({ username })
    if (user) {
      res.send({
        code: 1,
        success: false,
        msg: '用户名已存在'
      })
      return
    }
    await User.create({
      username,
      password: bcrypt.hashSync(password, 10)
    })
    res.send({
      code: 0,
      success: true,
      msg: '注册成功'
    })
  } else {
    res.send({
      code: 1,
      success: false,
      msg: '缺少必要的参数'
    })
  }
})
// 登录
app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  User.findOne({ username }, (err, data) => {
    if (err || !data) {
      res.send({ code: '1', msg: '登录失败' })
      return
    }
    if (data) {
      // 验证密码是否正确
      const isPwdValid = bcrypt.compareSync(password, data.password)
      if (isPwdValid) {
        const tokenStr = addToken(username)
        res.send({
          code: 0,
          success: true,
          data: {
            username,
            tokenStr
          },
          // token: tokenStr,
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
  const userlist = await User.find()
  res.send({
    code: 0,
    success: true,
    data: userlist
  })
})

// 更新用户状态
app.post('/api/updatestatus', async (req, res) => {
  const { _id, isEnable } = req.body
  // let status = isEnable === 'true' ? true : false
  // console.log(_id, isEnable)
  User.updateOne({ _id }, { isEnable }, (err, data) => {
    if (err) {
      res.send({
        code: 1,
        success: false,
        msg: '更新失败'
      })
    } else {
      res.send({
        code: 0,
        success: true,
        msg: '更新状态成功'
      })
    }
  })
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
