import axios from "axios";
import { useEffect, useState } from "react";

const fixedProducts = [
  { productName: "Screen Soil", percentage: 57 },
  { productName: "BSB 40-150 mm", percentage: 28 },
  { productName: "RA 10 mm", percentage: 10 },
  { productName: "Brick Powder", percentage: 3 },
  { productName: "Rejects", percentage: 2 },
];

const VNNProcessForm = () => {

     const [form, setForm] = useState({
    dateOfSubmission: new Date().toISOString().split("T")[0],
    processQty: "",
    manualEntry: false,
    products: [],
    remarks: "",
  });

  useState(() => {
    console.log("Initial form state:", form);
  }, [form]);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const [productOptions, setProductOptions] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [editableProducts, setEditableProducts] = useState([]);

  useEffect(() => {
    axios.get("https://cndofftakencr.in/api/processing-products").then((res) => {
      setProductOptions(res.data);
      setEditableProducts(res.data); // keep both name + percentage

      setForm({
        dateOfSubmission: new Date().toISOString().split("T")[0],
        processQty: "",
        manualEntry: false,
        products: res.data.map((p) => ({
          productName: p.productName,
          productQty: "",
          productPercentage: p.productPercentage.toFixed(2),
          remarks: "",
        })),
        remarks: "",
      });
    });
  }, [showModal]);

  useEffect(() => {
    console.log(form);
  }, [form]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(e.target);
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProductChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProducts = [...form.products];
    updatedProducts[index][name] = value;

    // Recalculate percentage only if quantity changes in manual mode
    if (name === "productQty" && form.manualEntry) {
      const totalQty = updatedProducts.reduce((sum, p) => {
        const qty = parseFloat(p.productQty);
        return sum + (isNaN(qty) ? 0 : qty);
      }, 0);

      updatedProducts.forEach((p) => {
        const qty = parseFloat(p.productQty);
        const percentage =
          !isNaN(qty) && totalQty > 0
            ? ((qty / totalQty) * 100).toFixed(2)
            : "";
        p.productPercentage = percentage;
      });
    }

    setForm((prev) => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    setForm((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        { productName: "", productQty: "", productPercentage: "", remarks: "" },
      ],
    }));
  };

  const removeProduct = (index) => {
    const updatedProducts = form.products.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, products: updatedProducts }));
  };

  const handleProductEdit = (index, field, value) => {
    const updated = [...editableProducts];
    updated[index][field] =
      field === "productPercentage" ? parseFloat(value) || 0 : value;
    setEditableProducts(updated);
  };

  const addNewEditableProduct = () => {
    setEditableProducts([
      ...editableProducts,
      { productName: "", productPercentage: 0 },
    ]);
  };

  const totalPercentage = editableProducts.reduce(
    (sum, p) => sum + (p.productPercentage || 0),
    0
  );

  const saveProducts = async () => {
    if (totalPercentage !== 100) {
      alert("Total percentage must equal 100. Current: " + totalPercentage);
      return;
    }
    try {
      await axios.post(
        "https://cndofftakencr.in/api/update-processing-products",
        editableProducts
      );
      alert("Products updated successfully!");
      setShowModal(false);
    } catch (err) {
      alert("Failed to update products.");
    }
  };

  // Auto-fill fixed products when processQty changes and manualEntry is false
  useEffect(() => {
    if (!form.manualEntry && form.processQty >= 0 && !isNaN(form.processQty)) {
      const qty = parseFloat(form.processQty);
      if (qty >= 0) {
        const autoProducts = productOptions.map((p) => ({
          productName: p.productName,
          productQty: ((p.productPercentage / 100) * qty).toFixed(2),
          productPercentage: p.productPercentage.toFixed(2),
          remarks: "",
        }));
        setForm((prev) => ({ ...prev, products: autoProducts }));
      }
    }
  }, [productOptions, form.processQty, form.manualEntry]);

  const validate = () => {
    const errs = {};
    if (isNaN(form.processQty) || form.processQty < 0) {
      errs.processQty = "Valid process quantity is required";
    }

    form.products.forEach((product, index) => {
      if (!product.productName) {
        errs[`productName-${index}`] = "Product name is required";
      }
      if (product.productQty<0 || isNaN(product.productQty)) {
        errs[`productQty-${index}`] = "Valid product quantity required";
      }
    });

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setSuccess("");

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.post(
          "https://cndofftakencr.in/api/processing-form-submission",
          form
        );
        setSuccess("Form submitted successfully!");
        setForm({
          dateOfSubmission: new Date().toISOString().split("T")[0],
          processQty: "",
          manualEntry: false,
          products: [],
          remarks: "",
        });
      } catch (err) {
        setSuccess("Submission failed. Please try again.");
      }
    }
  };

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg">
  <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
    VNN Processing Form Submission
  </h2>

  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
    {/* Date of Submission */}
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-gray-700">Date of Submission</label>
      <input
        type="date"
        name="dateOfSubmission"
        value={form.dateOfSubmission}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500"
      />
    </div>

    {/* Process Quantity */}
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-gray-700">Process Quantity</label>
      <input
        type="text"
        name="processQty"
        value={form.processQty}
        onChange={handleChange}
        className={`border rounded-md px-3 py-2 text-gray-700 focus:outline-none ${
          errors.processQty
            ? "border-red-500 focus:border-red-500"
            : "border-gray-300 focus:border-blue-500"
        }`}
      />
      {errors.processQty && (
        <span className="text-sm text-red-500">{errors.processQty}</span>
      )}
    </div>

    {/* Manual Entry Checkbox */}
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        name="manualEntry"
        checked={form.manualEntry}
        onChange={handleChange}
        className="w-4 h-4"
      />
      <label className="font-medium text-gray-700">Manual Entry</label>
    </div>

    {/* Product List */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Products</h3>

      {form.products.map((product, index) => (
        <div
          key={index}
          className="flex items-center gap-3 mb-2 flex-wrap sm:flex-nowrap"
        >
          <input
            list="product-names"
            name="productName"
            value={product.productName}
            onChange={(e) => handleProductChange(index, e)}
            className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:border-blue-500"
            disabled
          />
          <datalist id="product-names">
            {productOptions.map((prd, idx) => (
              <option key={idx} value={prd.productName} />
            ))}
          </datalist>

          <input
            type="number"
            name="productQty"
            placeholder="Quantity"
            value={product.productQty}
            onChange={(e) => handleProductChange(index, e)}
            className={`border rounded-md px-3 py-2 w-24 focus:outline-none ${
              errors[`productQty-${index}`]
                ? "border-red-500"
                : "border-gray-300 focus:border-blue-500"
            }`}
            disabled={!form.manualEntry}
          />

          <span className="min-w-[50px] text-right font-medium text-gray-700">
            {product.productPercentage || "--"}%
          </span>

          <input
            type="text"
            name="remarks"
            placeholder="Remarks"
            value={product.remarks}
            onChange={(e) => handleProductChange(index, e)}
            className="border border-gray-300 rounded-md px-3 py-2 flex-1 focus:outline-none focus:border-blue-500"
          />

          <div className="flex flex-col text-sm text-red-500">
            {errors[`productName-${index}`] && (
              <span>{errors[`productName-${index}`]}</span>
            )}
            {errors[`productQty-${index}`] && (
              <span>{errors[`productQty-${index}`]}</span>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Change Product Details
      </button>
    </div>

    {/* Remarks */}
    <div className="flex flex-col gap-1.5">
      <label className="font-medium text-gray-700">Remarks</label>
      <textarea
        name="remarks"
        value={form.remarks}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-3 py-2 min-h-[80px] resize-y focus:outline-none focus:border-blue-500"
      ></textarea>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 rounded-md transition"
    >
      Submit
    </button>

    {success && (
      <div className="text-green-600 font-medium text-center mt-2">
        {success}
      </div>
    )}
  </form>

  {/* ===== Modal ===== */}
  {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-45 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-[95%] max-w-2xl animate-scaleIn">
        <h3 className="text-center text-xl font-semibold mb-4 text-gray-800">
          Edit Product Details
        </h3>

        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-3 py-2 font-semibold text-gray-700">
                Product Name
              </th>
              <th className="border border-gray-300 px-3 py-2 font-semibold text-gray-700">
                Percentage
              </th>
              <th className="border border-gray-300 px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {editableProducts.map((prod, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="text"
                    value={prod.productName}
                    onChange={(e) =>
                      handleProductEdit(idx, "productName", e.target.value)
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2">
                  <input
                    type="number"
                    value={prod.productPercentage}
                    onChange={(e) =>
                      handleProductEdit(
                        idx,
                        "productPercentage",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-md px-3 py-2 w-full focus:outline-none focus:border-blue-500"
                  />
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center">
                  <button
                    type="button"
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md px-2 py-1 transition"
                    onClick={() =>
                      setEditableProducts(
                        editableProducts.filter((_, i) => i !== idx)
                      )
                    }
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="text-right font-medium text-gray-700 mb-2">
          Total: <b>{totalPercentage}%</b>
          {totalPercentage !== 100 && (
            <span className="text-red-500 text-sm ml-1">(Must be 100)</span>
          )}
        </div>

        <button
          type="button"
          onClick={addNewEditableProduct}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition mb-4"
        >
          ➕ Add Product
        </button>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={saveProducts}
            className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 rounded-md transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )}
</div>

    )
};

export default VNNProcessForm;