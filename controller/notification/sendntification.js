const companies = require('../../models/companies');
const bus = require('../../models/bus');
const typebus = require('../../models/typebus');
const starting = require('../../models/starting');
const destination = require('../../models/destination');
const trip = require('../../models/trip'); 
const disk = require('../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../models/duration');
const rating = require('../../models/rating'); 
const custumer = require('../../models/custumer')
var {admin} = require("./index");




exports.send = async (req, res, next) => {
  try {
    const tripId = req.params.id;

    // Fetch trip details
    const trips = await trip.findByPk(tripId);

    if (!trips) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    // Fetch all customer FCM tokens for the trip
    const customers = await custumer.findAll({
      include: {
        model: disk,
        attributes: ['custumerId'],
        where: { tripId },
      },
      attributes: ['fcmToken'], // Only retrieve fcmToken for efficiency
    });
    // Check if any customers are found
    if (customers.length === 0) {
      return res.status(200).json({ message: 'No customers found for this trip' });
    }

    // Prepare notification messages
    const messages = customers.map((customer) => ({
      token: customer.fcmToken,
      notification: {
        title:'hhhhh',
        body: 'ggg', // Replace with your actual notification body
      },
    }))
    console.log(messages)
    ;

    // Send notifications using Promise.all for efficiency
    const sendPromises = await admin.messaging().sendMulticast(messages);
    await Promise.all(sendPromises);

    res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending notifications' });
  }
};
