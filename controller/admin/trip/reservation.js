const companies = require('../../../models/companies');
const moment = require('moment')


const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const custumer = require('../../../models/custumer');
const custumerbyadmin = require('../../../models/custumerbyadmin');

const { Model } = require('firebase-admin/machine-learning');



exports.reservebyadmin = async (req, res) => {
  try {
    const companyId = req.companies.companiesId;
    const id = req.params.id;
    const disks = req.body.disks;
    const name = req.body.name;


    const result = await custumerbyadmin.findOne({where:{fullname:name}});

    if(result){
    const custumerid = result.id;
    const trips = await trip.findOne({ where: { id: id } });
    const foundSeats = await disk.findAll({ where: { tripId: trips.id, numberdisk: disks } });
    const reservedSeats = foundSeats.filter(seat => seat.status === false);
    if (reservedSeats.length > 0) {
      return res.error('One or more requested seats are unavailable. Please choose available seats.', 402);
    }

    foundSeats.forEach(seat => {
      seat.update({ custumerbyadminId: custumerid, status: false , ispaid:true });
    });

    return res.success({}, 'Reservation completed successfully.');

    }
    else{
      const newcustumer = await custumerbyadmin.create({
        fullname:name , companyId:companyId
      })
      const trips = await trip.findOne({ where: { id: id } });
      const foundSeats = await disk.findAll({ where: { tripId: trips.id, numberdisk: disks } });
      const reservedSeats = foundSeats.filter(seat => seat.status === false);
      if (reservedSeats.length > 0) {
        return res.error('One or more requested seats are unavailable. Please choose available seats.', 402);
      }
  
      foundSeats.forEach(seat => {
        seat.update({ custumerbyadminId: newcustumer.id, status: false , ispaid:true });
      });
  
      return res.success({}, 'Reservation completed successfully.');


    }

  } catch (err) {
    return res.error(err, 500);
  }
};



exports.reservation = (req, res) => {
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    disk
      .findAll({ where: { custumerId: id1, tripId: id2  , ispaid:false } })
      .then((disks) => {
        if (disks.length === 0) {
          return res.error("Not found any seats for this customer", 404);
        }
        const diskIds = disks.map((disk) => disk.id);
        disk
          .update({ ispaid: true }, { where: { id: diskIds } })
          .then(() => {
            return res.success({}, "Reservation successfully established.");
          })
          .catch((err) => {
            return res.error(err.message);
          });
      });
  };


exports.canclereserve=(req , res)=>{
    const id1 = req.params.id1;
    const id2 = req.params.id2;
    disk
      .findAll({ where: { custumerId: id1, tripId: id2  , status:false , ispaid:false} })
      .then((disks) => {
        if (disks.length === 0) {
          return res.error("Not found any seats for this customer", 404);
        }
        const diskIds = disks.map((disk) => disk.id);
        disk
          .update({ ispaid: false , status:true , custumerId:null}, { where: { id: diskIds } })
          .then(() => {
            return res.success({}, "canclereservation successfully established.");
          })
          .catch((err) => {
            return res.error(err.message);
          });
      });
}



