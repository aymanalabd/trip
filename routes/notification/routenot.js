const notcontroller = require('../../controller/notification/sendntification') ;
const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");






router.post('/sendnotification' , async (req, res) => {
    
    

    try {
      await admin.messaging().send({
       token:"cNzgeK87SEaubXDB4Fjmgb:APA91bEqMhRLVFpl-UL8b1buFCbg73QX370g4KIZ34wHJ2kxzJ8Bs5J4rEUGAg3RXeaKAI7HtFza-AlsaLHTXvm_v-DoOm5dheNCguZc9t3TFXIrbQsT9z_4tJ7dNO12u3OrEeYRhgWS",
        notification: {
          title:"this is title",
          body:"this is body",
          
        }
      });
      res.status(200).json({ status: 200, message: "Successfully sent notifications!" });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ message: err.message || "Something went wrong!" });
    }
});




module.exports = router;