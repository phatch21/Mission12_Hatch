import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Form, Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Book {
  bookID?: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  classification: string;
  category: string;
  pageCount: number;
  price: number;
}

const AdminBooks = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [formBook, setFormBook] = useState<Book>({
    title: "",
    author: "",
    publisher: "",
    isbn: "",
    classification: "",
    category: "",
    pageCount: 0,
    price: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBooks = () => {
    axios.get("/api/books").then((res) => {
      setBooks(res.data);
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormBook({
      ...formBook,
      [name]: name === "pageCount" || name === "price" ? Number(value) : value,
    });
  };

  const handleSubmit = () => {
    if (editingId) {
      axios
        .put(`http://localhost:5191/api/books/${editingId}`, {
          ...formBook,
          bookID: editingId,
        })
        .then(() => {
          setEditingId(null);
          resetForm();
          fetchBooks();
        });
    } else {
      axios.post("http://localhost:5191/api/books", formBook).then(() => {
        resetForm();
        fetchBooks();
      });
    }
  };

  const handleEdit = (book: Book) => {
    setFormBook(book);
    setEditingId(book.bookID || null);
  };

  const handleDelete = (id?: number) => {
    if (id) {
      axios.delete(`http://localhost:5191/api/books/${id}`).then(fetchBooks);
    }
  };

  const resetForm = () => {
    setFormBook({
      title: "",
      author: "",
      publisher: "",
      isbn: "",
      classification: "",
      category: "",
      pageCount: 0,
      price: 0,
    });
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Admin Book Manager</h2>
      <Button variant="secondary" onClick={() => navigate("/")}>
        ← Back to Book List
      </Button>

      <Form className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formBook.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={formBook.author}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Publisher</Form.Label>
              <Form.Control
                type="text"
                name="publisher"
                value={formBook.publisher}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>ISBN</Form.Label>
              <Form.Control
                type="text"
                name="isbn"
                value={formBook.isbn}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-2">
              <Form.Label>Classification</Form.Label>
              <Form.Control
                type="text"
                name="classification"
                value={formBook.classification}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formBook.category}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Page Count</Form.Label>
              <Form.Control
                type="number"
                name="pageCount"
                value={formBook.pageCount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formBook.price}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleSubmit}>
            {editingId ? "Update Book" : "Add Book"}
          </Button>
        </div>
      </Form>

      <Table striped bordered hover responsive className="text-center">
        <thead className="table-light">
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Classification</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price ($)</th>
            <th>Actions</th> {/* Extra column for Edit/Delete */}
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
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
                  variant="info"
                  onClick={() => handleEdit(book)}
                  className="me-2"
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(book.bookID)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminBooks;
