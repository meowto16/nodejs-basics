const keys = require('../keys/index')

module.exports = function(email, token) {
  return {
    to: email,
    from: keys.EMAIL.DEFAULT_FROM,
    subject: 'Восстановление пароля',
    html: `
      <h1>Вы забыли пароль?</h1>
      <p>Если нет, то проигнорируйте данное письмо</p>
      <p>Иначе, нажмите на ссылку ниже: <br> <a href="${keys.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
      <hr />
      <a href="${keys.BASE_URL}">Перейти на сайт</a>
    `
  }
}