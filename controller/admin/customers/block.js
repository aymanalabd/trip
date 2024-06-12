
const isBlock = require('../../../models/isBlock');
const companies = require('../../../models/companies');
const { Op } = require('sequelize');
const {admin}= require('../../notification/index')

const customerisnotpaid = require('../../../models/customersIsNotPaid');
const custumer = require('../../../models/custumer');


exports.block = (req, res) => {
  const id = req.params.id;
  const companiesId = req.companies.companiesId;

  customerisnotpaid.destroy({
    where: {
      custumerId: id,
      companyId: companiesId
    }
  });

  isBlock.findOne({ where: { custumerId: id, companyId: companiesId } }).then(user => {
    if (user && user.isblock === false) {
      return res.error('This user is already blocked', 403);
    } else if (user && user.isblock === true) {
      isBlock.update(
        { isblock: false },
        {
          where: {
            custumerId: id,
            companyId: companiesId
          }
        }
      )
        .then(() => {
          custumer.findByPk(id).then(user => {

            const fcmToken = user.fcmToken;
            companies.findByPk(companiesId).then(company=>{
                const message = {
                    token: fcmToken,
                    notification: {
                      title: 'Blocked',
                      body: `${company.name} Company has blocked you.`
                    }
                  };
      
                  return admin.messaging().send(message);
            })

           
          });

          return res.success({}, 'Successfully blocked this user.');
        })
        .catch(err => {
          res.error(err, 500);
        });
    } else {
      isBlock.create({
        companyId: companiesId,
        custumerId: id,
        isblock: false
      })
        .then(() => {
          return res.success({}, 'Successfully blocked this user.');
        })
        .catch(err => {
          res.error(err, 500);
        });
    }
  });
};


exports.cancleblock = (req, res) => {
  const id = req.params.id;
  const companiesId = req.companies.companiesId;

  isBlock.findOne({ where: { custumerId: id, companyId: companiesId } }).then(user => {
    if (!user || user.isblock === true) {
      return res.error('This user is not blocked', 403);
    }

    isBlock.update(
      { isblock: true },
      {
        where: {
          custumerId: id,
          companyId: companiesId
        }
      }
    )
      .then(() => {
        custumer.findByPk(id).then(user => {
          const fcmToken = user.fcmToken;
          companies.findByPk(companiesId).then(company => {
            const message = {
              token: fcmToken,
              notification: {
                title: 'Cancelled Block',
                body: `${company.name} Company has unblocked you.`
              }
            };

            return admin.messaging().send(message);
          });
        });

        return res.success({}, 'Successfully unblocked this user.');
      })
      .catch(err => {
        res.error(err, 500);
      });
  });
};

exports.disableCompanies = (req, res) => {
    isBlock
      .findAll({ where: { custumerId: req.custumer.id, isblock: false } })
      .then((isBlocks) => {
        const companyIds = isBlocks.map((isBlock) => isBlock.companyId);
        console.log(companyIds)
        companies
          .findAll({where:{id: {[Op.notIn]: companyIds}}})
          .then((foundCompanies) => {
            return res.success(foundCompanies);
          })
          .catch((err) => {
            return res.error(err.message, 500);
          });
      })
      .catch((err) => {
        return res.error(err.message, 500);
      });
  };
