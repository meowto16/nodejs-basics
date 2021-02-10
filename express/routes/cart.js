const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.course._doc,
    count: c.count
  }))
}

function computePrice(courses) {
  return courses.reduce((acc, course) => {
    return acc += (course.price * course.count)
  }, 0)
}

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id).lean()
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.course').execPopulate()
  const courses = mapCartItems(user.cart)
  const price = computePrice(courses)

  res.render('card', {
    title: 'Корзина',
    isCard: true,
    courses,
    price: price,
  })
})

router.delete('/remove/:id', async (req, res) => {
  await req.user.removeFromCart(req.params.id)
  const user = await req.user.populate('cart.items.course').execPopulate()

  const courses = mapCartItems(user.cart)
  const cart = {
    courses, price: computePrice(courses)
  }

  return res.status(200).json(cart)
})

module.exports = router