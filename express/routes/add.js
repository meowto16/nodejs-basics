const { Router } = require('express')
const Course = require('../models/course')
const auth = require('../middleware/auth')
const router = Router()

router.get('/', auth, (req, res) => {
  res.render('add', {
    title: 'Добавить курс',
    isAdd: true
  })
})

router.post('/', auth, async (req, res) => {
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
