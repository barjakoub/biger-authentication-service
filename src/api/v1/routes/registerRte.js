const register = require('./_route.js');
const { Register } = require('../handlers/authentication.js');

/* use router.use() later for authorization */
register.route('/register')
  .all((req, res, next) => {
    console.info('CREATED MIDDLEWARE FOR AUTHENTICATION AND AUTHORIZATION LATER');
    next();
  })
  .post(Register);

module.exports = register;