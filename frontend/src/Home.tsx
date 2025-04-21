import { Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">🎉 Welcome to the Entertainment Agency</h1>
      <p className="lead">
        Discover amazing entertainers, view details, and manage bookings with
        ease.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate("/entertainers")}
      >
        View Entertainers 🎭
      </Button>
    </Container>
  );
};

export default Home;
