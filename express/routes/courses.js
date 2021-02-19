const { Router } = require('express')
const Course = require('../models/course')
const router = Router()
const auth = require('../middleware/auth')

function isOwner(course, req) {
  return course.user.toString() !== req.user._id.toString()
}

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find()
      .select('price title img')
      .populate('user', 'id email name')

    res.render('courses', {
      title: 'Курсы',
      userId: req.user ? req.user._id.toString() : null,
      isCourses: true,
      courses,
    })
  } catch (e) {
    console.error(e)
  }
})

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id).lean()
  res.render('course', {
    layout: 'empty',
    ...course,
  })
})

router.get('/:id/edit', auth, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect('/')
  }

  try {

    const course = await Course.findById(req.params.id)
    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }

    res.render('course-edit', {
      title: `Редактировать "${course.title}"`,
      course,
    })
  } catch (e) {
    console.error(e)
  }
})

router.post('/edit', auth, async (req, res) => {
  try {
    const { id, ...courseProps } = req.body
    const course = await Course.findById(id)
    if (!isOwner(course, req)) {
      return res.redirect('/courses')
    }
    Object.assign(course, courseProps)
    await course.save()

    res.redirect('/courses')
  } catch (e) {
    console.error(e)
  }
})

router.post('/remove', auth, async (req, res) => {
  try {
    await Course.deleteOne({ _id: req.body.id })
    res.redirect('/courses')
  } catch (e) {
    console.error(e)
  }
})

module.exports = router


