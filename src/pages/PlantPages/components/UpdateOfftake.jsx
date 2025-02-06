import React, { useState } from 'react'

const UpdateOfftake = () => {
    const defaultForm = {
        location: "",
        contact: "",
        contactEmail: "",
      };
    
      const [formData, setFormData] = useState(defaultForm);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
      };
  return (
    <div>
        <label htmlFor="location">Update Offtake</label>
        <br />
        <br />
        <div className="form-cont">
        <form
          action=""
          // onSubmit={handleSubmit}
        >
          <table>
            <thead>
              <th>Sno.</th>
              <th>Product Name</th>
              <th>Quantity to add</th>
              <th>Total Quantity</th>
            </thead>

            <tbody>
              <tr>
                <td>1.</td>
                <td>
                  <label htmlFor="location">Plant Location:</label>
                </td>

                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
              
              <tr>
                <td>1.</td>
                <td>
                  <label htmlFor="location">Plant Location:</label>
                </td>

                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <br />
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

        {/* {error && <>{error}</>} */}
      </div>
      <hr />
    </div>
  )
}

export default UpdateOfftake