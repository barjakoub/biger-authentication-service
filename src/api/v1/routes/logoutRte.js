const logout = require('./_route.js');
const { Logout } = require('../handlers/authentication.js');

logout.route('/logout')
  .all((req, res, next) => {
    console.info('VERIFYING_USER_AUTHORIZATION...');
    if (req.get('Authorization') == undefined) {
      console.info('AUTHORIZATION_FAIL!');
      return res.status(401)
        .json({
          success: false,
          message: 'no authorization header',
          logged_status: true
        });
    }
    next()
  })
  .post(Logout);

module.exports = logout;