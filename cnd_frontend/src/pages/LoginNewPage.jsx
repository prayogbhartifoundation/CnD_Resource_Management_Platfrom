import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginNewPage = ({ usrType, setUsrType, usr, setUsr }) => {
  const vnn = localStorage.getItem("vnn") === "true";
  const [userType, setUserType] = useState(vnn ? "agent" : ""); // State to track selected user type

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    agencyId: "",
    plantId: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleAgentLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/agencyLogin",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);

      if (response.data.Status === "Success") {
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("userType", "agency");

        setUsrType("agency");
        setUsr(response.data.user);
        navigate(`/${vnn ? "vnn" : ""}`);
        // navigate("/agency-home");
      }

      if (response.data.Status === "Reset Password") {
        navigate("/reset-password");
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

  const handleMasterLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/masterLogin",
        formData,
        { withCredentials: true }
      );
      console.log(response.data);

      if (response.data.Status === "Success") {

        // alert("Master Login Successful");
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("userType", "master");

        setUsrType("master");
        setUsr(response.data.user);
        navigate(`/${vnn ? "vnn" : ""}`);
        // navigate("/agency-home");
      }

      // if (response.data.Status === "Reset Password") {
      //   navigate("/reset-password");
      // }

      setResponseMessage(response.data.msg);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
      setResponseMessage("");
    }
  };

  const handlePlantLogin = async (e) => {
    e.preventDefault();

    // alert("Plant Login Clicked");

    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/plantLogin",
        formData
      );
      // console.log(response.data.Status);

      if (response.data.Status === "Success") {
        localStorage.setItem("user", response.data.user);
        localStorage.setItem("userType", "plant");
        setUsrType("plant");
        setUsr(response.data.user);
        navigate("/admin");
        // navigate("/plant-home");
      }

      if (response.data.Status === "Reset Password") {
        navigate("/reset-password-plant");
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
    <div className="LoginNewPage  bg-white p-8">
      <header className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Login</h2>
      </header>

      <div className="max-w-sm mx-auto bg-white shadow-md border border-gray-300 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          {userType === "agent"
            ? "Agent Login"
            : userType === "plant"
            ? "Plant Login"
            : "Select User Type"}
        </h2>

        <form
          onSubmit={
            userType === "agent"
              ? handleAgentLogin
              : userType === "master"
              ? handleMasterLogin
              : handlePlantLogin
          }
          className="space-y-4"
        >
          {!vnn && (
            <div className="flex justify-around gap-6 mb-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="plant"
                  onChange={handleUserTypeChange}
                  required
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Plant</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="agent"
                  onChange={handleUserTypeChange}
                  required
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Agency</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="userType"
                  value="master"
                  onChange={handleUserTypeChange}
                  required
                  className="accent-blue-600"
                />
                <span className="text-gray-700">Master Admin</span>
              </label>
            </div>
          )}

          {userType === "master" && (
            <>
              <div>
                <label
                  htmlFor="masterId"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Master Id:
                </label>
                <input
                  type="text"
                  id="masterId"
                  name="masterId"
                  value={formData.masterId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {userType === "agent" && (
            <>
              <div>
                <label
                  htmlFor="agencyId"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Agent ID:
                </label>
                <input
                  type="text"
                  id="agencyId"
                  name="agencyId"
                  value={formData.agencyId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-gray-700"
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          {userType === "plant" && (
            <>
              <div>
                <label
                  htmlFor="plantId"
                  className="block mb-1 text-sm font-medium text-gray-700"
                >
                  Plant ID:
                </label>
                <input
                  type="text"
                  id="plantId"
                  name="plantId"
                  value={formData.plantId}
                  onChange={handleChange}
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="plantPassword"
                  className="block mb-1 text-sm font-medium text-gray-700"
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
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full py-2 bg-green-700 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginNewPage;
