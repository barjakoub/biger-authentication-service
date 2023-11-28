const bcrypt = require('bcrypt');

const _SALTROUNDS = 10;
/* hash user password */
const userPassHash = (notHashed) => {
  const salt = bcrypt.genSaltSync(_SALTROUNDS);
  const hash = bcrypt.hashSync(notHashed, salt);

  return hash;
}
/* compare user password with hashed password */
const passCheck = (notHashed, hashedPassword,) => {
  const check = bcrypt.compareSync(notHashed, hashedPassword)
  if (check == true) {
    return true;
  } else {
    return false;
  }
}

module.exports = { userPassHash, passCheck };