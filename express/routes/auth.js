const crypto = require('crypto')
const { Router } = require('express')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('./../models/user')
const router = Router()

const regEmail = require('../emails/registration')
const resetEmail = require('../emails/reset')

const keys = require('../keys')

const transporter = nodemailer.createTransport(sendgrid({
  auth: {
    api_key: keys.SENDGRID.KEY
  }
}))

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
      await transporter.sendMail(regEmail(email))
    }
  } catch (e) {
    console.error(e)
  }
})

router.get('/reset', async (req, res) => {
  res.render('auth/reset', {
    title: 'Забыли пароль?',
    error: req.flash('error')
  })
})

router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так! Повторите попытку позже!')
        return res.redirect('/auth/reset')
      }

      const token = buffer.toString('hex')
      const candidate = await User.findOne({ email: req.body.email })

      if (candidate) {
        candidate.resetToken = token
        const hour = 60 * 60 * 1000
        candidate.resetTokenExp = Date.now() + hour

        await candidate.save()
        await transporter.sendMail(resetEmail(candidate.email, token))
        res.redirect('/auth/login')
      } else {
        req.flash('error', 'Такого email нет')
        return res.redirect('/auth/reset')
      }
    })
  } catch (e) {
    console.error(e)
  }
})

router.get('/password/:resetToken', async (req, res) => {
  try {
    const user = req.params.resetToken && await User.findOne({
      resetToken: req.params.resetToken,
      resetTokenExp: {
        $gt: Date.now() // Greater than
      }
    })
    return user
      ? res.render('/auth/password', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      })
      : res.redirect('/auth/login')
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
