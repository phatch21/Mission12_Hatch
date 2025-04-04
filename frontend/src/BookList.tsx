import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Form,
  Container,
  Row,
  Col,
  Button,
  Badge,
} from "react-bootstrap";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

interface Book {
  bookID: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string; // ✅ used for filtering now
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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

  const [showToast, setShowToast] = useState(false);
  const [lastAddedTitle, setLastAddedTitle] = useState<string | null>(null);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, booksPerPage]);

  const handleSortByTitle = () => {
    const sortedBooks = [...books].sort((a, b) =>
      sortOrder === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title)
    );

    setBooks(sortedBooks);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const categories = Array.from(new Set(books.map((b) => b.category)));

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((b) => b.category === selectedCategory);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCost = cart
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    .toFixed(2);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Book List</h2>
      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-dark" onClick={() => navigate("/adminbooks")}>
          🛠️ Manage Books (Admin)
        </Button>
      </div>

      {/* ✅ Toast */}
      {showToast && (
        <div
          className="toast show align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-4"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style={{ zIndex: 9999 }}
        >
          <div className="d-flex">
            <div className="toast-body">
              ✅ <strong>{lastAddedTitle}</strong> added to cart!
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              onClick={() => setShowToast(false)}
            ></button>
          </div>
        </div>
      )}

      {/* 🛒 Cart Summary + View Cart */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div>
          <h5 className="m-0">
            Cart:{" "}
            <Badge bg="secondary">
              {totalItems} item{totalItems !== 1 ? "s" : ""}
            </Badge>{" "}
            | Total: <strong>${totalCost}</strong>
          </h5>
        </div>
        <Button variant="outline-primary" onClick={() => navigate("/cart")}>
          View Cart
        </Button>
      </div>

      {/* ✅ Progress Bar */}
      <div className="my-2">
        <p className="mb-1 text-muted" style={{ fontSize: "0.9rem" }}>
          Cart Progress
        </p>
        <div className="progress" style={{ height: "24px" }}>
          <div
            className={`progress-bar progress-bar-striped progress-bar-animated ${
              totalItems / books.length >= 0.75
                ? "bg-success"
                : totalItems / books.length >= 0.5
                  ? "bg-warning"
                  : "bg-danger"
            }`}
            role="progressbar"
            style={{ width: `${(totalItems / books.length) * 100}%` }}
            aria-valuenow={totalItems}
            aria-valuemin={0}
            aria-valuemax={books.length}
          >
            {Math.min(100, Math.round((totalItems / books.length) * 100))}%
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Loading books...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && (
        <>
          <Row className="justify-content-center mb-3">
            <Col xs="auto">
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Col>
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
                <th>Category</th>
                <th>Pages</th>
                <th>Price ($)</th>
                <th>Add to Cart</th>
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
                  <td>{book.category}</td>
                  <td>{book.pageCount}</td>
                  <td>{book.price.toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => {
                        addToCart({
                          bookID: book.bookID,
                          title: book.title,
                          price: book.price,
                          quantity: 1,
                        });
                        setLastAddedTitle(book.title);
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                    >
                      Add
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
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
