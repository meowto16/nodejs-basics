const { Router } = require('express')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgrid = require('nodemailer-sendgrid-transport')
const User = require('./../models/user')
const router = Router()

const { validationResult } = require('express-validator')
const { registerValidators } = require('../utils/validators')

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

router.post('/register', registerValidators, async (req, res) => {
  try {
    const { email, password, name } = req.body
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      req.flash('registerError', errors.array()[0].msg)
      return res.status(422).redirect('/auth/login#register')
    }

    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({ email, name, password: hashPassword, cart: { items: [] } })
    await user.save()
    res.redirect('/auth/login#login')
    await transporter.sendMail(regEmail(email))

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
      ? res.render('auth/password', {
        title: 'Восстановить доступ',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.resetToken
      })
      : res.redirect('/auth/login')
  } catch (e) {
    console.error(e)
  }
})

router.post('/password', async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.body.userId,
      resetToken: req.body.token,
      resetTokenExp: {
        $gt: Date.now()
      }
    })

    if (user) {
      user.password = await bcrypt.hash(req.body.password, 10)
      user.resetToken = undefined
      user.resetTokenExp = undefined
      await user.save()
      res.redirect('/auth/login')
    } else {
      req.flash('loginError', 'Время жизни токена истекло')
      res.redirect('/auth/login')
    }
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
