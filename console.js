function consoleToJSON() {
  const c = {}
  for (let i = 2; i < process.argv.length; i++) {
    const [key, value] = process.argv[i].split('=')
    c[key] = value ?? true
  }
  console.log(c)
}

consoleToJSON()