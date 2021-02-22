const { Router } = require('express')
const { validationResult } = require('express-validator')

const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

const { courseValidators } = require('../utils/validators')

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', auth, courseValidators, async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('add', {
      title: 'Добавить курс',
      isAdd: true,
      error: errors.array()[0].msg,
      data: {
        ...(req.body ?? {})
      }
    })
  }

  const { title, price, img } = req.body
  const course = new Course({
    title,
    price,
    img,
    user: req.user,
  })

  try {
    await course.save()
    res.redirect('/courses')
  } catch (e) {
    console.error(e)
  }
})

module.exports = router
