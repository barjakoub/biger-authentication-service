const _routev1 = require('./_route.js');
const register = require('./registerRte.js');
const login = require('./loginRte.js');

_routev1.use(register, login);

module.exports = _routev1;