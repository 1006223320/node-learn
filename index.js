'use strict'
const express = require('express')
const iconv = require('iconv-lite')
const app = express()
const rp = require('request-promise')
const $ = require('cheerio')
const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

//fs 读取测试文件
const fsTest = path.join(__dirname, './fsTest.txt')
var fileStr = fs.readFileSync(fsTest, {encoding:'binary'}) //直接读取 设置任何字符集都有可能出现乱码
var buf = new Buffer(fileStr, 'binary')
var str = iconv.decode(buf, 'GBK')

console.log(str)

// md5 加密方法
function cryptPwd(password) {
    var md5 = crypto.createHash('md5')
    return md5.update(password).digest('hex')
}


//爬虫测试
app.get('/', async (req, res) => {
  let result = await rp('https://ddys-wechat.diandianys.com/login/#/logIn')
  let data = []
  // console.log(result)
  let elements = $('script',  result)//解析出网页里的a元素
  // console.log(elements)
  elements.map((i, ele) => {
    let json = {}
    let $ele = $(ele)
    // console.log($ele.children().text())
    json.url = $ele.attr('src')//获取a元素的地址链接
    // json.title = $ele.children().text()//获取标题
    data.push(json)
  })
  console.log(data)
  res.send(data)//把data数据返回给前台
})
// SPA 应用 post 请求测试
app.get('/login', async(req, res) => {
  let result = await rp({
    method: 'POST',
    uri: 'https://ddys-book.diandianys.com/app',
    body: {
      channel: "23",
      format: "JSON",
      loginType: "2",
      oper: "127.0.0.1",
      loginName: "",
      password: cryptPwd('123456'),
      random: "1234",
      service: "ddys.book.patient.login.loginname",
      sign: "3f52f63fad63c5dd209d28420977fb5d",
      spid: "1001"
    },
    json: true
  })
  console.log('result', result)
  res.send(result)
})


app.listen(8001, () => {//启动一个8001端口的server服务
  console.log('Listening on port 8001')
})
