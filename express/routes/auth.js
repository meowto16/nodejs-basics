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
  try {
    const { email, password } = req.body
    const [candidate] = await User.find({ email })
    if (!candidate) return res.redirect('/auth/login#login')
    else {
      const areSame = password === candidate.password
      if (!areSame) return res.redirect('/auth/login#login')
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
    const { email, password, repeat, name } = req.body
    const candidate = await User.findOne({ email })

    if (candidate) return res.redirect('/auth/login#register')
    else {
      const user = new User({ email, name, password, cart: { items: [] } })
      await user.save()
      res.redirect('/auth/login#login')
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router