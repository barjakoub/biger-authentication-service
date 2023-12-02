const Users = require('../collection/usersColl.js');
const fs_databases = require('../../keys/FS_init.js');
const genDocId = require('../helpers/genDocId.js');
const { passCheck } = require('../helpers/hashpassword.js');
const jwt = require('jsonwebtoken');
const { FieldValue } = require('@google-cloud/firestore');

/**
 * @constant users define initiation of users collection database 
 * @constant tokens define initiation of tokens collection database
 */
const users = fs_databases.collection('users');
const tokens = fs_databases.collection('tokens');

async function Register(req, res) {
  const documentId = genDocId();
  /* VERIFY THE EMAIL AND USERNAME MUST BE UNIQUE */
  const emailUniqueCheck = await users.where('email', '==', req.body.email).get();
  /**
   * @property represents that the data query results are empty.
   * This aim to validate that one email can only be used for one account.
   */
  if (emailUniqueCheck.empty == true) {
    /**
     * @class Users
     */
    const userData = new Users(req.body);
    const resultData = userData.addUser();
    /* select users collection database and set data to add document */
    const store = await fs_databases.collection('users').doc(documentId).set(resultData);
    /*
      verify that data has been stored properly
    */
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
  } else {
    res.status(400)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        message: 'your email has been used, please use a different email',
        error: true,
        store: null
      })
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
  /* getting data from database using user email in request */
  const find = await users.where('email', '==', email).get();
  /* check if data exist */
  if (find._size == 1) {
    let userData;
    let documentId;
    /* getting data from lazy loading {snapshot} */
    find.forEach(doc => {
      userData = doc.data();
      documentId = doc.id;
    });
    /* check user logged in data */
    if (userData.isLoggedIn == true) {
      return res.status(400)
        .append('X-Powered-By', 'Biger x Barjakoub')
        .json({
          success: false,
          message: 'your account already logged in on another device',
          token: null
        });
    }
    /* checking user password match with hashed user password */
    if (passCheck(password, userData.password) === true) {
      /*
        generate token
      */
      const token = jwt.sign(
        {
          documentId: documentId,
          user_id: userData.user_id,
          email: userData.email,
        },
        'ch2-ps514',
        {
          algorithm: 'HS256'
        }
      );
      /* 
        store token with user document ID or reference path
      */
      const storeToken = await tokens.add({
        token
      });
      /* property of id indicate that data stored successfully in database */
      if ('id' in storeToken) {
        /**
         * @property isLoggedIn update to true
         */
        await users.doc(documentId).update({
          dateUpdated: FieldValue.serverTimestamp(),
          isLoggedIn: true
        });
        res.status(200)
          .append('X-Powered-By', 'Biger x Barjakoub')
          .json({
            success: true,
            message: "login successful",
            token: token,
            user_detail: {
              user_id: userData.user_id,
              username: userData.username,
              email,
              dateCreated: userData.dateCreated,
              dateUpdated: userData.dateUpdated
            }
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

async function Logout(req, res) {
  const token = req.get('Authorization').substring(7);
  try {
    const decoded = jwt.verify(token, 'ch2-ps514');
    console.info(decoded);
    await users.doc(decoded.documentId).update({
      // guide from Firestore Documentation
      dateUpdated: FieldValue.serverTimestamp(),
      isLoggedIn: false
    });
    const findToken = await tokens.where('token', '==', token).get();
    if (findToken._size == 1) {
      findToken.forEach(async doc => {
        console.info(doc.id);
        await tokens.doc(doc.id).delete();
      });
    } else {
      return res.status(200)
        .append('X-Powered-By', 'Biger x Barjakoub')
        .json({
          success: false,
          message: 'cannot delete. user token not found',
          logged_status: true
        });
    }
    res.status(200)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        success: true,
        message: 'logout success!',
        logged_status: false
      });
  } catch (error) {
    res.status(400)
      .append('X-Powered-By', 'Biger x Barjakoub')
      .json({
        success: false,
        message: error,
        logged_status: true
      })
  }
}

module.exports = { Register, Login, Logout };