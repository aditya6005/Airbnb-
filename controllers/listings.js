// const Listing= require("../models/listing");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');


// module.exports.index= async (req,res)=>{
// const allListings =await  Listing.find({});
// res.render("../views/listings/index.ejs",{allListings});
// };


// module.exports.renderNewForm = (req,res)=>{
// res.render("listings/new.ejs")
// };


// module.exports.showListing= async (req, res)=>{
//     let {id} =req.params;
//     const listing= await Listing.findById(id)
//     .populate({
//         path:"reviews",
//         populate:{
//             path:"author",
//         },
//     }).populate("owner");
//     if(!listing){
//         req.flash("error", "Listing you requested for does not exist !");
//         res.redirect("/listings");
//     }
//     res.render("../views/listings/show.ejs", {listing});
// }



// // Wrap in a function to avoid top-level await errors
// const getCoordinates = async (location) => {
//     const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`;
//     const response = await fetch(url);
//     const data = await response.json();
    
//     if (data.features && data.features.length > 0) {
//         return data.features[0].geometry; // Returns {type: 'Point', coordinates: [lng, lat]}
//     }
//     return { type: 'Point', coordinates: [77.209, 28.613] }; // Default fallback
// };

// module.exports.createListing = async (req, res, next) => {
//     // Call the helper function inside your existing async route
//     const geometry = await getCoordinates(req.body.listing.location);

//     let url = req.file.path;
//     let filename = req.file.filename;

//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//     newListing.image = { url, filename };
//     newListing.geometry = geometry; // Save the GeoJSON object to MongoDB

//     await newListing.save();
//     req.flash("success", "New Listing Created!");
//     res.redirect("/listings");
// };


// // module.exports.createListing=async (req,res,next) =>{
// //     let response =await geocodingClient.forwardGeocode({
// //         // const query = "New Delhi, India";
// //         limit: 1,
// //     }).send()
// //     console.log(response.body);
    

// //     let url = req.file.path;
// //     let filename=req.file.filename;

// //     const newListing = new Listing(req.body.listing);
// //         newListing.owner = req.user._id;
// //         newListing.image={url,filename};
// //         newListing.geometry=response.body.feature[0].geometry;

// //         let savedListing = await newListing.save();

// //     req.flash("success", "New Listing Created");
// //     res.redirect("/listings");
// // };



// module.exports.renderEditForm = async (req,res)=>{
//     let {id} = req.params;
//     const listing= await Listing.findById(id);
//     if(!listing){
//         req.flash("error", "Listing you requested for does not exist !");
//         res.redirect("/listings");
//     }
//     let originalImageUrl =listing.image.url;
//     originalImageUrl=originalImageUrl.replace("/upload", "/upload/h_250,w_250");
    
//     res.render("listings/edit.ejs", {listing,originalImageUrl});
// };

// // module.exports.updateListing =async (req,res)=>{

// //     let {id}= req.params;
// //     let listing =await  Listing.findByIdAndUpdate(id, {...req.body.listing});
// //     if(typeof req.file !=="undefined"){
// //         let url = req.file.path;
// //         let filename=req.file.filename;
// //         listing.image={url,filename};
// //         await listing.save();
// //     }
    
// //     req.flash("success", "Listing Updated !");
// //     res.redirect(`/listings/${id}`);
// // };

// // Update this block at the very bottom of your controllers/listings.js file
// module.exports.index = async (req, res) => {
//     let { search } = req.query;
//     let allListings;

//     if (search) {
//         allListings = await Listing.find({
//             $or: [
//                 { title: { $regex: search, $options: "i" } },
//                 { location: { $regex: search, $options: "i" } },
//                 { country: { $regex: search, $options: "i" } },
//             ]
//         });
//     } else {
//         allListings = await Listing.find({});
//     }
    
//     // ADD THE MAP TOKEN HERE IN THE RENDER OBJECT:
//     res.render("listings/index.ejs", { allListings, mapToken: process.env.MAP_TOKEN });
// };
// module.exports.destroyListing =async (req,res) =>{
//     let {id} =req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", "Listing deleted");

//     res.redirect("/listings");
// };

// //-------------------------------------------------------------------
// // Modify your index function in controllers/listings.js
// module.exports.index = async (req, res) => {
//     let { search } = req.query;
//     let allListings;

//     if (search) {
//         // This searches for the string in title, location, or country (case-insensitive)
//         allListings = await Listing.find({
//             $or: [
//                 { title: { $regex: search, $options: "i" } },
//                 { location: { $regex: search, $options: "i" } },
//                 { country: { $regex: search, $options: "i" } },
//             ]
//         });
//     } else {
//         allListings = await Listing.find({});
//     }
//     res.render("listings/index.ejs", { allListings });
// };

const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');

// 1. ALL LISTINGS & SEARCH FILTER
module.exports.index = async (req, res) => {
    let { search } = req.query;
    let allListings;

    if (search) {
        // This searches for the string in title, location, or country (case-insensitive)
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } },
            ]
        });
    } else {
        allListings = await Listing.find({});
    }
    // Correctly passing mapToken to index view if needed
    res.render("listings/index.ejs", { allListings, mapToken: process.env.MAP_TOKEN });
};

// 2. RENDER NEW FORM
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// 3. SHOW SINGLE LISTING
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
        
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    
    // FIX: Explicitly passing the token to show.ejs view
    res.render("../views/listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
};

// MapTiler Helper function using process.env directly
const getCoordinates = async (location) => {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${process.env.MAP_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
        return data.features[0].geometry; 
    }
    return { type: 'Point', coordinates: [77.209, 28.613] }; // Default fallback
};

// 4. CREATE NEW LISTING
module.exports.createListing = async (req, res, next) => {
    try {
        const geometry = await getCoordinates(req.body.listing.location);

        let url = req.file.path;
        let filename = req.file.filename;

        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = geometry; 

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
};

// 5. RENDER EDIT FORM
module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist !");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
    
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

// 6. UPDATE EXISTING LISTING (UNCOMMENTED & ACTIVATED)
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }
    
    req.flash("success", "Listing Updated !");
    res.redirect(`/listings/${id}`);
};

// 7. DESTROY LISTING
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted");
    res.redirect("/listings");
};