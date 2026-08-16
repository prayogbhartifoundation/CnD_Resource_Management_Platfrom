import axios from "axios";
import { useState } from "react";

const CleanDeptOfftake = () => {

    const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleClean = async () => {
    const confirm = window.confirm(
      "⚠ This will permanently clear all annualTarget and offtakeData for all departments.\nAre you sure?"
    );
    if (!confirm) return;

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.delete("https://cndofftakencr.in/api/cleanDept");
      setMessage(res.data.message || "Data cleaned successfully.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Error while cleaning data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

    return (
        <div className="p-4 border border-gray-300 rounded-lg w-[300px] text-center">
  <h3 className="text-lg font-semibold mb-3">Clean Department Offtake Data</h3>

  <button
    onClick={handleClean}
    disabled={loading}
    className={`px-4 py-2 rounded-md text-white transition-colors ${
      loading
        ? "bg-red-400 cursor-not-allowed"
        : "bg-[#c0392b] hover:bg-red-700 cursor-pointer"
    }`}
  >
    {loading ? "Cleaning..." : "Clear All Data"}
  </button>

  {message && (
    <p className="mt-4 text-sm text-gray-600">{message}</p>
  )}
</div>

    )
};

export default CleanDeptOfftake;