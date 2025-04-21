import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

interface Entertainer {
  entertainerID: number;
  entStageName: string;
  entPhoneNumber: string;
  entEmailAddress: string;
}

const EntertainerList = () => {
  const [entertainers, setEntertainers] = useState<Entertainer[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/entertainers")
      .then((res) => {
        setEntertainers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch entertainers:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">🎭 Entertainers</h2>

      <div className="d-flex justify-content-end mb-3">
        <Button onClick={() => navigate("/entertainer/add")}>
          ➕ Add Entertainer
        </Button>
      </div>

      {loading ? (
        <p className="text-center">Loading entertainers...</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead className="table-light">
            <tr>
              <th>Stage Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {entertainers.map((ent) => (
              <tr key={ent.entertainerID}>
                <td>{ent.entStageName}</td>
                <td>{ent.entPhoneNumber}</td>
                <td>{ent.entEmailAddress}</td>
                <td>
                  <Button
                    size="sm"
                    variant="info"
                    onClick={() =>
                      navigate(`/entertainer/${ent.entertainerID}`)
                    }
                  >
                    Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default EntertainerList;
