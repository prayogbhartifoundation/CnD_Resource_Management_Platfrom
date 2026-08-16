import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AgencyResetPassword = () => {

    const [formData, setFormData] = useState({
        agencyId: "",
        oldPassword: "",
        password: "",
      });
    
      const [responseMessage, setResponseMessage] = useState("");
      const [error, setError] = useState(null);
    
      const navigate = useNavigate();
    
    
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
          const response = await axios.put(
            "https://cndofftakencr.in/api/reset_password",
            formData
          );
          console.log(response.data.Status);
    
          if (response.data.Status === "Success") {
            navigate("/agency-home");
          }


    
          setResponseMessage(response.data.msg);
          setError(null);
        } catch (err) {
          setError(
            err.response?.data?.msg || "An error occurred. Please try again."
          );
          setResponseMessage("");
        }
      };



    return (
        <div className="max-w-md mx-auto p-6 border border-gray-300 rounded-lg shadow-sm">
  <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
    Agency Login
  </h2>

  <form onSubmit={handleSubmit} className="space-y-5">
    {/* Agency ID */}
    <div>
      <label
        htmlFor="agencyId"
        className="block text-gray-700 font-medium mb-2"
      >
        Agency ID:
      </label>
      <input
        type="text"
        id="agencyId"
        name="agencyId"
        value={formData.agencyId}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Old Password */}
    <div>
      <label
        htmlFor="oldPassword"
        className="block text-gray-700 font-medium mb-2"
      >
        Old Password:
      </label>
      <input
        type="password"
        id="oldPassword"
        name="oldPassword"
        value={formData.oldPassword}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* New Password */}
    <div>
      <label
        htmlFor="password"
        className="block text-gray-700 font-medium mb-2"
      >
        New Password:
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-md transition-all duration-200"
    >
      Login
    </button>
  </form>

  {/* Success Message */}
  {responseMessage && (
    <div className="mt-5 text-green-600 font-medium text-center">
      {responseMessage}
    </div>
  )}

  {/* Error Message */}
  {error && (
    <div className="mt-5 text-red-600 font-medium text-center">{error}</div>
  )}
</div>

    )
};

export default AgencyResetPassword;