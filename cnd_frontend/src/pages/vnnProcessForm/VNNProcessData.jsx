import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

const VNNProcessData = () => {
  const [submissions, setSubmissions] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [filterDate, setFilterDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchSubmissions();
  }, [startDate, endDate]); // re-fetch whenever range changes

  const fetchSubmissions = async () => {
    try {
      let url = "https://cndofftakencr.in/api/processing-form-submissions";

      // Build query params dynamically
      const params = new URLSearchParams();
      if (startDate) params.append("start", startDate);
      if (endDate) params.append("end", endDate);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      setSubmissions(response.data);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
    }
  };

  const handleQtyChange = (submissionId, productIndex, value) => {
    setEditedData((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        [productIndex]: value,
      },
    }));
  };

  const handleSave = async (submissionId) => {
    const updatedProducts = submissions
      .find((s) => s._id === submissionId)
      .products.map((product, index) => ({
        ...product,
        productQty: editedData[submissionId]?.[index] || product.productQty,
      }));

    try {
      await axios.put(
        `https://cndofftakencr.in/api/processing-form-update/${submissionId}`,
        {
          products: updatedProducts,
        }
      );
      await fetchSubmissions();
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  // === Excel Download (Single Sheet) ===
  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();

    // Prepare data with header
    const wsData = [
      [
        "Submission Date",
        "Process Qty",
        "Product Name",
        "Qty",
        "%",
        "Product Remarks",
        "Process Remarks",
      ],
    ];

    submissions.forEach((submission) => {
      submission.products.forEach((p, index) => {
        wsData.push([
          new Date(submission.dateOfSubmission).toLocaleDateString(),
          submission.processQty,
          p.productName,
          editedData[submission._id]?.[index] ?? p.productQty,
          p.productPercentage,
          p.remarks,
          index === 0 ? submission?.remarks || "NA" : "",
        ]);
      });
    });

    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Submissions");

    XLSX.writeFile(wb, "Submissions.xlsx");
  };

  return (
    <div className="p-4 bg-[#fefefe]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Varanasi C&D Daily Processing Report
        </h2>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadExcel}
            className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Download Excel
          </button>

          <label htmlFor="startDate" className="text-gray-700 font-medium">
            Start Date:
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />

          <label htmlFor="endDate" className="text-gray-700 font-medium">
            End Date:
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />

          {(startDate || endDate) && (
            <button
              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {submissions.map((submission) => (
        <div
          key={submission._id}
          className="mb-8 p-4 border border-gray-300 rounded-lg shadow-sm bg-white"
        >
          <h4 className="font-medium text-gray-700 mb-2 flex justify-between">
            <span>
              Processing Date:{" "}
              {new Date(submission.dateOfSubmission).toLocaleDateString()} |
              Process Qty: <span className="font-semibold">{submission.processQty}</span>
            </span>

            <span>
              Processing Remarks: {submission?.remarks || "NA"}
            </span>
          </h4>

          <table className="w-full border-collapse mt-2">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Product Name
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Qty
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  %
                </th>
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-semibold text-gray-700">
                  Product Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {submission.products.map((product, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                    {product.productName}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                    {submission.manualEntry ? (
                      <input
                        type="number"
                        className="w-16 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={
                          editedData[submission._id]?.[index] ??
                          product.productQty
                        }
                        onChange={(e) =>
                          handleQtyChange(submission._id, index, e.target.value)
                        }
                      />
                    ) : (
                      product.productQty
                    )}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                    {product.productPercentage}
                  </td>
                  <td className="border border-gray-300 px-3 py-2 text-sm text-gray-800">
                    {product.remarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default VNNProcessData;