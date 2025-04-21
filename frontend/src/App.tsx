import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EntertainerList from "./EntertainerList";
import EntertainerDetails from "./EntertainerDetails";
import EntertainerForm from "./EntertainerForm";
import AppNavbar from "./NavBar";
import Home from "./Home"; 

function App() {
  return (
      <Router>
        <AppNavbar /> {/* ⬅️ Add this line */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/entertainers" element={<EntertainerList />} />
          <Route path="/entertainer/:id" element={<EntertainerDetails />} />
          <Route path="/entertainer/add" element={<EntertainerForm />} />
          <Route path="/entertainer/edit/:id" element={<EntertainerForm />} />
        </Routes>
      </Router>
  );
}

export default App;
