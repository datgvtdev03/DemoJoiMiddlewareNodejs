const Joi = require('joi');

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




// const result = schema.validate({fullname: "Giap Thanh Dat",username: "thanhdat", password: "abcddd"})

// console.log("kq: ", result);


function login(username, password) {
  const {error} = schemaLogin.validate({username,password})

  if(error) {
    return error.details[0].message
  } else {
    console.log("ket qua: ", schemaLogin.validate({username,password}));
    return "Dang nhap thanh cong: "

  }
}
console.log(login('datthanh', '4ewess'));







