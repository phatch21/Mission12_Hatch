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
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { cart, addToCart } = useCart();
  const navigate = useNavigate();

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

  const categories = Array.from(new Set(books.map((b) => b.classification)));

  const filteredBooks =
    selectedCategory === "All"
      ? books
      : books.filter((b) => b.classification === selectedCategory);

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

      {/* 🛒 Cart Summary + View Cart Button */}
      <div className="d-flex justify-content-between align-items-center mb-3">
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
                  <td>{book.pageCount}</td>
                  <td>{book.price.toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() =>
                        addToCart({
                          bookID: book.bookID,
                          title: book.title,
                          price: book.price,
                          quantity: 1,
                        })
                      }
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
