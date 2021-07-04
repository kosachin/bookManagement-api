const mongoose = require('mongoose');

const PublicationSchema = mongoose.Schema({
   id:Number,
   name:String,
   books:[String]
});

// Create a book model
const PublicationModel = mongoose.model("publications",PublicationSchema)

// model => document model of mongodb

module.exports = PublicationModel;