import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const PlantLogin = () => {
  
    const [formData, setFormData] = useState({
        plantId: "",
        password: "",
      });
    
      const [responseMessage, setResponseMessage] = useState("");
      const [error, setError] = useState(null);
    
      const navigate = useNavigate();
    
      useEffect(() => {
        axios
          .get("http://localhost:8081/plantHome")
          .then((res) => {
            console.log(res);
    
            if (res.data.Status === "Success") {
              navigate("/plant-home");
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
            "http://localhost:8081/api/plantLogin",
            formData
          );
          console.log(response.data.Status);
    
          if (response.data.Status === "Success") {
            navigate("/plant-home");
          }


          if (response.data.Status === "Reset Password") {
            navigate("/reset-password-plant");
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
          <h2>Plant Login</h2>
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

export default PlantLogin