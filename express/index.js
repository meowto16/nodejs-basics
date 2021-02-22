require('dotenv').config()
const Handlebars = require('handlebars')
const csrf = require('csurf')
const flash = require('connect-flash')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongodb-session')(session)

const homeRouter = require('./routes/home')
const addRouter = require('./routes/add')
const coursesRouter = require('./routes/courses')
const cartRouter = require('./routes/cart')
const ordersRouter = require('./routes/orders')
const authRouter = require('./routes/auth')
const profileRouter = require('./routes/profile')

const varMiddleware = require('./middleware/variables')
const userMiddleware = require('./middleware/user')
const errorHandler = require('./middleware/error')
const fileMiddleware = require('./middleware/file')

const keys = require('./keys/index')

const app = express()
const hbs = exphbs.create({
  defaultLayout: 'main',
  extname: 'hbs',
  loggerLevel: 0,
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  helpers: require('./utils/hbs-helpers')
})
const store = new MongoStore({
  collection: 'sessions',
  uri: keys.MONGO_DB.URL
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use(express.urlencoded({
  extended: true
}))
app.use(session({
  store,
  secret: 'some secret value',
  resave: false,
  saveUninitialized: false,
}))
app.use(fileMiddleware.single('avatar'))
app.use(csrf())
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use('/', homeRouter)
app.use('/add', addRouter)
app.use('/courses', coursesRouter)
app.use('/cart', cartRouter)
app.use('/orders', ordersRouter)
app.use('/auth', authRouter)
app.use('/profile', profileRouter)

app.use(errorHandler)

const PORT = keys.PORT || 3000

start()

async function start() {
  try {
    await mongoose.connect(keys.MONGO_DB.URL, {
      useNewUrlParser: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    })

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`)
    })
  } catch (e) {
    console.error(e)
  }
}
