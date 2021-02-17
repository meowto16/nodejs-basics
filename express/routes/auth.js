const { Router } = require('express')
const bcrypt = require('bcryptjs')
const User = require('./../models/user')
const router = Router()

router.get('/login', async (req, res) => {
  res.render('auth/login', {
    title: 'Авторизация',
    isLogin: true,
    error: {
      login: req.flash('loginError'),
      register: req.flash('registerError')
    }
  })
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const [candidate] = await User.find({ email })
    if (!candidate) {
      req.flash('loginError', 'Пользователь не найден')
      return res.redirect('/auth/login#login')
    }
    else {
      const areSame = await bcrypt.compare(password, candidate.password)
      if (!areSame) {
        req.flash('loginError', 'Пользователь не найден')
        return res.redirect('/auth/login#login')
      }
      else {
        req.session.user = candidate
        req.session.isAuthenticated = true
        req.session.save(err => {
          if (err) throw err
          else res.redirect('/')
        })
      }
    }
  } catch (e) {
    console.error(e)
  }
})

router.get('/logout', async (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login')
  })
})

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) {
      req.flash('registerError', 'Пользователь с таким E-Mail уже существует.')
      return res.redirect('/auth/login#register')
    }
    else {
      const hashPassword = await bcrypt.hash(password, 10)
      const user = new User({ email, name, password: hashPassword, cart: { items: [] } })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router