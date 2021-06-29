
let books = [
    {
      ISBN: "12345Book",
      title: "Getting started with MERN",
      pubDate: "2021-07-07",
      language: "en",
      numPage: 250,
      authors: [2],
      publications: [2],
      category: ["tech", "programming", "education", "thriller"],
    },
    {
        ISBN: "54321Book",
        title: "Getting started with Horror of MERN Stack👩🏼‍🦳",
        pubDate: "1998-07-12",
        language: ["en","hindi"],
        numPage: 250,
        author: [1],
        publications: [1],
        category: ["tech", "programming", "education", "thriller","horror"],
      },

  ];
  
  const authors = [
    {
      id: 1,
      name: "Pavan",
      books: ["12345Book", "1234566789Secret"],
    },
    { id: 2, name: "Elon Musk", books: [] },
  ];
  
  const publications = [
    {
      id: 2,
      name: "writex",
      books: ["12345Book"],
    },
    {
      id: 1,
      name: "Vivek",
      books: ["54321Book"],
    },
  ];
  
  module.exports = { books, authors, publications };