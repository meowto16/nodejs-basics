require('dotenv').config()
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const app = express()
const mongoose = require('mongoose')

const homeRouter = require('./routes/home')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const User = require('./models/user')

const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs'
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(async (req, res, next) => {
  try {
    req.user = await User.findById(process.env.APP_USER_DEFAULT_ID)
    next()
  } catch (e) {
    console.error(e)
  }

})

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({
  extended: true
}))
app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/card', cartRouter)
app.use('/orders', ordersRouter)

const PORT = process.env.PORT || 3000

start()

async function start() {
  try {
    await mongoose.connect(process.env.APP_MONGO_DB_URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })
    const candidate = await User.findOne()
    if (!candidate) {
      const user = new User({
        email: 'meowto16@gmail.com',
        name: 'Maxim',
        cart: { items: [] }
      })
      await user.save()
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`)
    })
  } catch (e) {
    console.error(e)
  }
}