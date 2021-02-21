const { body } = require('express-validator/check')
const User = require('../models/user')

exports.registerValidators = [
  body('email')
    .isEmail()
    .withMessage('Введите корректный E-mail')
    .custom(async (value) => {
    try {
      const user = await User.findOne({ email: value })
      if (user) {
        return Promise.reject('Такой E-Mail уже занят')
      }
    } catch (e) {
      console.error(e)
    }})
    .normalizeEmail()
  ,
  body('password', 'Пароль должен быть минимум 6 символов')
    .isLength({ min: 6, max: 56 })
    .isAlphanumeric()
    .trim(),
  body('confirm', 'Пароль должен быть минимум 6 символов').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
    return true
  }).trim(),
  body('name')
    .isLength({ min: 3 })
    .withMessage('Имя должно быть минимум 3 символа')
    .trim()
]
