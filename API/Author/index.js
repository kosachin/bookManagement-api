// Prefix : /author

// Initilising Express Router
const Router = require('express').Router();

// Database Models
const AuthorModel = require('../../database/author')

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       author
Methods         GET
*/
Router.get("/", async (req, res) => {
    const getAllAuthors = await AuthorModel.find();
    return res.json({
        authors: getAllAuthors
    });
});

/*
Route           /author/
Description     get specific authors
Access          PUBLIC  `
Parameter       id
Methods         GET
*/
Router.get('/:id', async (req, res) => {
    const getSpecificAuthorName = await AuthorModel.findOne({
        id: req.params.id
    });

    if (!getSpecificAuthorName) {
        return res.json({
            error: `No Author found for ID of ${req.params.id} `
        })
    };
    return res.json({
        Author: getSpecificAuthorName
    });

});

/*
Route           /author/book
Description     get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
Router.get("/book/:isbn", async (req, res) => {
    const getSpecificAuthor = await AuthorModel.find({
        books: req.params.isbn
    });

    if (!getSpecificAuthor) {
        return res.json({
            error: `No Author found for the book of ${req.params.isbn}`
        });
    }

    return res.json({
        authors: getSpecificAuthor
    });
});

/*
Route           /author/add
Description     add new author
Access          Public
Parameter       NONE
Methods         POST
*/
Router.post("/add", async (req, res) => {
    const {
        newAuthor
    } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({
        message: "author added successfully"
    });
});

/*
Route           /author/update/name/
Description     Update author name
Access          Public
Parameter       id,name
Methods         PUT
*/
Router.put("/update/:id/:name", async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: req.params.id,
        },
        {
            name: req.params.name,
        },
        {
            new: true
        }
    )
    return res.json({
        authors: updatedAuthor
    })
})

/*
Route           /author/delete/
Description     delete an author
Access          Public
Parameter       id
Methods         DELETE
*/
Router.delete("/delete/:authorId", async (req, res) => {
    const updatedAuthor = await AuthorModel.findOneAndDelete(
        {
            id: req.params.authorId
        });
    return res.json({
        authors: updatedAuthor
    })
});

module.exports = Router;