const Listing = require("../models/listing");
const Review = require("../models/review"); // Changed 'review' to 'Review'

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    
    // Use 'Review' with a capital R here
    let newReview = new Review(req.body.review); 
    
    newReview.author = req.user._id;
    console.log(newReview);
    
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    req.flash("success", "New Review created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    
    // Use 'Review' with a capital R here as well
    await Review.findByIdAndDelete(reviewId); 
    
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`);
};



// const Listing=require("../models/listing");
// const Review = require("../models/review");



// module.exports.createReview=async(req,res)=>{
//     let listing = await Listing.findById(req.params.id);
//     let newReview = new Review(req.body.review);
//     newReview.author= req.user._id;
//     console.log(newReview);
//     listing.reviews.push(newReview);
//     await newReview.save();
//     await listing.save();
//     req.flash("success", "New Review created");
//     res.redirect(`/listings/${listing._id}`);
// }

// module.exports.destroyReview= async (req,res)=>{
//     let{id,reviewId}= req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await review.findByIdAndDelete(reviewId);
//     req.flash("success", " Review deleted");
//     res.redirect(`/listings/${id}`);
// };
