const { Router } = require('express')
const Order = require('../models/order')
const router = Router()

router.get('/', async (req, res) => {
  return res.render('orders', {
    isOrder: true,
    title: 'Заказы'
  })
})

router.post('/', async (req, res) => {
  return res.redirect('/orders')
})

module.exports = router