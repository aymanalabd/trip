
//models
 
const rating = require('../../../models/rating'); 
const isBlock = require('../../../models/isBlock'); 



  



exports.rating = (req, res, next) => {
  const customerId = req.custumer.id;
  const tripId = req.params.id;
  const ratingValue = req.body.rating;
  console.log(customerId)

  rating.findOne({
    where: {
      custumerId: customerId,
      tripId: tripId
    }
  })
    .then(existingRating => {
      if (existingRating) {
        existingRating.rating = ratingValue;
        return existingRating.save();
      } else {
        return rating.create({
          custumerId: customerId,
          tripId: tripId,
          rating: ratingValue
        });
      }
    })
    .then(() => {
      res.success({}, 'Rating updated successfully');
    })
    .catch(error => {
      // التعامل مع الخطأ
      next(error);
    });
};
exports.getblock = (req , res , next)=>{
 
}




