const { Router } = require('express')
const router = Router()
const User = require('./../models/user')

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true
  })
})

router.post('/login', async (req, res) => {
  req.session.user = await User.findById(process.env.APP_USER_DEFAULT_ID)
  req.session.isAuthenticated = true
  req.session.save(err => {
    if (err) throw err
    else res.redirect('/')
  })
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})

module.exports = router