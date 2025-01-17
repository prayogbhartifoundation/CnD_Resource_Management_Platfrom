import React, { useEffect, useState } from "react";

import "../../styles/superAdmin.css";
import axios from "axios";

const AuthorisedSuperAdmin = ({ name }) => {
  const [agencyData, setAgencyData] = useState([]);
  const defaultForm = {
    agency: "",
    location: "",
    contact: "",
    contactEmail: "",
  }

  const [formData, setFormData] = useState(defaultForm);

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    axios
      .get("http://localhost:8081/api/getAgencies")
      .then((res) => {
        console.log(res);

        if (res.data.Status === "Success") {
          setAgencyData(res.data.data);
          // navigate('/login')
        } else {
          console.log(res.data.msg);

          //   setAuth(false)
          //   setMessage(res.data.Error)
        }
      })
      .catch((err) => console.log(err));
  }, [responseMessage]);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(formData);

    try {
      const response = await axios.post(
        "http://localhost:8081/api/agencyRegister",
        formData
      );
      console.log(response);

      setResponseMessage(response.data.msg);
      setError(null);
      setFormData(defaultForm)
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
      setResponseMessage("");
    }
  };

  return (
    <div className="authorisedHome">
      <div className="section1">
        <form action="" onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="agency"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Agency Name:
            </label>
            <input
              type="text"
              id="agency"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="location"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="contact"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Contact Person:
            </label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Contact Person Email:
            </label>
            <input
              type="text"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "5px",
                border: "1px solid #ccc",
              }}
            />
          </div>

          <button
            
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              background: "#007bff",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </form>

        {error && <>{error}</>}
      </div>
      <div className="section2">
        <table>
          <thead>
            <th>Agency ID</th>
            <th>Agency Name</th>
            <th>Contact Person</th>
            <th>Contact Person Email</th>
            <th>No. of Plants</th>
            <th>% of MoHUA Completion</th>
          </thead>

          <tbody>
            {agencyData.map((a,index) => (
              <tr>
                <td>{a.agencyId ? a.agencyId : '--'}</td>
                <td>{a.agency ? a.agency : '--'}</td>
                <td>{a.contact ? a.contact : '--'}</td>
                <td>{a.contactEmail ? a.contactEmail : '--'}</td>
                <td>{a.plants ? a.plants.length : 0}</td>
                <td>--</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuthorisedSuperAdmin;
