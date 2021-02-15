const { Router } = require('express')
const router = Router()
const Course = require('../models/course')

function mapCartItems(cart) {
  return cart.items.map(c => ({
    ...c.course._doc,
    id: c.course.id,
    count: c.count
  }))
}

function computePrice(courses) {
  return courses.reduce((acc, course) => {
    return acc += (course.price * course.count)
  }, 0)
}

router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course)
  res.redirect('/cart')
})

router.get('/', async (req, res) => {
  const user = await req.user.populate('cart.items.course').execPopulate()
  const courses = mapCartItems(user.cart)
  const price = computePrice(courses)

  res.render('cart', {
    title: 'Корзина',
    isCart: true,
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