/**
 * Secure routes middleware
 * @param req Request
 * @param res Response
 * @param next Next middleware
 */
module.exports = function(req, res, next) {
  if (!req.session.isAuthenticated) {
    return res.redirect('/auth/login')
  }
  return next()
}
