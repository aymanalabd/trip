
const bcrypt = require('bcryptjs');
const bus = require('../../../models/bus');

const driver = require('../../../models/driver');
const companies = require('../../../models/companies');


exports.adddrivers = (req, res) => {
  const companiesId = req.companies.companiesId;
  const { fullname, email, password, confirmpassword, phone } = req.body;

  if (password !== confirmpassword) {
    return res.error("Passwords do not match" , 402);
  }

  const hashpassword = bcrypt.hashSync(password, 10);
  const hashconfirmpassword = bcrypt.hashSync(confirmpassword, 10);

  driver.findOne({ where: { email: email } })
    .then((drivers) => {
      if (drivers) {
        return res.error("Exuse me, this driver already exists", 402);
      }

      driver
        .create({
          fullname: fullname,
          phone: phone,
          email: email,
          password: hashpassword,
          confirmpassword: hashconfirmpassword,
          companyId: companiesId,
        })
        .then(() => {
          return res.success({}, "Successfully added a driver");
        })
        .catch((err) => {
          return res.error(err.message , 500);
        });
    })
    .catch((err) => {
      return res.error(err.message , 500);
    });
};

  exports.deletedriver = (req , res)=>{
    const id = req.params.id;
    driver.findByPk(id).then(driver=>{
        if(!driver){
            return res.error('Excuse me.. , this the driver is not exist' , 404)

        }
    driver.destroy({where:{id:id}}).then(()=>{
        return res.success({} , 'deleted driver successfully')
    }).catch(err=>{
        res.error(err , 500);
    })
})
}

exports.getalldrivers = (req,res)=>{
    const companiesId = req.companies.companiesId;

    driver.findAll({where:{companyId:companiesId}}).then(driver=>{
    const d= driver.map(driver=>{
            return{
                id:driver.id,
                name:driver.fullname,
                phone:driver.phone
            }
        })
        return res.success(d,'this is all drivers in this company')
    }).catch((err) => {
        return res.error(err.message, 500);
      });
}


exports.getdriverisavailable = (req, res) => {
    const companiesId = req.companies.companiesId;
    driver.findAll().then((drivers) => {
      bus.findAll({ where: { companyId: companiesId } })
        .then((buses) => {
          const availableDrivers = drivers.filter((driver) => {
            const hasBus = buses.some((bus) => bus.driverId === driver.id);
            return !hasBus;
          });
  
          const driverNames = availableDrivers.map((driver) => {
            return {
              id: driver.id,
              name: driver.fullname,
              phone:driver.phone

            };
          });
  
          return res.success(driverNames, "Available drivers retrieved successfully");
        })
        .catch((err) => {
          return res.error(err.message, 500);
        });
    }).catch((err) => {
      return res.error(err.message, 500);
    });
  };


