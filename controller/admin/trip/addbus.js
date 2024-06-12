
const bus = require('../../../models/bus');
const drivers = require('../../../models/driver');
const typebus = require('../../../models/typebus');



exports.getbuses = (req, res) => {
    const companiesId = req.companies.companiesId;
    bus.findAll({ where: { companyId: companiesId  , status:true}, attributes: ["id", "number", "driverId", "typebusId"] })
      .then((buses) => {
        const busPromises = buses.map((bus) => {
          if (bus.driverId) {
            return drivers.findOne({ where: { id: bus.driverId } })
              .then((driver) => {
               
                return typebus.findOne({ where: { id: bus.typebusId } })
                  .then((typebus) => {
                    return {
                      id: bus.id,
                      number: bus.number,
                      type: typebus.type,
                      driver: driver.fullname
                    };
                  });
              });
          } else {
            return typebus.findOne({ where: { id: bus.typebusId } })
              .then((typebus) => {
                return {
                  id: bus.id,
                  number: bus.number,
                  type: typebus.type,
                  driver: null
                };
              });
          }
        });
  
        Promise.all(busPromises)
          .then((busNumbers) => {
            res.success(busNumbers, 'This is all buses');
          })
          .catch((err) => {
            res.error(err, 500);
          });
      })
      .catch((err) => {
        res.error(err, 500);
      });
  };


  
exports.gettypebus = (req , res)=>{

    typebus.findAll().then(r=>{
        return res.success(r)
    }).catch(err=>{
        res.error(err , 500);
    })
}


exports.addbus = async (req, res) => {
    try {
      const companiesId = req.companies.companiesId;
      const typebuss = req.body.type;
      const number = req.body.number;
      const driver = req.body.driverId;
      const place = req.body.place;
      const existingDriver = await drivers.findByPk(driver);
      if (!existingDriver) {
        return res.error("Excuse me, the driver does not exist", 404);
      }
              

      const numofdisks = await typebus.findOne({ where: { type: typebuss } });
  
      const existingBus = await bus.findOne({
        where: { number: number, companyId: companiesId }
      });
  
      if (existingBus) {
        return res.error('Excuse me, this bus already exists'  , 402);
      }
  
      await bus.create({
        number: number,
        numofdisk: numofdisks.numofdisk,
        typebusId: numofdisks.id,
        driverId: driver,
        status:true,
        companyId: companiesId,
        place:place
      });
  
      return res.success({},'Successfully added bus');
    } catch (err) {
      return res.error(err.message , 500);
    }
  };


  exports.updatebus = (req , res )=>{
    const driver = req.body.driver;
    const id =req.params.id;
    bus.findByPk(id).then(bus=>{
      console.log(bus)
      if (!bus) {
        return res.error('the bus is not found' , 404)
      }
      bus.update({
        driverId:driver,

      }).then(()=>{
        return res.success({} , 'updated bus successfully')
      })
    })
  }


exports.deletebus = (req , res)=>{
    const id = req.params.id;
    bus.findByPk(id).then(buss=>{
        if(!buss){
            return res.error('Excuse me.. , this the bus is not exist' , 401)

        }
    bus.update({status:false},{ where: { id: id }}).then(()=>{
        return res.success({} , 'deleted bus successfully')
    }).catch(err=>{
        res.error(err , 500);
    })
})
}


