const bcrypt = require('bcryptjs')
const { body } = require('express-validator')
const User = require('../models/user')

exports.loginValidators = [
  body('email', 'Введите корректный E-mail')
    .isEmail()
    .normalizeEmail(),
  body('password')
    .custom(async (password, { req }) => {
      try {
        const candidate = await User.findOne({ email: req.body.email })
        if (!candidate) return Promise.reject('Пользователь не существует')
        const areSame = await bcrypt.compare(password, candidate.password)
        if (!areSame) return Promise.reject('Неверный пароль')
      } catch (e) {
        console.error(e)
        return Promise.reject('Что-то пошло не так!')
      }
      return true
    })
]

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
      return Promise.reject('Что-то пошло не так!')
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

exports.courseValidators = [
  body('title').isLength({ min: 3 }).withMessage('Минимальная длина названия 3 символа').trim(),
  body('price').isNumeric().withMessage('Введите корректную цену (число)'),
  body('img', 'Введите корректный URL картинки').isURL()
]
