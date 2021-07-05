require("dotenv").config();

// Frame work
const express = require('express');
const mongoose = require('mongoose')

// Initialization
const booky = express();


// Microservices Routes
const Books = require("./API/Book");
const Authors = require("./API/Author");
const Publications = require("./API/Publication");

// Configuration 
booky.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,                      
    useCreateIndex: true

}).then(() => console.log("connection established !!!!!!!!"));

// Initialing Microservices
booky.use("/book", Books);
booky.use("/author", Authors)
booky.use("/publication", Publications)

// Where to listen
booky.listen(313, () =>
    console.log('Hey, you are running server on port 313 !!!'));

// browser can perform only get method,otherwise we need http client thta is postman