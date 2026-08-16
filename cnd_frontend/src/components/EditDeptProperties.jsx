import axios from "axios";
import React, { useEffect, useState } from "react";

const EditDeptProperties = () => {
  const defaultForm = {
    deptDetails: [
      {
        depId: "",
        fullName: "",
        abbr: "",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);
  const [deptList, setDeptList] = useState([]);
  const [submited, setSubmitted] = useState(false);

  useEffect(() => {
    const getDepts = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/getDeptOfftake");
        if (res.data.Status?.toLowerCase() === "success") {
          setDeptList(res.data.data);
        } else {
          console.log("something went wrong, check logs");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getDepts();
  }, [submited]);

  //   const handleSubmit = async (e) => {
  //     e.preventDefault();
  //     try {
  //       const response = await axios.post(
  //         "https://cndofftakencr.in/api/update_dept",
  //         formData
  //       );
  //       if (response.data.Status === "Success") {
  //         alert("Department updated Successfully ✅");
  //         setFormData(defaultForm);
  //         setSubmitted(!submited);
  //       } else {
  //         alert(`something wrong !! \n ${response.data.error}`);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("deptDetails", JSON.stringify(formData.deptDetails));

    formData.deptDetails.forEach((dept) => {
      if (dept.logo) {
        data.append(`logo_${dept.depId}`, dept.logo);
      }
    });

    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/update_dept",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.Status === "Success") {
        alert("Department updated Successfully ✅");
        setSubmitted(!submited);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Edit Product Properties
          </h2>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Save Changes
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full border-collapse bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-700 text-sm uppercase">
                <th className="p-3 text-left">S.No.</th>
                <th className="p-3 text-left">Logo</th>
                <th className="p-3 text-left">Dep Id</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Abbrviation</th>
              </tr>
            </thead>

            <tbody>
              {deptList.map((prod, index) => {
                if (!formData.deptDetails[index]) {
                  setFormData((prevData) => {
                    const updated = [...prevData.deptDetails];
                    updated[index] = {
                      depId: prod.depId,
                      fullName: prod.department,
                      abbr: "",
                    };
                    return { ...prevData, deptDetails: updated };
                  });
                }

                return (
                  <tr
                    key={prod.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    <td className="p-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];

                          setFormData((prev) => {
                            const updated = [...prev.deptDetails];
                            updated[index] = {
                              ...updated[index],
                              logo: file,
                            };
                            return { ...prev, deptDetails: updated };
                          });
                        }}
                      />
                    </td>

                    <td className="p-3 font-medium text-gray-800">
                      {prod.depId}
                    </td>
                    <td className="p-3 font-medium text-gray-800">
                      {prod.department}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Enter unit"
                        value={formData.deptDetails[index]?.fullName}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prevData) => {
                            const updated = [...prevData.deptDetails];
                            updated[index] = {
                              ...updated[index],
                              fullName: value,
                              depId: prod.depId,
                            };
                            return {
                              ...prevData,
                              deptDetails: updated,
                            };
                          });
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Enter unit"
                        value={formData.deptDetails[index]?.abbr}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prevData) => {
                            const updated = [...prevData.deptDetails];
                            updated[index] = {
                              ...updated[index],
                              abbr: value,
                              depId: prod.depId,
                            };
                            return {
                              ...prevData,
                              deptDetails: updated,
                            };
                          });
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EditDeptProperties;
