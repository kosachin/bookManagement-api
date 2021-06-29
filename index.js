const express = require('express');

// Import DB
const database = require('./database');

// Initialization
const booky = express();

// Configuration
booky.use(express.json());

/*
Route           /  
Description     Get all books
Access          Public
Parameter       NONE
Methods         GET
*/
booky.get('/', (req, res) => {
    return res.json({
        books: database.books
    });
});

/*
Route           /is/:isbn
Description     Get specific books based on ISBN
Access          Public
Parameter       isbn
Methods         GET
*/
booky.get('/is/:isbn', (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.ISBN == req.params.isbn);

    if (getSpecificBook.length === 0) {
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
booky.get('/c/:category', (req, res) => {
    const getSpecificBook = database.books.filter((book) => book.category.includes(req.params.category));

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for Category of ${req.params.category} `
        })
    };
    return res.json({
        book: getSpecificBook
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
    const getSpecificBook = database.books.filter((book) => book.language.includes(req.params.language));

    if (getSpecificBook.length === 0) {
        return res.json({
            error: `No book found for Language of ${req.params.language}`
        })
    }
    return res.json({
        book: getSpecificBook
    });
})

/*
Route           /author
Description     get all authors
Access          PUBLIC
Parameter       author
Methods         GET
*/
booky.get("/author", (req, res) => {
    return res.json({
        authors: database.authors
    });
});

/*
Route           /author/
Description     get specific authors
Access          PUBLIC  `
Parameter       id
Methods         GET
*/
booky.get('/author/:id', (req, res) => {
    const getSpecificAuthorName = database.authors.filter((book) => book.id === parseInt(req.params.id));

    if (getSpecificAuthorName.length === 0) {
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
booky.get("/author/book/:isbn", (req, res) => {
    const getSpecificAuthor = database.authors.filter((author) =>
        author.books.includes(req.params.isbn)
    );

    if (getSpecificAuthor.length === 0) {
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
booky.get("/publications", (req, res) => {
    return res.json({
        publications: database.publications
    });
});

/*
Route           /publications
Description     get specific publications
Access          PUBLIC
Parameter       id
Methods         GET
*/

booky.get('/publications/:id', (req, res) => {
    const getSpecificPublicationName = database.publications.filter((publication) => publication.id === parseInt(req.params.id));

    if (getSpecificPublicationName.length === 0) {
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
booky.get("/publications/book/:isbn", (req, res) => {
    const getSpecificPublicationBookName = database.publications.filter((author) =>
        author.books.includes(req.params.isbn)
    );

    if (getSpecificPublicationBookName.length === 0) {
        return res.json({
            error: `No Publications found for the book of ${req.params.isbn}`
        });
    }

    return res.json({
        authors: getSpecificPublicationBookName
    });
});

/*
Route           /book/new
Description     add new book
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/book/add", (req, res) => {
    const {
        newBook
    } = req.body;
    database.books.push(newBook);
    return res.json({
        books: database.books
    });
});

/*
Route           /author/add
Description     add new author
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/author/add", (req, res) => {
    const {
        newAuthor
    } = req.body;
    database.authors.push(newAuthor);
    return res.json({
        Authors: database.authors
    });
});

/*
Route           /publication/add
Description     add new publication
Access          Public
Parameter       NONE
Methods         POST
*/
booky.post("/publication/add", (req, res) => {
    const {
        newPublication
    } = req.body;
    database.publications.push(newPublication);
    return res.json({
        publications: database.publications
    });
});

/*
Route           /book/update/title/
Description     Update book title
Access          Public
Parameter       isbn
Methods         PUT
*/
booky.put("/book/update/title/:isbn", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            book.title = req.body.newBookTitle;
            return;

        }
    })
    return res.json({
        books: database.books
    });
});

/*
Route           /book/update/author/
Description     Update/add new author for a book
Access          Public
Parameter       isbn,authorID
Methods         POST
*/
booky.put("/book/update/author/:isbn/:authorID", (req, res) => {
    // update books database
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            return book.author.push(parseInt(req.params.authorID));
        };
    });

    // update authors database
    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorID)) {
            return author.books.push(req.params.isbn);
        };
    })
    return res.json({
        books: database.books,
        authors: database.authors
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
booky.delete("/book/delete/:isbn", (req, res) => {
    const updatedBookDatabase = database.books.filter((book) =>
        book.ISBN !== req.params.isbn
    );
    database.books = updatedBookDatabase;
    return res.json({
        books: database.books
    });
});

/*
Route           /book/delete/author
Description     delete a author from a book
Access          Public
Parameter       isbn,authorID
Methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req, res) => {
    database.books.forEach((book) => {
        if (book.ISBN === req.params.isbn) {
            const newAuthorList = book.authors.filter((author) => author !== parseInt(req.params.authorId));
            book.authors = newAuthorList;
            return;
        };
    })

    database.authors.forEach((author) => {
        if (author.id === parseInt(req.params.authorId)) {
            const newBookList = author.books.filter((book) =>
                book !== req.params.isbn);
            author.books = newBookList;
            return
        }
    })
    return res.json({
        message: "Finally done😪😫",
        books: database.books,
        authors: database.authors
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
        if(publication.id === parseInt(req.params.pubId)) {
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