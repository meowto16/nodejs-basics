const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        course: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        }
      },
    ]
  }
})

userSchema.methods.addToCart = async function(course) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => c.course.toString() === course._id.toString())
  if (idx >= 0) ++items[idx].count
  else items.push({ course: course._id, count: 1 })
  this.cart = { items }
  return this.save()
}

module.exports = model('User', userSchema)