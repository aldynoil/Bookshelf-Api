const { nanoid } = require('nanoid');
// files
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    // Client tidak melampirkan properti name pada request body
    const response = h
      .response({
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      })
      .code(400);
    return response;
  }

  if (readPage > pageCount) {
    // Client melampirkan nilai properti readPage yang lebih besar dari nilai properti pageCount
    const response = h
      .response({
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      })
      .code(400);
    return response;
  }

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    id,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook); // push to books array

  const isSuccess = books.filter((note) => note.id === id).length > 0; // cek if newBook pushed

  if (isSuccess) {
    // Bila buku berhasil dimasukkan
    const response = h
      .response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      })
      .code(201);
    return response;
  }

  // Server gagal memasukkan buku karena alasan umum (generic error).
  const response = h
    .response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    })
    .code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;
  if (!name && !reading && !finished) {
    // kalau tidak ada query
    const response = h
      .response({
        status: 'success',
        data: {
          books: books.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }
  if (name) {
    const filteredBooksName = books.filter((book) => {
      // kalau ada query name
      const nameRegex = new RegExp(name, 'gi');
      return nameRegex.test(book.name);
    });
    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksName.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }
  if (reading) {
    const filteredBooksReading = books.filter(
      (book) => Number(book.reading) === Number(reading),
    );
    const response = h
      .response({
        status: 'success',
        data: {
          books: filteredBooksReading.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          })),
        },
      });
    response.code(200);
    return response;
  }
  const filteredBooksFinished = books.filter(
    (book) => Number(book.finished) === Number(finished),
  );
  const response = h
    .response({
      status: 'success',
      data: {
        books: filteredBooksFinished.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });
  response.code(200);
  return response;
};

module.exports = { addBookHandler, getAllBooksHandler };
