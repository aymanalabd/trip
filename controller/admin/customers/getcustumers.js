const companies = require('../../../models/companies');
const moment = require('moment')
const util = require('../../../util/helper');
const { Op } = require('sequelize');  
const isBlock = require('../../../models/isBlock');

const trip = require('../../../models/trip'); 
const disk = require('../../../models/disk'); 
const  sequelize = require('sequelize');
const duration = require('../../../models/duration');
const custumer = require('../../../models/custumer');
const customerisnotpaid = require('../../../models/customersIsNotPaid');
const custumerbyadmin = require('../../../models/custumerbyadmin');


const { required, number } = require('joi');

exports.addc = (req, res )=>{
  customerisnotpaid.create({
    companyId:1,
    name:"ahmad"
  })
}

  exports.getcustumers = async(req, res) => {
    const id = req.params.id;

    const tripid = await trip.findByPk(id);
    const price = tripid.price;
    custumer.findAll({
      attributes: ["id", "fullname"],
      include: [
        {
          model: disk,
          attributes: ["id", "numberdisk"],
          where: { status: false, ispaid: false, tripId: id }
        }
      ]
    })
     
          .then(customers => {
            if (customers.length === 0) {
              return res.error('No customers found who have not paid for this trip', 404);
            }
  
            const formattedCustomers = customers.map(customer => {
              
              if (customer.disks && customer.disks.length > 0) {
                const assignedDisks = customer.disks.map(disk =>
                  disk.numberdisk
                );
  
                return {
                  id: customer.id,
                  fullName: customer.fullname,
                  numberdisk: assignedDisks,
                  totalprice:customer.disks.length * price

                };
              } else {
                return {
                  name: customer.fullname,
                  seat: "Not Assigned"
                };
              }
            });
  
            res.success(formattedCustomers, 'These are all customers who have not paid for this trip'); // Send the formatted customer data in JSON format
          })
          .catch(error => {
            console.error(error); // Log any errors for debugging
            res.error(error);
          
      })
     
      
  };

  exports.getcustumersbynumberdisk = async(req, res) => {
    const id = req.params.id;
    const seatNumber = req.body.numberdisk;
    const tripid = await trip.findByPk(id);
    const price = tripid.price;


    custumer.findAll({
      attributes: ["id", "fullname"],
      include: [
        {
          model: disk,
          attributes: ["id", "numberdisk"],
          where: { status: false, ispaid: false, tripId: id },
        },
      ],
    })
     
          .then(customers => {
            const allCustomers = customers;
            
            if (allCustomers.length === 0) {
              return res.error('No customers found who have not paid for this trip', 404);
            }
  
            const matchingCustomers = allCustomers.filter(customer =>

              customer.disks && customer.disks.length > 0 && customer.disks.some(disk => disk.numberdisk === seatNumber)
            );

  
            if (matchingCustomers.length === 0) {
              return res.error('No customer found with that seat number in this trip', 404);
            }
  
            const formattedCustomers = matchingCustomers.map(customer => ({
              id: customer.id,
              fullName: customer.fullname,
              numberdisk: customer.disks.map(disk => disk.numberdisk),
              totalprice:customer.disks.length * price
            }));
  
            res.success(formattedCustomers, 'Customer and all their reserved seats');
          })
          .catch(error => {
            console.error(error);
            res.status(500).send('Error retrieving customer data');
          });
      
     
  };

  exports.getcustumersisblock = (req, res) => {
    const companiesId = req.companies.companiesId;
  
    isBlock
      .findAll({ where: { companyId: companiesId, isblock: false } })
      .then((custumers) => {
        const promises = custumers.map((customer) => {
          return custumer.findOne({ where: { id: customer.custumerId } })
            .then((c) => {
              return {
                id: c.id,
                fullName: c.fullname,
              };
            });
        });
  
        Promise.all(promises)
          .then((customersisblock) => {
            return res.success(customersisblock, 'These are all blocked customers');
          })
          .catch((err) => {
            return res.error(err.message,500);
          });
      })
      .catch((err) => {
        return res.error(err.message);
      });
  };

 
  exports.getcustumersisnotpaid = async (req, res) => {
    const companiesId = req.companies.companiesId;
  
    try {
      const customersNotPaid = await customerisnotpaid.findAll({
        where: { companyId: companiesId },
      });
  
      if (customersNotPaid.length === 0) {
        return res.error('No customers found who have not paid in this company', 404);
      }
  
      const customerData = [];
  
      for (const customerNotPaid of customersNotPaid) {
        const customerId = customerNotPaid.custumerId;
        let customerIndex = null;
  
        for (let i = 0; i < customerData.length; i++) {
          if (customerData[i].id === customerId) {
            customerIndex = i;
            break;
          }
        }
  
        if (customerIndex === null) {
          const customer = await custumer.findOne({ where: { id: customerId } });
  
          if (customer) {
            customerData.push({
              id: customer.id,
              fullname: customer.fullname,
              trips: [],
            });
            customerIndex = customerData.length - 1;
          }
        }
  
        const tripDate = customerNotPaid.tripDate;
        const numberbus = customerNotPaid.numberbus;
  
        if (customerIndex !== null) {
          customerData[customerIndex].trips.push({
            tripDate,
            numberbus,
          });
        }
      }
  
      return res.success(customerData, 'These are all customers who have not paid');
    } catch (error) {
      return res.error(error.message, 500);
    }
  };

exports.getcustumersispaid = async (req, res) => {
  try {
    const id = req.params.id;
    const trips = await trip.findByPk(id);
    const price = trips.price;



    const customers = await custumer.findAll({
      attributes: ["id", "fullname"],
      include: [
        {
          model: disk,
          attributes: ["id", "numberdisk"],
          where: { status: false, ispaid: true, tripId: id }
        }
      ]
    });

    const customersByAdmin = await custumerbyadmin.findAll({
      attributes: ["id", "fullname"],
      include: [
        {
          model: disk,
          attributes: ["id", "numberdisk"],
          where: { status: false, ispaid: true, tripId: id }
        }
      ]
    });


    if (customers.length === 0 && customersByAdmin.length === 0) {
      return res.status(404).json({ error: 'No customers found who have paid for this trip' });
    }

    const formattedCustomers = customers.map(customer => {
      if (customer.disks && customer.disks.length > 0) {
        const assignedDisks = customer.disks.map(disk => disk.numberdisk);
        return {
          id: customer.id,
          fullName: customer.fullname,
          numberdisk: assignedDisks,
          totalprice: customer.disks.length * price
        };
      } else {
        return {
          id: customer.id,
          fullName: customer.fullname,
          numberdisk: "Not Assigned",
          totalprice: 0
        };
      }
    });

    const formattedCustomersByAdmin = customersByAdmin.map(customer => {
      if (customer.disks && customer.disks.length > 0) {
        const assignedDisks = customer.disks.map(disk => disk.numberdisk);
        return {
          id: customer.id,
          fullName: customer.fullname,
          numberdisk: assignedDisks,
          totalprice: customer.disks.length * price
        };
      } else {
        return {
          id: customer.id,
          fullName: customer.fullname,
          numberdisk: "Not Assigned",
          totalprice: 0
        };
      }
    });

    const allCustomers = [...formattedCustomers, ...formattedCustomersByAdmin];

    res.success(allCustomers, 'These are all customers who have paid for this trip' );
  } catch (error) {
    res.error(error , 500); // Log any errors for debugging
  }
};