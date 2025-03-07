import React, { useEffect, useState } from "react";
import "../../../styles/FormStyle.css";
import axios from "axios";

const UpdateInvetory = ({ plantId }) => {
  const defaultForm = {
    plantId,
    prodDetails: [
      {
        prodName: "",
        addedQnt: "",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);

  const [prodList, setProdList] = useState([]);
  const [submited, setSubmitted] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/get_products")
      .then((res) => {
        console.log(res);
        if (res.data.status === "success") {
          setProdList(res.data.data);
        } else {
          alert("something wrong, check logs !!");
        }
      })
      .catch((err) => console.log(err));
  }, [submited]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/update_inventory",
        formData
      );
      if (response.data.Status === "Success") {
        alert("product added Successfully !!");
        setFormData(defaultForm);
        setSubmitted(!submited);
      } else {
        alert(`something wrong !! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="updateInventory">
      <label htmlFor="location">Update Inventory</label>
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
              <th>Available Quantity</th>
              <th>Quantity to add</th>
              <th>Total Quantity</th>
            </thead>

            <tbody>
              {prodList &&
                prodList.map((p, index) => {
                  const plantIndex = p.plantWise.findIndex(
                    (p) => p.plantId === plantId
                  );
                  console.log(plantIndex);
                  console.log(plantId);

                  // Ensure formData.prodDetails[index] exists
                  if (!formData.prodDetails[index]) {
                    setFormData((prevData) => {
                      const updatedProdDetails = [...prevData.prodDetails];
                      updatedProdDetails[index] = {
                        prodName: p.prodName,
                        addedQnt: "",
                      };
                      return { ...prevData, prodDetails: updatedProdDetails };
                    });
                  }
                  return (
                    <tr>
                      <td>{index + 1}.</td>
                      <td>
                        <label htmlFor="location">{p.prodName}</label>
                      </td>
                      <td>
                        {plantIndex > -1 ? (
                          <label htmlFor="addedQnt">
                            {p.plantWise[plantIndex].qnt}
                          </label>
                        ) : 0}
                      </td>

                      <td>
                        <input
                          type="text"
                          id="addedQnt"
                          name="addedQnt"
                          value={formData.prodDetails[index]?.addedQnt}
                          onChange={(e) => {
                            const { value } = e.target;
                            setFormData((prevData) => {
                              const updatedProdDetails = [
                                ...prevData.prodDetails,
                              ];
                              updatedProdDetails[index] = {
                                ...updatedProdDetails[index],
                                addedQnt: value,
                                prodName: p.prodName,
                              };
                              return {
                                ...prevData,
                                prodDetails: updatedProdDetails,
                              };
                            });
                          }}
                          required
                        />
                      </td>
                      <td>
                        <label>
                          {plantIndex > -1 &&
                          formData.prodDetails[index]?.addedQnt
                            ? +formData.prodDetails[index].addedQnt +
                              +p.plantWise[plantIndex].qnt
                            : p.plantWise[plantIndex]?.qnt || 0}
                        </label>
                      </td>
                    </tr>
                  );
                })}
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
            Update Inventory
          </button>
        </form>

        {/* {error && <>{error}</>} */}
      </div>

      <hr />
    </div>
  );
};

export default UpdateInvetory;
