const keys = require('../keys/index')

module.exports = function(email) {
  return {
    to: email,
    from: keys.EMAIL.DEFAULT_FROM,
    subject: 'Аккаунт создан',
    html: `
      <h1>Добро пожаловать в наш магазин</h1>
      <p>Вы успешно создали аккаунт ${email}</p>
      <hr />
      <a href="${keys.BASE_URL}">Перейти на сайт</a>
    `
  }
}