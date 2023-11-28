const login = require('./_route.js');
const { Login } = require('../handlers/authentication.js');

login.route('/login')
  .all((req, res, next) => {
    console.info('CREATED MIDDLEWARE FOR AUTHENTICATION AND AUTHORIZATION LATER');
    next();
  })
  .post(Login);

module.exports = login;