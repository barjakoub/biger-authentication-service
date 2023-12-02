const { userPassHash } = require('../helpers/hashpassword.js');
const nanoid = require('nanoid');

class Users {
  constructor(userData) {
    const prefixUserId = 'biger';
    const uniqueId = nanoid.customAlphabet('zxcvbnmasdfghjklqwertyuiopZXCVBNMASDFGHJKLQWERTYUIOP1234567890', 11);
    this.userId = prefixUserId + uniqueId();
    this.username = userData.username;
    this.email = userData.email;
    this.password = userPassHash(userData.password);
    this.dateCreated = new Date().toLocaleString();
    this.dateUpdated = new Date().toLocaleString();
    this.isLoggedIn = false; // ADD LOGGED STATUS
  }

  addUser() {
    return {
      user_id: this.userId,
      username: this.username,
      email: this.email,
      password: this.password,
      dateCreated: this.dateCreated,
      dateUpdated: this.dateUpdated,
      isLoggedIn: this.isLoggedIn
    }
  }
}

module.exports = Users;