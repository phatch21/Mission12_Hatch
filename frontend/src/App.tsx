import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BookList from "./BookList";
import Cart from "./Cart";
import { CartProvider } from "./CartContext";

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
