const express = require('express')
const { User } = require('./models')
const app = express()

// // 清空User
// User.deleteMany({}, (err, data) => {
//   console.log('清空User')
// })

// 解析post请求的body
app.use(express.json())
app.get('/api', async (req, res) => {
  res.send('ok get')
})

// 注册
app.post('/api/register', async (req, res) => {
  try {
    const user = await User.create({
      username: req.body.username,
      password: req.body.password
    })
    res.send(user)
  } catch (error) {
    res.status(422).send({
      message: error.message
    })
  }
})
// 获取所有用户名
app.get('/api/userlist', async (req, res) => {
  const userlist = await User.find().select('username id')
  res.send(userlist)
})

app.listen('3000', (req, res) => {
  console.log('Server is running on port 3000')
})
