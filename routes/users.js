const router = require('koa-router')()
const jwt = require('jsonwebtoken')
const { SECRET } = require('../conf/db') 

const util = require('util');
const verity = util.promisify(jwt.verify)




router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


// 产生token
router.post('/login', function (ctx, next) {
  const { userName, passWord } = ctx.request.body;
  let userInfo;
  if (userName === 'zhangsan' && passWord === 'abc') {
    userInfo = {
      userName: userName,
      passWord : passWord,
    }
  }

  // 加密 userInfo
  let token;
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, {expiresIn : '1h'})
  }

  if (userInfo == null) {
    ctx.body = {
      error: -1,
      message : '登录失败'
    }
    return;
  }

  ctx.body = {
    error: 0,
    data : token
  }
})


router.get('/getUserInfo1', async (ctx, next) => {
  const token = ctx.header.authorization;
  try {
    const payload = await verity(token.split(' ')[1], SECRET);
    console.log('payload 111===>',payload);
    ctx.body = {
      error: 0,
      userInfo: payload
    }
  } catch (ex) {
    ctx.body = {
      error: -1,
      userInfo : 'verify token failed'
    }
  }
})

module.exports = router
