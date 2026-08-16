import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const AuthorisedAgencyHome = ({ name, usrType, setUsrType, usr, setUsr }) => {
  const [plantData, setPlantData] = useState([]);
  const [agency, setAgency] = useState([]);
  const defaultForm = {
    location: "",
    contact: "",
    contactEmail: "",
    phone: "",
    installedWasteCap: 0,
  };

  const [formData, setFormData] = useState(defaultForm);
  const [editMode, setEditMode] = useState(false);

  const [detailFormData, setDetailFormData] = useState({
    incharge: "",
    contactEmail: "",
    contactDetails: [{ name: "", email: "", phone: "", designation: "" }],
  });

  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  const [newsMessage, setNewsMessage] = useState("");
  const [newsResponse, setNewsResponse] = useState("");
  const [newsList, setNewsList] = useState([]);

  const vnn = localStorage.getItem("vnn") === "true";

  const navigate = useNavigate();

  const handleNewsSubmit = async () => {
    try {
      const response = await axios.post("https://cndofftakencr.in/api/addNews", {
        message: newsMessage,
        sender: name,
      });
      setNewsResponse("News submitted successfully!");
      setNewsMessage("");
    } catch (err) {
      setNewsResponse("Error submitting news.");
      console.error(err);
    }
  };

  useEffect(() => {
    axios
      .get("https://cndofftakencr.in/api/getPlants")
      .then((res) => {
        if (res.data.Status === "Success") {
          setPlantData(res.data.data.filter((p) => p.agencyId === name));
        }
      })
      .catch((err) => console.log(err));

    const fetchNews = async () => {
      try {
        const response = await axios.get("https://cndofftakencr.in/api/getNews");
        setNewsList(response.data.data);
      } catch (err) {
        console.error("Failed to fetch news", err);
      }
    };

    fetchNews();
  }, [responseMessage]);

  useEffect(() => {
    const fetchAgencyData = async () => {
      try {
        const response = await axios.get(
          `https://cndofftakencr.in/api/getAgency/${name}`
        );
        const agency = response.data.data[0];
        setAgency(agency);

        setDetailFormData({
          incharge: agency.incharge || "",
          contactEmail: agency.contactEmail || "",
          contactDetails: agency.contactDetails?.length
            ? agency.contactDetails
            : [{ name: "", email: "", phone: "", designation: "" }],
        });
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch agency data.");
      }
    };

    fetchAgencyData();
  }, [name, responseMessage]);

  // --- Helper Functions ---
  const handleAddContactRow = () => {
    setDetailFormData((prevData) => ({
      ...prevData,
      contactDetails: [
        ...prevData.contactDetails,
        { name: "", email: "", phone: "", designation: "" },
      ],
    }));
  };

  const handleDeleteContactRow = (index) => {
    setDetailFormData((prev) => {
      const updated = [...prev.contactDetails];
      updated.splice(index, 1);
      return {
        ...prev,
        contactDetails:
          updated.length > 0
            ? updated
            : [{ name: "", email: "", phone: "", designation: "" }],
      };
    });
  };

  const handleContactRowChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...detailFormData.contactDetails];
    updated[index][name] = value;
    setDetailFormData((prev) => ({ ...prev, contactDetails: updated }));
  };

  const handleDetChange = (e) => {
    const { name, value } = e.target;
    setDetailFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...plantData];
    updated[index][field] = value;
    setPlantData(updated);
  };

  const updatePlantInfo = async (plantId, plant) => {
    try {
      const {
        contact,
        contactEmail,
        phone,
        installedWasteCap,
        mapLoc,
        vidLink,
        address
      } = plant;
      const res = await axios.put(
        `https://cndofftakencr.in/api/updatePlant/${plantId}`,
        { contact, contactEmail, phone, installedWasteCap, mapLoc, vidLink, address }
      );
      alert(res.data.msg);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://cndofftakencr.in/api/plantRegister",
        { ...formData, agencyId: name }
      );
      setResponseMessage(response.data.msg);
      setError(null);
      setFormData(defaultForm);
    } catch (err) {
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
      setResponseMessage("");
    }
  };

  const handleDetSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        "https://cndofftakencr.in/api/update_plantOperator",
        { ...detailFormData, agencyId: name }
      );
      setResponseMessage(response.data.message);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setResponseMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userType");
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    });
    setUsrType(null);
    setUsr(null);

    // Redirect to login or homepage
    navigate(`/${vnn ? "vnn" : ""}`); // Adjust the path as needed
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Logout */}
      <button
        onClick={handleLogout}
        className="self-end bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
      >
        Logout
      </button>

      {/* Agency Info Form */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <form onSubmit={handleDetSubmit}>
          <div className="flex flex-col gap-3 mb-4">
            <span className="font-semibold text-lg">Agency ID: {name}</span>
            <span>{agency.agencyId ? agency.agency : "--"}</span>
            <Link
              to="/productImgUpload"
              className="text-blue-600 underline hover:text-blue-800"
            >
              Update Product Images
            </Link>
          </div>

          {responseMessage && (
            <p className="text-green-600">
              {responseMessage}{" "}
              <span
                onClick={() => setResponseMessage("")}
                className="cursor-pointer ml-1"
              >
                ❌
              </span>
            </p>
          )}
          {error && <p className="text-red-500">{error}</p>}

          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="font-medium mb-1">Agency Incharge Name</label>
              <input
                type="text"
                name="incharge"
                value={detailFormData.incharge}
                onChange={handleDetChange}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="flex flex-col flex-1 min-w-[300px]">
              <label className="font-medium mb-1">Agency Incharge Email</label>
              <input
                type="text"
                name="contactEmail"
                value={detailFormData.contactEmail}
                onChange={handleDetChange}
                className="border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>

          <h3 className="mt-6 font-semibold text-lg">Contacts List</h3>
          <table className="w-full mt-3 border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Designation</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {detailFormData.contactDetails.map((contact, index) => (
                <tr key={index}>
                  {["name", "email", "phone", "designation"].map((field) => (
                    <td key={field} className="border p-2">
                      <input
                        type="text"
                        name={field}
                        value={contact[field]}
                        onChange={(e) => handleContactRowChange(index, e)}
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    </td>
                  ))}
                  <td className="border p-2 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteContactRow(index)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            type="button"
            onClick={handleAddContactRow}
            className="mt-2 text-blue-600 hover:underline"
          >
            + Add Contact
          </button>

          <button
            type="submit"
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Save
          </button>
        </form>
      </div>

      {/* Plants Section with Edit Mode */}
      {agency?.role !== "view" && (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-lg">
              Plants under {agency?.agency}
            </h3>
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600"
            >
              {editMode ? "Disable Editing" : "Enable Editing"}
            </button>
          </div>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Plant ID</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Contact</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Phone</th>
                <th className="p-2 border">Waste Cap. (MT)</th>
                <th className="p-2 border">Address</th>
                <th className="p-2 border">Map Location</th>
                <th className="p-2 border">Plant Video</th>
                {editMode && <th className="p-2 border">Action</th>}
              </tr>
            </thead>
            <tbody>
              {plantData.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2">{p.plantId || "--"}</td>
                  <td className="border p-2">{p.location || "--"}</td>
                  {[
                    "contact",
                    "contactEmail",
                    "phone",
                    "installedWasteCap",
                  ].map((field) => (
                    <td key={field} className="border p-2">
                      {editMode ? (
                        <input
                          type={field.includes("Email") ? "email" : "text"}
                          value={p[field] || ""}
                          onChange={(e) =>
                            handleFieldChange(i, field, e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      ) : (
                        p[field] || "--"
                      )}
                    </td>
                  ))}

                  <td className="border p-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={p.address || ""}
                        onChange={(e) =>
                          handleFieldChange(i, "address", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      p.address ? "Address Available" : "--"
                    )}
                  </td>
                  <td className="border p-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={p.mapLoc || ""}
                        onChange={(e) =>
                          handleFieldChange(i, "mapLoc", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <a
                        href={p.mapLoc}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Map Link
                      </a>
                    )}
                  </td>
                  <td className="border p-2">
                    {editMode ? (
                      <input
                        type="text"
                        value={p.vidLink || ""}
                        onChange={(e) =>
                          handleFieldChange(i, "vidLink", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded px-2 py-1"
                      />
                    ) : (
                      <a
                        href={p.vidLink}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Video Link
                      </a>
                    )}
                  </td>

                  
                  {editMode && (
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => updatePlantInfo(p.plantId, p)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                      >
                        Save
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AuthorisedAgencyHome;
