import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const AgencyLogin = () => {

    const [formData, setFormData] = useState({
        agencyId: "",
        password: "",
      });
    
      const [responseMessage, setResponseMessage] = useState("");
      const [error, setError] = useState(null);
    
      const navigate = useNavigate();
    
      useEffect(() => {
        axios
          .get("https://cndofftakencr.in/agencyHome")
          .then((res) => {
            console.log(res);
    
            if (res.data.Status === "Success") {
              navigate("/agency-home");
            } else {
            }
          })
          .catch((err) => console.log(err));
      }, [navigate]);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
          const response = await axios.post(
            "https://cndofftakencr.in/api/agencyLogin",
            formData
          );
          console.log(response.data.Status);
    
          if (response.data.Status === "Success") {
            navigate("/agency-home");
          }


          if (response.data.Status === "Reset Password") {
            navigate("/reset-password");
          }


    
          setResponseMessage(response.data.msg);
          setError(null);
        } catch (err) {
          setError(
            err.response?.data?.msg || "An error occurred. Please try again."
          );
          setResponseMessage("");
        }
      };


    return (
        <div
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            padding: "20px",
            border: "1px solid #ccc",
            borderRadius: "10px",
          }}
        >
          <h2>Agency Login</h2>
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="agencyId"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Agency ID:
              </label>
              <input
                type="text"
                id="agencyId"
                name="agencyId"
                value={formData.agencyId}
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
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
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
              type="submit"
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                background: "#007bff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
    
          {responseMessage && (
            <div style={{ marginTop: "20px", color: "green" }}>
              {responseMessage}
            </div>
          )}
    
          {error && <div style={{ marginTop: "20px", color: "red" }}>{error}</div>}
        </div>
      );
}

export default AgencyLogin