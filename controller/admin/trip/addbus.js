
const bus = require('../../../models/bus');
const typebus = require('../../../models/typebus');



exports.getbuses = (req , res)=>{
    const companiesId = req.companies.companiesId;
    bus.findAll({where:{companyId:companiesId}, atttibutes:["id","number"]} ).then(buses=>{
        const busNumbers = buses.map((bus) =>{
            return{
                id:bus.id,
                number:bus.number,
                numofdisk:bus.numofdisk

            }
        }
            );

         res.success(busNumbers , 'this is all buses')
    }).catch(err=>{
        res.error(err , 500);
    })
}


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
      const driver = req.body.driver;
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
        companyId: companiesId
      });
  
      return res.success({},'Successfully added bus');
    } catch (err) {
      return res.error(err);
    }
  };



exports.deletebus = (req , res)=>{
    const id = req.params.id;
    bus.findByPk(id).then(buss=>{
        if(!buss){
            return res.error('Excuse me.. , this the bus is not exist' , 401)

        }
    bus.destroy({where:{id:id}}).then(()=>{
        return res.success({} , 'deleted bus successfully')
    }).catch(err=>{
        res.error(err , 500);
    })
})
}


