const Firestore = require('@google-cloud/firestore');

/* make fs_databases as singleton later */

const fs_databases = new Firestore({
  // please use environment variable to set project id value at minimum
  projectId: process.env.PROJECT_ID || "capstone-ch2-ps514", // env.projectId
  keyFilename: process.env.PATH_KEY || "./src/api/keys/Firestore.json"
});

module.exports = fs_databases;