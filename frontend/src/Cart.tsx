import { useNavigate } from "react-router-dom";
import { Container, Table, Button } from "react-bootstrap";
import { useCart } from "./CartContext";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart
    .reduce((sum, item) => sum + item.quantity * item.price, 0)
    .toFixed(2);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Shopping Cart</h2>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.bookID}>
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => removeFromCart(item.bookID)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <h5 className="text-end">Total: ${total}</h5>

          <div className="d-flex justify-content-between mt-3">
            <Button variant="secondary" onClick={() => navigate("/")}>
              Continue Shopping
            </Button>
            <Button variant="outline-danger" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default Cart;
