const notcontroller = require('../../controller/notification/sendntification') ;
const {admin} = require('../../controller/notification/index')
const express = require('express');
const router = express.Router();





router.post('/sendnotification' , async (req, res) => {
    
    

    try {
      const { title, body, tokens } = req.body;
      await admin.messaging().sendMulticast({
        fcmToken:"aymanalabd",
        notification: {
          title,
          body,
          
        },
        android: {
          notification: {
            sound: "file.mp3",
            channel_id: "dooby_channel"
          }
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