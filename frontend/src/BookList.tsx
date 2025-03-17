import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Container, Row, Col } from "react-bootstrap";

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  pageCount: number;
  price: number;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    axios
      .get("http://localhost:5191/api/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        setError("Failed to load books.");
        setLoading(false);
      });
  }, []);

  const handleSortByTitle = () => {
    const sortedBooks = [...books].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });

    setBooks(sortedBooks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Book List</h2>

      {loading && <p className="text-center">Loading books...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <Row className="justify-content-center mb-3">
            <Col xs="auto">
              <Form.Select
                value={booksPerPage}
                onChange={(e) => setBooksPerPage(Number(e.target.value))}
              >
                <option value="5">Show 5</option>
                <option value="10">Show 10</option>
                <option value="15">Show 15</option>
              </Form.Select>
            </Col>
          </Row>

          <Table striped bordered hover responsive className="text-center">
            <thead className="table-light">
              <tr>
                <th onClick={handleSortByTitle} style={{ cursor: "pointer" }}>
                  Title {sortOrder === "asc" ? "🔼" : "🔽"}
                </th>
                <th>Author</th>
                <th>Publisher</th>
                <th>ISBN</th>
                <th>Classification</th>
                <th>Pages</th>
                <th>Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {currentBooks.map((book) => (
                <tr key={book.bookID}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>{book.publisher}</td>
                  <td>{book.isbn}</td>
                  <td>{book.classification}</td>
                  <td>{book.pageCount}</td>
                  <td>{book.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination UI */}
          <div className="pagination-container">
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <span
                  key={i}
                  className={`page-item ${i + 1 === currentPage ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default BookList;
