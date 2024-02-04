const Listing=require("../models/listing");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm=(req, res) => {
    // console.log(req.user);
    res.render("listings/new.ejs");
};

module.exports.showListing=async (req, res,next) => {
    
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({ path:"reviews",populate:{path:"author"}})
    .populate("owner");

    if(!listing){
      req.flash("error","Listing you requested for doesn't exist");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
 
};

module.exports.createListing=async (req,res,next) => {
    
    try{
  
      // let {title, description, image, price, country, location}  = req.body;
  
      // if(!req.body.listing){
      //   throw new ExpressError(400,"Send valid data for listing");
      // }

      let response= await geocodingClient.forwardGeocode({
        query: `${req.body.listing.location},${req.body.listing.country}`,
        limit: 1
      })
      .send();
      // console.log(response.body.features[0].geometry);
      // res.send("done !");
        
  
      let result=listingSchema.validate(req.body);
      // console.log(result);
      if(result.error){
        throw new ExpressError(400,result.error);
      }

      let url=req.file.path;
      let filename=req.file.filename;
      // console.log(url,"..",filename);
      const newListing = new Listing(req.body.listing);
      // console.log(req.user);
      newListing.owner=req.user._id;
      newListing.image={url,filename};
      newListing.geometry=response.body.features[0].geometry;
      // if(!newListing.description){
      //   console.log(newListing);
      //   throw new ExpressError(400,"description missing");
      // }  
  
      // if(!newListing.title){
      //   throw new ExpressError(400,"title missing");
      // }
  
      // if(!newListing.country){
      //   throw new ExpressError(400,"country missing");
      // }
  
      let savedListing= await newListing.save();
      console.log(savedListing);
      req.flash("success","New Listing Created Successfully!");
      res.redirect("/listings");
  
    }catch(err){
  
      next(err);
  
    }
  
  }; 

  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing){
      req. flash("error", "Listing you requested for does not exist!");
      res. redirect("/listings");
    }

    let originalImageUrl= listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };


  module.exports.updateListing=async (req, res) => {
  
    // if(!req.body.listing){
    //   throw new ExpressError(400,"Send valid data for listing");
    // }
  
    let { id } = req.params;
    let listing= await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    if(typeof req.file !== "undefined"){
      let url=req.file.path;
      let filename=req.file.filename;
      listing.image={url,filename};
      await listing.save();
    }
    
    req.flash("success","Listing Updated Successfully!");
    res.redirect(`/listings/${id}`);
  };


  module.exports.destroyListing=async(req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted successfully !")
    res.redirect("/listings");
  };