import axios from "axios";
import React, { useEffect, useState } from "react";

const EditProductProperties = () => {
  const defaultForm = {
    prodDetails: [
      {
        prodName: "",
        unit: "",
      },
    ],
  };

  const [formData, setFormData] = useState(defaultForm);
  const [productList, setProductList] = useState([]);
  const [submited, setSubmitted] = useState(false);

  useEffect(() => {
    const getProds = async () => {
      try {
        const res = await axios.get("https://cndofftakencr.in/api/get_products");
        if (res.data.status?.toLowerCase() === "success") {
          setProductList(res.data.data);
        } else {
          console.log("something went wrong, check logs");
        }
      } catch (error) {
        console.error(error);
      }
    };

    getProds();
  }, [submited]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/update_product",
        formData
      );
      if (response.data.Status === "Success") {
        alert("Product updated Successfully ✅");
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
                <th className="p-3 text-left">Product</th>
                <th className="p-3 text-left">Unit</th>
              </tr>
            </thead>

            <tbody>
              {productList.map((prod, index) => {
                if (!formData.prodDetails[index]) {
                  setFormData((prevData) => {
                    const updated = [...prevData.prodDetails];
                    updated[index] = {
                      prodName: prod.prodName,
                      unit: "",
                    };
                    return { ...prevData, prodDetails: updated };
                  });
                }

                return (
                  <tr
                    key={prod.id}
                    className="border-b hover:bg-blue-50 transition"
                  >
                    <td className="p-3 text-gray-600">{index + 1}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {prod.prodName}
                    </td>
                    <td className="p-3">
                      <input
                        type="text"
                        placeholder="Enter unit"
                        value={formData.prodDetails[index]?.unit}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        onChange={(e) => {
                          const { value } = e.target;
                          setFormData((prevData) => {
                            const updated = [...prevData.prodDetails];
                            updated[index] = {
                              ...updated[index],
                              unit: value,
                              prodName: prod.prodName,
                            };
                            return {
                              ...prevData,
                              prodDetails: updated,
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

export default EditProductProperties;
