const path = require('path')
const fs = require('fs')

const p = path.join(
  process.mainModule.filename,
  '..',
  'data',
  'card.json'
)

class Card {

  static async add(course) {
    const card = await Card.fetch()
    const idx = card.courses.findIndex(c => c.id === course.id)
    const candidate = card.courses[idx]
    const isCourseExists = !!candidate

    if (isCourseExists) {
      candidate.count += 1
      card.courses[idx] = candidate
    } else {
      course.count = 1
      card.courses.push(course)
    }

    card.price += +course.price

    return Card.#updateJSON(card)
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(p, 'utf-8', (err, content) => {
        if (err) reject (err)
        else resolve(JSON.parse(content))
      })
    })
  }

  static async remove(id) {
    const card = await Card.fetch()
    const idx = card.courses.findIndex(c => c.id === id)
    const course = card.courses[idx]

    if (course.count === 1) {
      card.courses = card.courses.filter(c => c.id !== id)
    } else {
      card.courses[idx].count--
    }

    card.price -= course.price

    return Card.#updateJSON(card)
  }

  static async #updateJSON(data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        p,
        JSON.stringify(data),
        (err) => {
          if (err) reject(err)
          else resolve(data)
        }
      )
    })
  }
}

module.exports = Card