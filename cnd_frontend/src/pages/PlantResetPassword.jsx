import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const PlantResetPassword = () => {
    const [formData, setFormData] = useState({
        plantId: "",
        oldPassword: "",
        password: "",
      });
    
      const [responseMessage, setResponseMessage] = useState("");
      const [error, setError] = useState(null);
    
      const navigate = useNavigate();
    
    
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
          const response = await axios.put(
            "https://cndofftakencr.in/api/reset_password_plant",
            formData
          );
          console.log(response.data.Status);
    
          if (response.data.Status === "Success") {
            navigate("/plant-home");
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
          <h2>Plant Reset Password</h2>
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="plantId"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Plant ID:
              </label>
              <input
                type="text"
                id="plantId"
                name="plantId"
                value={formData.plantId}
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
                htmlFor="oldPassword"
                style={{ display: "block", marginBottom: "5px" }}
              >
                Old Password:
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
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
                New Password:
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

export default PlantResetPassword