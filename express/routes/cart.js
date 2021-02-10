const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean()
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.course').execPopulate()
  const courses = user.cart.items.map(c => ({
    ...c.course._doc,
    count: c.count
  }))

  const price = courses.reduce((acc, course) => {
    return acc += (course.price * course.count)
  }, 0)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses,
    price: price,
  })
})

router.delete('/remove/:id', async (req, res) => {
  const card = await Card.remove(req.params.id)
  return res.status(200).json(card)
})

module.exports = router