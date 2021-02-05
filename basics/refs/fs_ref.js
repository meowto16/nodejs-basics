const fs = require('fs')
const path = require('path')

// File system
/*
fs.mkdir(path.join(__dirname, 'notes'), err => {
  if (err) throw err

  console.log('Папка была создана')
})
 */

const notesPath = path.join(__dirname, 'notes', 'mynotes.txt');

(async () => {
  await fs.writeFile(notesPath, 'Hello world', () => console.log('Файл создан'))
  await fs.appendFile(notesPath, ' From append file', () => console.log('Файл изменен'))
  await fs.readFile(notesPath, 'utf-8', (err, data) => console.log(data))
})()