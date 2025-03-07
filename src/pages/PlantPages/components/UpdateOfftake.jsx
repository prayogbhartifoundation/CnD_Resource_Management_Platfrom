import React, { useEffect, useState } from "react";
import departments from "../../../data/departments";
import "../../../styles/FormStyle.css";
import axios from "axios";

const UpdateOfftake = ({ plantId }) => {
  const defaultForm = {
    plantId,
    depDetails: [
      {
        dep: "",
        newEntry: "",
        entryDate: "",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);
  const [plant, setPlant] = useState({});

  const [submited, setSubmitted] = useState(false);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  // };

  useEffect(() => {
    if (!plantId) return; // Prevent API call if plantId is empty

    axios
      .post("http://localhost:8081/api/getPlant", { plantId }) // Correct body format
      .then((res) => {
        console.log(res);
        if (res.data.Status === "Success") {
          setPlant(res.data.data);
        } else {
          console.error("Unexpected API response:", res);
          alert("Something went wrong, check logs!");
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, [submited, plantId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/api/update_mohua_status",
        formData
      );
      if (response.data.Status === "Success") {
        alert("OFFtake Updated Successfully !!");
        setFormData(defaultForm);
        setSubmitted(!submited);
        // setSubmitted(!submited);
      } else {
        alert(`something wrong !! \n ${response.data.error}`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
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
        Register
      </button>
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
              <th>Department</th>
              <th>(01.04.24 to 31.03.25)</th>
              
              <th>Today's data</th>
            </thead>

            <tbody>
              {departments.map((d, index) => {
                const plantDepIndex = plant.mohuaStatus ? plant.mohuaStatus.findIndex((m) => m.dep === d) : -1;
                // Ensure formData.prodDetails[index] exists
                if (!formData.depDetails[index]) {
                  setFormData((prevData) => {
                    const updatedDepDetails = [...prevData.depDetails];
                    updatedDepDetails[index] = {
                      newEntry: "",
                      entryDate: "",
                    };
                    return { ...prevData, depDetails: updatedDepDetails };
                  });
                }
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <label htmlFor="location">{d}</label>
                    </td>
                    <td>
                      <label htmlFor="location">{plantDepIndex>-1 ? plant.mohuaStatus[plantDepIndex].annual : 0}</label>
                    </td>
                   
                    <td>
                      <input
                        type="text"
                        id="newEntry"
                        name="newEntry"
                        value={formData.depDetails[index]?.newEntry}
                        // onChange={handleChange}

                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prevData) => {
                            const updatedDepDetails = [...prevData.depDetails];
                            updatedDepDetails[index] = {
                              ...updatedDepDetails[index],
                              dep: d,
                              newEntry: value,
                              entryDate: new Date().toISOString(),
                            };
                            return {
                              ...prevData,
                              depDetails: updatedDepDetails,
                            };
                          });
                        }}
                        required
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <br />
          <br />
        </form>

        {/* {error && <>{error}</>} */}
      </div>
      <hr />
    </div>
  );
};

export default UpdateOfftake;
