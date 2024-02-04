const { listingSchema, reviewSchema } = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const ExpressError =require("../utils/ExpressError.js");

module.exports.createReview=async (req,res)=>{
  
    let listing =await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    // console.log(listing);

    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
  
    // console.log("new review saved");
    // res.send("new review saved");
    req.flash('success','Your review has been added!');
    res.redirect  (`/listings/${listing._id}`);
  
};


module.exports.destroyReview=async (req, res) =>{
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review has been removed')
    res.redirect(`/listings/${id}`);
 };