var admin = require("firebase-admin");

var serviceAccount = require("./index-603ae-firebase-adminsdk-idpf0-ad834f81de.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});




module.exports = {admin}