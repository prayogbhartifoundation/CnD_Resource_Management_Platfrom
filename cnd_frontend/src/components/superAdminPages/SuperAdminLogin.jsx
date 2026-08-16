import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SuperAdminLogin = () => {

  //   const [formData, setFormData] = useState({
  //   sAdminId: "S25001",
  //   password: "123",
  // });

  const [formData, setFormData] = useState({
    sAdminId: "",
    password: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();


     useEffect(() => {
    axios
      .get("https://cndofftakencr.in/api/superAdminHome")
      .then((res) => {
        console.log(`res : ${res}`);

        if (res.data.Status === "Success") {
          navigate("/s_admin");
        } else {
        }
      })
      .catch((err) => console.log(err));
  }, [navigate]);
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
        "https://cndofftakencr.in/api/superAdminLogin",
        formData
      );
      console.log(response.data.Status);

      if (response.data.Status === "Success") {
        navigate("/s_admin");
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
        <div className="max-w-sm mx-auto mt-10 mb-10 p-6 border border-gray-300 rounded-xl shadow-sm bg-white">
  <h2 className="text-2xl font-semibold text-[#325A58] text-center">
    Master Admin Login
  </h2>

  <form onSubmit={handleSubmit} className="mt-8 space-y-5">
    {/* Super Admin ID */}
    <div>
      <label
        htmlFor="sAdminId"
        className="block mb-1 text-gray-700 font-medium"
      >
        Master Admin ID:
      </label>
      <input
        type="text"
        id="sAdminId"
        name="sAdminId"
        value={formData.sAdminId}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02AB6A] focus:outline-none text-gray-800"
      />
    </div>

    {/* Password */}
    <div>
      <label
        htmlFor="password"
        className="block mb-1 text-gray-700 font-medium"
      >
        Password:
      </label>
      <input
        type="password"
        id="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#02AB6A] focus:outline-none text-gray-800"
      />
    </div>

    {/* Login Button */}
    <button
      type="submit"
      className="w-full py-2.5 bg-[#02AB6A] text-white font-semibold rounded-lg hover:bg-[#027348] transition"
    >
      Login
    </button>
  </form>

  {/* Success Message */}
  {responseMessage && (
    <div className="mt-4 text-green-600 text-center font-medium">
      {responseMessage}
    </div>
  )}

  {/* Error Message */}
  {error && (
    <div className="mt-4 text-red-600 text-center font-medium">
      {error}
    </div>
  )}
</div>

    )
};

export default SuperAdminLogin;