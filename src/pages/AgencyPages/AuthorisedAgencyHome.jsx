import axios from 'axios';
import React, { useEffect, useState } from 'react'

const AuthorisedAgencyHome = ({name}) => {
  const [plantData, setPlantData] = useState([]);
  const defaultForm = {
    location: "",
    contact: "",
    contactEmail: "",
  }

  const [formData, setFormData] = useState(defaultForm);

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");


  useEffect(() => {
    axios
      .get("http://localhost:8081/api/getPlants")
      .then((res) => {
        console.log(res);

        if (res.data.Status === "Success") {
          setPlantData(res.data.data);
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
        "http://localhost:8081/api/plantRegister",
        {...formData, agencyId:name}
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
              style={{ display: "block", marginBottom: "5px" }}
            >
              Agency Id : {name}
            </label>
            <br />
            <label
              htmlFor="location"
              style={{ display: "block", marginBottom: "5px" }}
            >
              Plant Location:
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
            <th>Plant ID</th>
            <th>Location</th>
            <th>Contact Person</th>
            <th>Contact Person Email</th>
            <th>Total (MT)</th>
          </thead>

          <tbody>
            {plantData.map((p,index) => (
              <tr>
                <td>{p.plantId ? p.plantId : '--'}</td>
                <td>{p.location ? p.location : '--'}</td>
                <td>{p.contact ? p.contact : '--'}</td>
                <td>{p.contactEmail ? p.contactEmail : '--'}</td>
                
                <td>--</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AuthorisedAgencyHome