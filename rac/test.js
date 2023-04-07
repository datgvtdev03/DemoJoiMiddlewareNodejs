const Joi = require('joi')
const loginSchema = Joi.object({
    username: Joi.string()
        .min(6)
        .max(30)
        .required()
        
})


const { error, value } = loginSchema.validate({ username: 'aaaaaaaa' });
if (error) {
    console.log('Có lỗi xảy ra' + error)
} else {
    login("khachuong", "13aaa334")
}

function login(username, password) {
    return true
}