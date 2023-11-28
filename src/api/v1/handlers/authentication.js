const Users = require('../collection/usersColl.js');
const fs_databases = require('../../keys/FS_init.js');
const genDocId = require('../helpers/genDocId.js');
const { passCheck } = require('../helpers/hashpassword.js');
const jwt = require('jsonwebtoken');

async function Register(req, res) {
  const documentId = genDocId();
  /* VERIFY THE EMAIL AND USERNAME MUST BE UNIQUE */
  const userData = new Users(req.body); // class Users
  const resultData = userData.addUser();
  /* select users collection database and set data to add document */
  const store = await fs_databases.collection('users').doc(documentId).set(resultData);
  /*
    verify that data has been stored properly
  */
  console.info(store._writeTime);
  if ('_writeTime' in store) {
    res.status(201)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        message: 'account created',
        error: false,
        store,
      });
  } else { // failed store to database
    res.status(417)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        message: 'fail to created account, try again in a few minutes',
        error: true,
        store
      });
  }
}

async function Login(req, res) {
  const { email, password } = req.body;
  /* if request has no either email or password */
  if (email == undefined) {
    return res.status(400)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        message: 'there is no information whatsoever in the request',
        error: true
      });
  }
  /* select users collection of database */
  const user = fs_databases.collection('users');
  /* getting data from database using user email in request */
  const find = await user.where('email', '==', email).get();
  /* check if data exist */
  if (find._size == 1) {
    let userData;
    let documentId;
    /* getting data from lazy loading {snapshot} */
    find.forEach(doc => {
      userData = doc.data();
      documentId = doc.id;
    });
    /* checking user password match with hashed user password */
    if (passCheck(password, userData.password) === true) {
      /*
        generate token
      */
      const token = jwt.sign(
        {
          user_id: userData.user_data,
          email: userData.email
        },
        'ch2-ps514',
        {
          algorithm: 'HS256'
        }
      );
      /* 
        store token with user document ID or reference path
      */
      const storeToken = await fs_databases.collection('tokens').add({
        token
      });
      /* property of id indicate that data stored successfully in database */
      if ('id' in storeToken) {
        console.info(storeToken.id);
        res.status(200)
          .append('X-Powered-By', 'Biger x Barjakoub')
          .json({
            success: true,
            message: "login successful",
            token: token,
          });
      } else { // while fail storing token to database
        res.status(417)
          .append('X-Powered-By', 'Biger x Barjakoub')
          .json({
            success: false,
            message: "fail to store token",
            token: null,
          });
      }
    } else { // while user password doesn't match hashed user password
      res.status(406)
        .append('X-Powered-By', 'Biger x Barjakoub')
        .json({
          success: false,
          message: "login failed, incorrect password",
          token: null,
        });
    }
  } else { // while user data not found
    res.status(404)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        success: false,
        message: "data not found!",
        token: null
      });
  }
}

module.exports = { Register, Login };