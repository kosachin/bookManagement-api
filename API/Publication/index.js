// Prefix : /publication
// 

// Initialing Express Router
const Router = require('express').Router();

// Database Model
const PublicationModel = require('../../database/publication')
const BookModel = require('../../database/book')

/*
Route           /publications
Description     get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
Router.get("/", async (req, res) => {
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

Router.get('/:id', async (req, res) => {
    const getSpecificPublicationName = await PublicationModel.findOne({
        id: req.params.id
    })
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
Router.get("/book/:isbn", async (req, res) => {
    const getSpecificPublicationBookName = await PublicationModel.findOne({
        books: req.params.isbn 
    });
    return res.json({
        publications_book: getSpecificPublicationBookName
    });
});

/*
Route           /publication/add
Description     add new publication
Access          Public
Parameter       NONE
Methods         POST
*/
Router.post("/add", async (req, res) => {
    const {
        newPublication
    } = req.body;
    PublicationModel.create(newPublication);
    return res.json({
        messgae: "publication added successfully"
    });
});

/*
Route           /publication/update/name
Description     Update publication name
Access          Public
Parameter       id
Methods         PUT
*/
Router.put("/update/name/:id", async (req, res) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.id
        },
        {
            name: req.body.newName
        },
        {
            new: true
        }
    )
    return res.json({
        publications: updatedPublication
    })
})

/*
Route           /publication/update/book
Description     Update/add new book to a publications
Access          Public
Parameter       isbn
Methods         PUT
*/
Router.put("/update/book/:isbn", async (req, res) => {
    // update the publication database
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.body.pubId
        },
        {
            $addToSet: {
                books: req.params.isbn
            }
        },
        {
            new: true
        });
    // update the books database
    const updatedBooks = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $addToSet: {
                publications:req.body.pubId
            }
        },
        {
            new: true
        });

    return res.json({
        publications:updatedPublication,
        books:updatedBooks 
    })  
})

/*
Route           /book/delete/publication
Description     delete a publication from book
Access          Public
Parameter       pubId
Methods         DELETE
*/
Router.delete("/delete/book/:isbn/:pubId", async (req, res) => {
    // Delete a book from publication
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        {
            id: req.params.pubId
        },
        {
            $pull: {
                books: req.params.isbn
            }
        },
        {
            new: true
        }
    );

    // Delete a publication from books
    const updatedBooks = await BookModel.findOneAndUpdate(
        {
            ISBN: req.params.isbn
        },
        {
            $pull: {
                publications: req.params.pubId
            }
        },
        {
            new: true
        }
    );

    return res.json({
        books: updatedBooks,
        publications: updatedPublication
    })
})

/*
Route           /publication/delete/
Description     delete a publication
Access          Public
Parameter       id
Methods         DELETE
*/
Router.delete("/delete/:pubId", async (req, res) => {
    const updatedPublication = await PublicationModel.findOneAndDelete(
        {
            id:req.params.pubId,
        }
    )
    return res.json({
        publications: updatedPublication
    })
});

module.exports = Router;