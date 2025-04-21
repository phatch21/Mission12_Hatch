import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Table, Button } from "react-bootstrap";

interface Entertainer {
  entertainerID: number;
  entStageName: string;
  entSSN: string;
  entStreetAddress: string;
  entCity: string;
  entState: string;
  entZipCode: string;
  entPhoneNumber: string;
  entEmailAddress: string;
  entWebPage: string;
  dateEntered: string;
}

const EntertainerDetails = () => {
  const { id } = useParams();
  const [entertainer, setEntertainer] = useState<Entertainer | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/entertainers/${id}`)
      .then((res) => setEntertainer(res.data))
      .catch((err) => console.error("Failed to load entertainer:", err));
  }, [id]);

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this entertainer?")) {
      axios
        .delete(`/api/entertainers/${id}`)
        .then(() => navigate("/entertainers"))
        .catch((err) => alert("Delete failed."));
    }
  };

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">🎤 Entertainer Details</h2>

      {entertainer ? (
        <Table bordered>
          <tbody>
            <tr>
              <th>Stage Name</th>
              <td>{entertainer.entStageName}</td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>{entertainer.entPhoneNumber}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{entertainer.entEmailAddress}</td>
            </tr>
            <tr>
              <th>Address</th>
              <td>
                {entertainer.entStreetAddress}, {entertainer.entCity},{" "}
                {entertainer.entState} {entertainer.entZipCode}
              </td>
            </tr>
            <tr>
              <th>Web Page</th>
              <td>{entertainer.entWebPage}</td>
            </tr>
            <tr>
              <th>SSN</th>
              <td>{entertainer.entSSN}</td>
            </tr>
            <tr>
              <th>Date Entered</th>
              <td>{entertainer.dateEntered}</td>
            </tr>
          </tbody>
        </Table>
      ) : (
        <p className="text-center">Loading entertainer details...</p>
      )}

      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => navigate("/entertainers")}>
          ⬅️ Back to List
        </Button>
        <div>
          <Button variant="warning" onClick={() => navigate(`/entertainer/edit/${id}`)}>
            ✏️ Edit
          </Button>{" "}
          <Button variant="danger" onClick={handleDelete}>
            🗑️ Delete
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default EntertainerDetails;
