var admin = require('firebase-admin')

var serviceAccount = require('./transport-664a1-firebase-adminsdk-ppe4h-15050514d6.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


module.exports = {admin}