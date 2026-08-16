import axios from "axios";
import { useState } from "react";

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
  const [prodImg, setProdImg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setProdImg(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // STEP 1: Add Product
      const response = await axios.post(
        "https://cndofftakencr.in/api/add_product",
        formData
      );

      if (response.data.Status !== "Success") {
        alert(`Something wrong \n ${response.data.error}`);
        return;
      }

      // ✅ Get product ID from API response
      const prodId = response.data.prodId || response.data.data?.prodId;

      // STEP 2: Upload Image if selected

      console.log(prodImg,prodId)
      if (prodImg && prodId) {
        const imageData = new FormData();
        imageData.append("prodImg", prodImg);


        await fetch(
          `https://cndofftakencr.in/api/upload/prodImg/${prodId}`,
          {
            method: "POST",
            body: imageData,
          }
        );
      }

      alert("Product added successfully!");
      setFormData(defaultForm);
      setProdImg(null);

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Add New Product
      </h2>

      <form onSubmit={handleSubmit}>
        <table className="w-full border-collapse border border-gray-300 text-center">
          <tbody>
            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product Name:</td>
              <td className="bg-emerald-50 p-4">
                <input name="prodName" value={formData.prodName} onChange={handleChange} className="w-11/12 border p-2 rounded" required />
              </td>
            </tr>

            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product DSR:</td>
              <td className="bg-emerald-50 p-4">
                <input name="dsr" value={formData.dsr} onChange={handleChange} className="w-11/12 border p-2 rounded"  />
              </td>
            </tr>

            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product Quantity:</td>
              <td className="bg-emerald-50 p-4">
                <input name="qnt" value={formData.qnt} onChange={handleChange} className="w-11/12 border p-2 rounded" />
              </td>
            </tr>

            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product Processing:</td>
              <td className="bg-emerald-50 p-4">
                <textarea name="processingSteps" value={formData.processingSteps} onChange={handleChange} rows={4} className="w-11/12 border p-2 rounded" />
              </td>
            </tr>

            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product Details:</td>
              <td className="bg-emerald-50 p-4">
                <textarea name="details" value={formData.details} onChange={handleChange} rows={4} className="w-11/12 border p-2 rounded" />
              </td>
            </tr>

            {/* ✅ IMAGE FIELD */}
            <tr>
              <td className="w-1/3 p-4 font-semibold text-left">Product Image:</td>
              <td className="bg-emerald-50 p-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-11/12 border p-2 rounded"
                />
              </td>
            </tr>

          </tbody>
        </table>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNewProduct;
