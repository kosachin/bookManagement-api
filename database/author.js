const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
   id:Number,
   name:String,
   books:[String]
});

// Create a book model
const AuthorModel = mongoose.model("authors",AuthorSchema)

// model => document model of mongodb

module.exports = AuthorModel;