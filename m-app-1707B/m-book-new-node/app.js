const express = require('express')
const app = express()
const { bookNavData, bookMallData, bookMallDetailData, taskList, news } = require('./data')
const bodyParser = require('body-parser')
const cors = require('cors')

//用户列表
let userList = [{
  id: '001',
  username: 'admin',
  password: '123456'
}, {
  id: '002',
  username: 'xu',
  password: '123'
}]

let myBook = []

app.use(cors())
app.use(bodyParser.json())

app.use((req, res, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

//登录，多用户，验证用户是否存在，和密码错误
app.post('/api/login', (req, res) => {
  let { username, password } = req.body
  let user = userList.find(item => item.username === username)
  if (user) {
    if (user.password === password) {
      res.send({
        code: 200,
        data: {
          username
        },
        message: '登录成功'
      })
    } else {
      res.send({
        code: 400,
        data: {
          username
        },
        message: '密码错误'
      })
    }
  } else {
    res.send({
      code: 400,
      data: {
        username
      },
      message: '用户名不存在'
    })
  }
})

//导航
app.get('/api/nav', (req, res) => {
  res.send({
    code: 200,
    data: bookNavData,
    message: '导航'
  })
})

//列表，自动添加一个字段叫is_in_my_book true:已收藏  false:未收藏
app.get('/api/list', (req, res) => {
  let { id } = req.query
  let data = bookMallData.find(item => item.id == id).list
  //
  data.forEach(item => {
    item.is_in_my_book = myBook.findIndex(book => book.id === item.id) >= 0
  })
  res.send({
    code: 200,
    data,
    message: '列表'
  })
})

app.get('/api/list_all', (req, res) => {
  res.send({
    code: 200,
    data: bookMallData,
    message: '列表全部数据'
  })
})

//详情，自动添加一个字段叫is_in_my_book true:已收藏  false:未收藏
app.get('/api/detail', (req, res) => {
  let { id } = req.query
  let detail
  bookMallDetailData.forEach(item => {
    item.list.forEach(book => {
      if (book.id == id) {
        detail = book
        detail.is_in_my_book = myBook.findIndex(bookItem => bookItem.id === book.id) >= 0
      }
    })
  })
  res.send({
    code: 200,
    data: detail,
    message: '详情'
  })
})

//添加
app.post('/api/add', (req, res) => {
  let { book } = req.body
  let index = myBook.findIndex(item => item.id === book.id)
  if (index >= 0) {
    myBook[index].count += book.count
  } else {
    myBook.push(book)
  }
  res.send({
    code: 200,
    data: myBook,
    message: '收藏成功'
  })
})

//获取书包
app.get('/api/my_book', (req, res) => {
  res.send({
    code: 200,
    data: myBook,
    message: '书包'
  })
})

//更新
app.post('/api/update', (req, res) => {
  let { myBookNew } = req.body
  myBook = myBookNew
  res.send({
    code: 200,
    data: myBook,
    message: '更新成功'
  })
})

app.get('/api/task_list', (req, res) => {
  res.send({
    code: 200,
    data: taskList,
    message: '任务'
  })
})

app.get('/api/news', (req, res) => {
  let { page, size, search = '' } = req.query
  let newsSearchResult = news.filter(item => item.name.includes(search))
  let start = (page - 1) * size
  let end = start + size * 1
  res.send({
    code: 200,
    data: newsSearchResult.slice(start, end),
    message: '新闻'
  })
})


app.listen(85)
console.log(85)