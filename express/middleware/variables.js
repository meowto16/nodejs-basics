module.exports = function(req, res, next) {
  res.locals.isAuth = req.session.isAuthenticated
  req.user = req.session.user
  next()
}