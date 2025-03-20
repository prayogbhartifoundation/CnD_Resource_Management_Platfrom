import React, { useState } from "react";
import "../../../styles/FormStyle.css";
import axios from "axios";
const AddNewProduct = ({ plantId }) => {
  const defaultForm = {
    plantId,
    prodName: "",
    dsr: "",
    qnt: "",
    details: "",
    processingSteps: "",
  };

  const [formData, setFormData] = useState(defaultForm);

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
        "https://cndofftakencr.in/api/add_product",
        formData
      );
      if (response.data.Status === "Success") {
        alert("product added Successfully !!");
        setFormData(defaultForm);
      } else {
        alert(`something wrong !! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="addNewProduct">
      <label htmlFor="location">Add New Product</label>
      <br />
      <br />
      <div className="form-cont">
        <form
          action=""
          // onSubmit={handleSubmit}
        >
          <table>
            {/* <thead>
              <th>Sno.</th>
              <th>Product Name</th>
              
            </thead> */}

            <tbody>
              <tr>
                <td>
                  <label htmlFor="prodName">Product Name:</label>
                </td>

                <td>
                  <input
                    type="text"
                    id="prodName"
                    name="prodName"
                    value={formData.prodName}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="dsr">Product DSR:</label>
                </td>

                <td>
                  <input
                    type="text"
                    id="dsr"
                    name="dsr"
                    value={formData.dsr}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="dsr">Product Quantity:</label>
                </td>

                <td>
                  <input
                    type="text"
                    id="qnt"
                    name="qnt"
                    value={formData.qnt}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="processingSteps">Product Processing:</label>
                </td>

                <td>
                  <textarea
                    type="text"
                    id="processingSteps"
                    name="processingSteps"
                    rows={8}
                    value={formData.processingSteps}
                    onChange={handleChange}
                    required
                  />
                </td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="details">Product details:</label>
                </td>

                <td>
                  <textarea
                    type="text"
                    id="details"
                    name="details"
                    rows={8}
                    value={formData.details}
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
            onClick={handleSubmit}
          >
            Add Product
          </button>
        </form>
        {/* {error && <>{error}</>} */}
      </div>
      <hr />
    </div>
  );
};

export default AddNewProduct;
