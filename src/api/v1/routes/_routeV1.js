const _routev1 = require('./_route.js');
const register = require('./registerRte.js');
const login = require('./loginRte.js');
const logout = require('./logoutRte.js');

_routev1.use(register, login, logout);

module.exports = _routev1;