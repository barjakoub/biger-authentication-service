const { FieldValue } = require('@google-cloud/firestore');
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
    // guide from Firestore Documentation
    this.dateCreated = FieldValue.serverTimestamp();
    this.dateUpdated = FieldValue.serverTimestamp();
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