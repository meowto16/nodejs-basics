const { body } = require('express-validator/check')

exports.registerValidators = [
  body('email').isEmail().withMessage('Введите корректный E-mail'),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6, max: 56 }).isAlphanumeric(),
  body('confirm', 'Пароль должен быть минимум 6 символов').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Пароли должны совпадать')
    }
  }),
  body('name').isLength({ min: 3 }).withMessage('Имя должно быть минимум 3 символа')
]
