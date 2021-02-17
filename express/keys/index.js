module.exports = {
  PORT: process.env.APP_PORT,
  MONGO_DB: {
    URL: process.env.APP_MONGO_DB_URL,
    USER: process.env.APP_MONGO_DB_USER,
    PASS: process.env.APP_MONGO_DB_PASS,
  },
  SENDGRID: {
    KEY: process.env.APP_SENDGRID_KEY
  }
}