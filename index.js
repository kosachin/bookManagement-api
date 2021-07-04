require("dotenv").config();

// Frame work
const express = require('express');
const mongoose = require('mongoose')

// Import DB
const database = require('./database/index');

// Initialization
const booky = express();

// Models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

// Configuration
booky.use(express.json());

// Establish database connection
mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

}).then(() => console.log("connection established !!!!!!!!"));

/*
Route           /  
Description     Get all books 
Access          Public
Parameter       NONE  
Methods         GET
*/
booky.get('/', async (req, res) => {
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
booky.get('/is/:isbn', async (req, res) => {
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
booky.get('/c/:category', async (req, res) => {
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
booky.get('/l/:language', (req, res) => {
    const getSpecificBooks = BookModel.find({
        language: req.params.language
    });

    if (!getSpecificBook) {
        return res.json({
            error: `No book found for Language of ${req.params.language}`
        })
    }
    return res.json({
        books: getSpecificBooks
    });
})

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       author
Methods         GET
*/
booky.get("/author", async (req, res) => {
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
booky.get('/author/:id', async (req, res) => {
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
booky.get("/author/book/:isbn", async (req, res) => {
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
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/publications", async (req, res) => {
    const getAllPublication = await PublicationModel.find();
    return res.json({
        publications: getAllPublication
    });
});

/*
Route           /publications
Description     get specific publications
Access          PUBLIC
Parameter       id
Methods         GET
*/

booky.get('/publications/:id', async (req, res) => {
    const getSpecificPublicationName = await PublicationModel.findOne({
        id: req.params.id
    })

    if (!getSpecificPublicationName) {
        return res.json({
            error: `No Publication found for ID of ${req.params.id} `
        })
    };
    return res.json({
        Publication: getSpecificPublicationName
    });

});

/*
Route           /author/book
Description     get all publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/publications/book/:isbn", async (req, res) => {
    const getSpecificPublicationBookName = await PublicationModel.findOne({
        books: req.params.isbn
    });

    if (!getSpecificPublicationBookName) {
        return res.json({
            error: `No Publications found for the book of ${req.params.isbn}`
        });
    }

    return res.json({
        publications_book: getSpecificPublicationBookName
    });
});

/*
Route           /book/new
Description     add new book
Access          Public
Parameter       NONE
Methods         POST               
*/
booky.post("/book/add", async (req, res) => {
    const {
        newBook
    } = req.body;

    BookModel.create(newBook);

    return res.json({
        message: "book was added successfully"
    });
});

/*
Route           /author/add
Description     add new author
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", async (req, res) => {
    const {
        newAuthor
    } = req.body;
    AuthorModel.create(newAuthor);
    return res.json({
        message: "author added successfully"
    });
});

/*
Route           /publication/add
Description     add new publication
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/publication/add", async (req, res) => {
    const {
        newPublication
    } = req.body;
    PublicationModel.create(newPublication);
    return res.json({
        messgae: "publication added successfully"
    });
});

/*
Route           /book/update/title/
Description     Update book title
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", async (req, res) => {
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
booky.put("/book/update/author/:isbn/:authorID", async (req, res) => {
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
Route           /author/update/name/
Description     Update author name
Access          Public
Parameter       id,name
Methods         PUT
*/
booky.put("/author/update/:id/:name", (req, res) => {
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.id)) {
            author.name = req.params.name;
            return
        };
    })
    return res.json({
        authors: database.authors
    })
})

/*
Route           /publication/update/name
Description     Update publication name
Access          Public
Parameter       id
Methods         PUT
*/
booky.put("/publication/update/name/:id", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.id)) {
            publication.name = req.body.pubName;
            return
        };
    });
    return res.json({
        publications: database.publications
    })
})


/*
Route           /publication/update/book
Description     Update publications
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/publication/update/book/:isbn", (req, res) => {
    // update the publication database
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.body.pubID)) {
            return publication.books.push(req.params.isbn);
        }
    });
    // update the books database
    database.books.forEach((book) => {
        if (book.ISBN === (req.body.isbn)) {
            book.publications = req.body.pubID;
            return;
        }
    })
    return res.json({
        booKs: database.books,
        publications: database.publications,
        message: "Succesfully updated publication"
    });
})

/*
Route           /book/delete
Description     delete a book
Access          Public
Parameter       isbn
Methods         DELETE
*/
booky.delete("/book/delete/:isbn", async (req, res) => {


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
booky.delete("/book/delete/author/:isbn/:authorId",async (req, res) => {
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

/*
Route           /author/delete/
Description     delete a author from a book
Access          Public
Parameter       id
Methods         DELETE
*/
booky.delete("/author/delete/:authorId", (req, res) => {
    const updatedAuthorList = database.authors.filter((author) =>
        author.id !== parseInt(req.params.authorId)
    );
    database.authors = updatedAuthorList
    return res.json({
        authors: database.authors
    })
});

/*
Route           /book/delete/publication
Description     delete a publication from book
Access          Public
Parameter       pubId
Methods         DELETE
*/
booky.delete("/publication/delete/book/:isbn/:pubId", (req, res) => {
    database.publications.forEach((publication) => {
        if (publication.id === parseInt(req.params.pubId)) {
            const newPublicationBookList = publication.books.filter((book) => book !== req.params.isbn);
            publication.books = newPublicationBookList;
            return;
        };
    });

    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newPublicationList = book.publications.filter((publication) => publication !== parseInt(req.params.pubId));
            book.publications = newPublicationList;
            return;
        };
    });

    return res.json({
        books: database.books,
        publications: database.publications
    })
})


/*
Route           /publication/delete/
Description     delete a publication
Access          Public
Parameter       id
Methods         DELETE
*/
booky.delete("/publication/delete/:pubId", (req, res) => {
    const updatePublicationList = database.publications.filter((publication) =>
        publication.id !== parseInt(req.params.pubId)
    );
    database.publications = updatePublicationList
    return res.json({
        publications: database.publications
    })
});


// Where to listen
booky.listen(313, () =>
    console.log('Hey, you are running server on port 313 !!!'));

// browser can perform only get method,otherwise we need http client thta is postman