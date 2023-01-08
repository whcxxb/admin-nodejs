const express = require('express')
const { User } = require('./models')
const app = express()

// 解析post请求的body
app.use(express.json())
app.get('/api', async (req, res) => {
  res.send('ok get')
})

// 注册
app.post('/api/register', async (req, res) => {
  const user = await User.create({
    username: req.body.username,
    password: req.body.password
  })
  res.send('ok')
})

app.listen('3000', (req, res) => {
  console.log('Server is running on port 3000')
})
