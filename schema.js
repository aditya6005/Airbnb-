const Joi = require("joi");
module.exports.listingSchema= Joi.object({
    listing: Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        location: Joi.string().required(),
        country:Joi.string().required(),
        price:Joi.string().required().min(0),
        image:Joi.string().allow("",null)

    }).required()

});

// module.exports.reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required().min(1).max(5),
//         comment : Joi.string().required(),
// }).required()

// });

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        // Adding .required() ensures it's there,
        // and Joi will attempt to cast the string "3" to the number 3.
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});
