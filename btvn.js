const express = require('express');
const app = express();
const Joi = require('joi');

app.use(express.json());

const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
  { id: 3, username: 'us', password: 'user123', role: 'admin' },
];

const loginSchema = Joi.object({
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

// Middleware xử lý đăng nhập
const loginMiddleware = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });  //check lỗi 
  }

  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Tài khoản hoặc mật khẩu không chính xác!' });
  }
  req.user = user;
  next();
};


const isAdmin = (req, res, next) => {
  const user = req.user;
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Bạn là User, bạn không có quyền truy cập trang Admin' });
  }
  next();
};

app.post('/login', loginMiddleware, isAdmin, (req, res) => {
  res.redirect('/admin')
});

app.get('/admin', (req, res) => {
  res.send('Xin chao admin');
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
