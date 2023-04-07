const express = require('express');
const rateLimit = require('express-rate-limit')
const Joi = require('joi');
const app = express();
const port = 3000;

app.use(express.json());


const schemaLogin = Joi.object({
  username: Joi.string()
  .min(3)
  .max(30)
  .required()
  .messages({
    'string.base': `"username" should be a type of 'text'`,
    'string.empty': `"username" cannot be an empty field`,
    'string.min': `"username" should have a minimum length of {#limit}`,
    'any.required': `"username" is a required field`
  }),

  password: Joi.string()
  .min(3)
  .max(30)
  .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
  .required()
  .messages({
    'string.empty': `"password" cannot be an empty field`,
    'string.min': `"password" should have a minimum length of {#limit}`,
    'any.required': `"password" is a required field`
  }),
})


const createAccountLimiter = rateLimit({
	windowMs: 60 * 60 * 1000, // 1 hour
	max: 5,
	message:
		'Quá nhiều tài khoản được tạo từ IP này, vui lòng thử lại sau một giờ',
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})


const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user1', password: 'admin123', role: 'user' },
  { id: 3, username: 'user2', password: 'admin123', role: 'user' }
];

const isAdmin = (req, res, next) => {
  const user = req.user;

  if (user.role === 'admin') {
    return res.redirect('/admin');
  } else {
    return next(); //next thi se chuyen tiep den 
    // res.status(200).send("Ban khong phai admin nen k dc chuyen trang")
  }
};

// Middleware check login
const checkLogin = (req, res, next) => {
  const { username, password } = req.body;

  console.log("iser: ", username);

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    return res.status(401).send('Tài khoản hoặc mật khẩu sai!');
  }
  req.user = user;
  return next();
};

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.post('/login', createAccountLimiter, checkLogin, isAdmin, (req, res) => {
  res.send(`Xin chào, ${req.user.username}!`);
});

app.get('/admin', (req, res) => {
  res.send('Xin chào, đây là trang admin!');
});

app.get('/user', isAdmin, (req, res) => {
  res.send('Đây là trang user');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



//middleware la 1 function
//app.get('/', middleware1, middleware2  ,(req, res) => {})
// app.use((req, res, next) =>{
//   console.log("md4");
//   next()
// })

// app.get('/', (req, res, next) =>{
//   console.log("md1"); 
//   next();  
//   //neu k dung next() thì sẽ dừng ở md1 và localhost xoay liên tục
//   // nếu dùng next() thì sẽ chuyển đến md2
// }, (req, res, next) =>{
//   console.log("md2");
//   // res.json("Ket thuc tại md2")
//   next()
// }, (req, res, next) =>{
//   console.log("Md3");
//   next()
//   //nếu ở cuối mà vẫn có next thì sẽ hiển thi: CANNOT GET vì req cần 1 cái phản hồi
// })