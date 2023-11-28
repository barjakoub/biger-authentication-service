const Firestore = require('@google-cloud/firestore');

/* make fs_databases as singleton later */

const fs_databases = new Firestore({
  // please use environment variable to set project id value at minimum
  projectId: 'capstone-ch2-ps514', // env.projectId
  keyFilename: './src/api/keys/Firestore.json'
});

module.exports = fs_databases;