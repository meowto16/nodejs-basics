const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  name: String,
  avatarUrl: String,
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  resetTokenExp: Date,
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

userSchema.methods.removeFromCart = async function(id) {
  const items = [...this.cart.items]
  const idx = items.findIndex(c => c.course.toString() === id)
  if (idx >= 0) {
    if (items[idx].count === 1) items.splice(idx, 1)
    else items[idx].count--
  }
  this.cart = { items }
  return this.save()
}

userSchema.methods.clearCart = async function() {
  this.cart = { items: [] }
  return this.save()
}

module.exports = model('User', userSchema)
