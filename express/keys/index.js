module.exports = {
  PORT: process.env.APP_PORT,
  BASE_URL: process.env.APP_BASE_URL,
  MONGO_DB: {
    URL: process.env.APP_MONGO_DB_URL,
    USER: process.env.APP_MONGO_DB_USER,
    PASS: process.env.APP_MONGO_DB_PASS,
  },
  SENDGRID: {
    KEY: process.env.APP_SENDGRID_KEY
  },
  EMAIL: {
   DEFAULT_FROM: process.env.APP_DEFAULT_EMAIL_FROM
  }
}