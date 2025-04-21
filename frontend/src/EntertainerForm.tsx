import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const EntertainerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    entStageName: "",
    entSSN: "",
    entStreetAddress: "",
    entCity: "",
    entState: "",
    entZipCode: "",
    entPhoneNumber: "",
    entEmailAddress: "",
    entWebPage: "",
    dateEntered: "",
  });

  useEffect(() => {
    if (isEdit) {
      axios
        .get(`${API_BASE}/api/entertainers/${id}`)
        .then((res) => setFormData(res.data));
    }
  }, [id, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request = isEdit
      ? axios.put(`${API_BASE}/api/entertainers/${id}`, {
          entertainerID: Number(id),
          ...formData,
        })
      : axios.post(`${API_BASE}/api/entertainers`, formData);

    request
      .then(() => navigate("/entertainers"))
      .catch(() => alert("Failed to save entertainer."));
  };

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">
        {isEdit ? "Edit Entertainer" : "Add New Entertainer"}
      </h2>
      <Form onSubmit={handleSubmit}>
        {Object.entries(formData).map(([key, value]) => {
          if (!isEdit && key.toLowerCase().includes("id")) return null;

          return (
            <Form.Group key={key} className="mb-3">
              <Form.Label>{key === "entertainerID" ? "ID" : key}</Form.Label>
              <Form.Control
                type="text"
                name={key}
                value={value}
                onChange={handleChange}
                readOnly={key.toLowerCase().includes("id")}
                disabled={key.toLowerCase().includes("id")}
              />
            </Form.Group>
          );
        })}

        <div className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => navigate("/entertainers")}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEdit ? "Update" : "Add"} Entertainer
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default EntertainerForm;
