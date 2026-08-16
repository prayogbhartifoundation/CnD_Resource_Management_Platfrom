import { useEffect, useState } from "react";
import { getCookie, setCookie } from "../data/cookieHelpers";
import { useLocation } from "react-router-dom";
import axios from "axios";

const UserPopupForm = ({ showForm, setShowForm, formData, setFormData }) => {
  console.log("opening PopUp");
  
  const [isLoginMode, setIsLoginMode] = useState(false); // Toggle between Register & Login
  // const location = useLocation();

  useEffect(() => {
    const paths = ["/inventory"];
    if (!getCookie("userRegistered") && paths.includes(location.pathname)) {
      setShowForm(true);
    }
  }, [setShowForm]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLoginMode) {
        // Login request
        const res = await axios.post("https://cndofftakencr.in/api/user/login", {
          mobile: formData.mobile,
        });

        console.log(res.data);

        if (res.data.success) {
          setCookie("userRegistered", "true", 365);
          setCookie(
            "userRegisteredData",
            JSON.stringify(res.data.user || {}),
            365
          );
          setShowForm(false);
        } else {
          alert(res.data.message || "Login failed");
        }
      } else {
        // Register request
        const res = await axios.post(
          "https://cndofftakencr.in/api/user/register",
          formData
        );

        if (res.data.success) {
          setCookie("userRegistered", "true", 365);

          setCookie(
            "userRegisteredData",
            JSON.stringify(res.data.user || {}),
            365
          );
          setShowForm(false);
        } else {
          alert(res.data.message || "Register failed");
        }
      }
    } catch (err) {
      alert(
        "Submission failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999]">
      <form
        className="bg-white p-6 rounded-xl w-[90%] max-w-sm shadow-xl animate-fadeIn"
        onSubmit={handleSubmit}
      >
        <div className="flex-row justify-between items-center mb-4">
          <h2 className="mb-5 text-xl font-semibold text-gray-800 text-center">
            {isLoginMode ? "Login" : "Register"} to Continue
          </h2>
        </div>

        {/* Show only mobile input in login mode */}
        {isLoginMode ? (
          <div className="mb-3">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile *"
              value={formData.mobile || ""}
              onChange={handleChange}
              required
              className="w-full p-3 text-black border border-gray-300 rounded-md text-base focus:border-orange-500 focus:outline-none"
            />
          </div>
        ) : (
          // Registration fields
          ["name", "mobile", "email", "organisation"].map((field) => (
            <div className="mb-3" key={field}>
              <input
                type="text"
                name={field}
                placeholder={
                  field.charAt(0).toUpperCase() +
                  field.slice(1) +
                  (field !== "organisation" ? " *" : "")
                }
                value={formData[field] || ""}
                onChange={handleChange}
                required={field === "organisation" ? false : true}
                className="w-full p-3 border text-black border-gray-300 rounded-md text-base focus:border-orange-500 focus:outline-none"
              />
            </div>
          ))
        )}

        <button
          type="submit"
          className="w-full p-3 bg-orange-600 text-white rounded-md text-base hover:bg-orange-700 transition"
        >
          {isLoginMode ? "Login" : "Register"}
        </button>

        <br />
        <br />

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setIsLoginMode(!isLoginMode)}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          {isLoginMode
            ? "Need to register? Click here"
            : "Already registered? Login with mobile"}
        </button>


        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="w-full text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Skip
        </button>
        <br />
        <br />
<span className="w-full text-sm text-gray-500 hover:text-gray-700 text-center">* fields are necessary to fill</span>
      </form>
    </div>
  );
};

export default UserPopupForm;
