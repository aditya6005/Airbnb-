const mongoose = require("mongoose");
const Listing = require("./models/listing"); // Path to your schema
require("dotenv").config();

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const mapToken = process.env.MAP_TOKEN;

async function migrate() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("✅ Connected to MongoDB");

        // Find all listings where geometry is missing OR coordinates are empty
        const listings = await Listing.find({
            $or: [
                { geometry: { $exists: false } },
                { "geometry.coordinates": { $size: 0 } },
                { "geometry.coordinates": [77.209, 28.613] } // Target the "Delhi" defaults we want to fix
            ]
        });

        console.log(`🔍 Found ${listings.length} listings to automate...`);

        for (let listing of listings) {
            console.log(`🌍 Geocoding: ${listing.location}`);

            // Call MapTiler API
            const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(listing.location)}.json?key=${mapToken}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data.features && data.features.length > 0) {
                // Save the real GeoJSON geometry
                listing.geometry = data.features[0].geometry; 
                await listing.save();
                console.log(`✨ Successfully mapped: ${listing.title}`);
            } else {
                console.log(`⚠️ No coordinates found for: ${listing.location}`);
            }
        }

        console.log("🏁 All existing listings are now mapped!");
    } catch (err) {
        console.error("❌ Migration error:", err);
    } finally {
        mongoose.connection.close();
    }
}

migrate();