// Prefix : /book
// 

// Initialing Express Router
const Router = require("express").Router();

// Database Models
const BookModel = require("../../database/book");
const AuthorModel = require("../../database/author");

/*
Route           /  
Description     Get all books 
Access          Public
Parameter       NONE  
Methods         GET
*/
Router.get('/', async (req, res) => {
    const getAllBooks = await BookModel.find();
    return res.json({
        books: getAllBooks
    });
});

/*
Route           /is/:isbn
Description     Get specific books based on ISBN
Access          Public
Parameter       isbn
Methods         GET
*/
Router.get('/is/:isbn', async (req, res) => {
    const getSpecificBook = await BookModel.findOne({
        ISBN: req.params.isbn
    })
    if (!getSpecificBook) {
        return res.json({
            error: `No book found for ISBN of ${req.params.isbn} `
        })
    };
    return res.json({
        book: getSpecificBook
    });

});

/*
Route           /c/
Description     Get specific books based on category
Access          Public
Parameter       category
Methods         GET
*/
Router.get('/c/:category', async (req, res) => {
    const getSpecificBooks = await BookModel.find({
        category: req.params.category
    })

    if (!getSpecificBooks) {
        return res.json({
            error: `No book found for Category of ${req.params.category} `
        })
    };
    return res.json({
        book: getSpecificBooks
    });

})

/*
Route           /l/ 
Description     Get specific books based on languages
Access          Public
Parameter       language
Methods         GET
*/
Router.get('/l/:language', async (req, res) => {
    const getSpecificBooks = await BookModel.find({
        language: req.params.language
    });


    return res.json({
        books: getSpecificBooks
    });
})

/*
Route           /book/new
Description     add new book
Access          Public
Parameter       NONE
Methods         POST               
*/
Router.post("/add", async (req, res) => {
    const {
        newBooks
    } = req.body;
 
    return res.json({
        message: "book was added successfully",
        
    });
});

/*
Route           /book/update/title/
Description     Update book title
Access          Public
Parameter       isbn
Methods         PUT
*/
Router.put("/update/title/:isbn", async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    }, {
        title: req.body.bookTitle
    }, {
        new: true
    });
    return res.json({
        books: updatedBook
    });
});

/*
Route           /book/update/author/
Description     Update/add new author for a book
Access          Public
Parameter       isbn,authorID
Methods         POST
*/
Router.put("/update/author/:isbn/:authorID", async (req, res) => {
    // update books database
    const updatedBook = await BookModel.findOneAndUpdate({
        ISBN: req.params.isbn
    }, {
        $addToSet: {
            authors: req.params.authorID
        }
    }, {
        new: true
    });

    // update authors database
    const updatedAuthor = await AuthorModel.findOneAndUpdate({
        id: req.params.authorID
    }, {
        $addToSet: {
            books: req.params.isbn
        }
    }, {
        new: true
    });
    return res.json({
        books: updatedBook,
        authors: updatedAuthor,
        message: "New author was added successfully"
    });
});

/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
    const updatedBookDatabase = await BookModel.findOneAndDelete(
        {
            ISBN: req.params.isbn
        }
    );
    return res.json({
        books: updatedBookDatabase
    });
});

/*
Route           /book/delete/author 
Description     delete a author from a book
Access          Public
Parameter       isbn,authorID
Methods         DELETE
*/
Router.delete("/delete/author/:isbn/:authorId",async (req, res) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull:{
                authors: parseInt(req.params.authorId)
            }
        },
        {
            new: true,
        }
    )

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        {
            id: parseInt(req.params.authorId)
        },
        {
            $pull:{
                books: req.params.isbn
            }
        },
        {
            new:true
        }
    )

    return res.json({
        message: "Finally done😪😫",
        books: updatedBook,
        authors: updatedAuthor
    })

})

module.exports = Router;