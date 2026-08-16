import axios from "axios";
import { useEffect, useState } from "react";

const AuthorisedSuperAdmin = ({ name }) => {
  const [agencyData, setAgencyData] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  const defaultForm = {
    agency: "",
    location: "",
    contact: "",
    contactEmail: "",
    role: "",
  };

  const [formData, setFormData] = useState(defaultForm);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");

  // NEW STATES FOR COLLAPSIBLE PANELS
  const [showHomeSettings, setShowHomeSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);
  const [showQueries, setShowQueries] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // NEW FORM STATES FOR HOME PAGE DATA
  const [notification, setNotification] = useState("");
  const [overview, setOverview] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminMobile, setAdminMobile] = useState("");

  useEffect(() => {
  axios
    .get("https://cndofftakencr.in/api/user/all")
    .then((res) => {
      if (res.data.success) {
        setRegisteredUsers(res.data.users);
      }
    })
    .catch((err) => console.log(err));
}, []);

  useEffect(() => {
    axios
      .get("https://cndofftakencr.in/api/getAgencies")
      .then((res) => {
        if (res.data.Status === "Success") {
          setAgencyData(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  }, [responseMessage]);

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
        "https://cndofftakencr.in/api/agencyRegister",
        formData
      );

      setResponseMessage(response.data.msg);
      setError(null);
      setFormData(defaultForm);
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred. Please try again.");
      setResponseMessage("");
    }
  };
 
 

const handleHomeSubmit = async (e) => {
  e.preventDefault();

  try {
    const payload = {
      notification,
      overview,
      email: adminEmail,
      mobile: adminMobile,
    };

    const res = await axios.post("https://cndofftakencr.in/api/util_update", payload);

    if (res.data.Status === "Success") {
      alert(res.data.Message);

      setNotification("");
      setOverview("");
      setAdminEmail("");
      setAdminMobile("");
    } else {
      alert("Something went wrong");
    }
  } catch (error) {
    console.error(error);
    alert("Server error while saving settings");
  }
};

const handleLogout = async () => {
  try {
    await axios.get("https://cndofftakencr.in/api/superAdminLogout", {
      withCredentials: true,
    });

    window.location.href = "/s_admin-login";  // Redirect to login page
  } catch (err) {
    console.log(err);
    alert("Logout failed. Try again.");
  }
};

  return (
    <>
    <div className="flex justify-end">
  <button
    onClick={handleLogout}
    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
  >
    Logout
  </button>
</div>
    <div className="authorisedHome flex flex-col gap-10 p-6">

      {/* =============== EXISTING FORM SECTION =============== */}
      <div className="section1 w-full bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Agency Name:</label>
            <input
              type="text"
              name="agency"
              value={formData.agency}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Location:</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Contact Person:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Contact Email:</label>
            <input
              type="text"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">Role:</label>
            <input
              type="text"
              name="role"
              value="agency"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg"
            />
          </div>

          <button className="px-6 py-2 bg-[#02AB6A] text-white rounded-lg">
            Register
          </button>
        </form>
        {error && <div className="mt-4 text-red-600">{error}</div>}
      </div>

      {/* =============== EXISTING AGENCY TABLE SECTION =============== */}
      <div className="section2 w-full">
        <div className="overflow-x-auto">
          <table className="w-[95%] mx-auto border-collapse">
            <thead>
              <tr className="bg-yellow-300">
                <th className="border border-black px-2 py-1">Agency ID</th>
                <th className="border border-black px-2 py-1">Agency</th>
                <th className="border border-black px-2 py-1">Contact</th>
                <th className="border border-black px-2 py-1">Email</th>
                <th className="border border-black px-2 py-1">Plants</th>
                <th className="border border-black px-2 py-1">% MoHUA</th>
              </tr>
            </thead>
            <tbody>
              {agencyData.map((a, i) => (
                <tr key={i}>
                  <td className="border border-black px-2 py-1">{a.agencyId}</td>
                  <td className="border border-black px-2 py-1">{a.agency}</td>
                  <td className="border border-black px-2 py-1">{a.contact}</td>
                  <td className="border border-black px-2 py-1">{a.contactEmail}</td>
                  <td className="border border-black px-2 py-1">
                    {a.plants ? a.plants.length : 0}
                  </td>
                  <td className="border border-black px-2 py-1">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ====================================================== */}
      {/* =============== NEW COLLAPSIBLE PANELS =============== */}
      {/* ====================================================== */}

      {/* HOME PAGE SETTINGS PANEL */}
      <div className="w-full bg-white border border-gray-300 rounded-lg shadow-sm p-4">
        <button
          onClick={() => setShowHomeSettings(!showHomeSettings)}
          className="w-full text-left font-semibold text-lg p-2"
        >
          ▸ Home Page Settings
        </button>

        {showHomeSettings && (
          <div className="mt-4 space-y-4">

            <div>
              <label className="block mb-1 font-medium">Notification:</label>
              <textarea
                value={notification}
                onChange={(e) => setNotification(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Overview:</label>
              <textarea
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Email:</label>
              <input
                type="text"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Mobile:</label>
              <input
                type="text"
                value={adminMobile}
                onChange={(e) => setAdminMobile(e.target.value)}
                className="w-full border rounded p-2"
              />
            </div>

            <button
              onClick={handleHomeSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg"
            >
              Save Settings
            </button>
          </div>
        )}
      </div>

      {/* CONTACT TABLE PANEL */}
      {showContacts && (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full border border-gray-300 border-collapse text-sm">
      <thead className="bg-blue-100">
        <tr>
          <th className="border px-2 py-1">#</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Mobile</th>
          <th className="border px-2 py-1">Message</th>
          <th className="border px-2 py-1">Date</th>
        </tr>
      </thead>

      <tbody>
        {/* STATIC DUMMY ROWS — replace later after API */}
        {[1, 2, 3].map((i) => (
          <tr key={i} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{i}</td>
            <td className="border px-2 py-1">John Doe</td>
            <td className="border px-2 py-1">john@example.com</td>
            <td className="border px-2 py-1">9876543210</td>
            <td className="border px-2 py-1">Sample contact message</td>
            <td className="border px-2 py-1">10/02/2025</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* VISITORS PANEL */}
     {showVisitors && (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full border border-gray-300 border-collapse text-sm">
      <thead className="bg-green-100">
        <tr>
          <th className="border px-2 py-1">#</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Purpose</th>
          <th className="border px-2 py-1">Visit Date</th>
          <th className="border px-2 py-1">Doctor</th>
          <th className="border px-2 py-1">Status</th>
        </tr>
      </thead>

      <tbody>
        {["Approved", "Pending", "Rejected"].map((status, i) => (
          <tr key={i} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{i + 1}</td>
            <td className="border px-2 py-1">Visitor Name</td>
            <td className="border px-2 py-1">Consultation</td>
            <td className="border px-2 py-1">12/02/2025</td>
            <td className="border px-2 py-1">Dr. Sharma</td>
            <td
              className={`border px-2 py-1 font-semibold ${
                status === "Approved"
                  ? "text-green-600"
                  : status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }`}
            >
              {status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* PRODUCT QUERY PANEL */}
     {showQueries && (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full border border-gray-300 border-collapse text-sm">
      <thead className="bg-orange-100">
        <tr>
          <th className="border px-2 py-1">#</th>
          <th className="border px-2 py-1">Product</th>
          <th className="border px-2 py-1">Agency</th>
          <th className="border px-2 py-1">Plant</th>
          <th className="border px-2 py-1">User Name</th>
          <th className="border px-2 py-1">Mobile</th>
          <th className="border px-2 py-1">Date</th>
        </tr>
      </thead>

      <tbody>
        {[1, 2, 3].map((i) => (
          <tr key={i} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{i}</td>
            <td className="border px-2 py-1">RCC Block 6"</td>
            <td className="border px-2 py-1">Indo Enviro</td>
            <td className="border px-2 py-1">Shastri Park</td>
            <td className="border px-2 py-1">Amit Kumar</td>
            <td className="border px-2 py-1">9876543210</td>
            <td className="border px-2 py-1">15/02/2025</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

<button
  onClick={() => setShowUsers(!showUsers)}
  className="w-full text-left font-semibold text-lg p-2"
>
  ▸ Registered Users
</button>

{showUsers && (
  <div className="mt-4 overflow-x-auto">
    <table className="w-full border border-gray-300 border-collapse text-sm">
      <thead className="bg-purple-100">
        <tr>
          <th className="border px-2 py-1">#</th>
          <th className="border px-2 py-1">Name</th>
          <th className="border px-2 py-1">Email</th>
          <th className="border px-2 py-1">Mobile</th>
          <th className="border px-2 py-1">Organisation</th>
          <th className="border px-2 py-1">Registered On</th>
        </tr>
      </thead>

      <tbody>
        {registeredUsers.map((user, index) => (
          <tr key={user._id} className="hover:bg-gray-100">
            <td className="border px-2 py-1">{index + 1}</td>
            <td className="border px-2 py-1">{user.name}</td>
            <td className="border px-2 py-1">{user.email}</td>
            <td className="border px-2 py-1">{user.mobile}</td>
            <td className="border px-2 py-1">{user.organisation}</td>
            <td className="border px-2 py-1">
              {new Date(user.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}



    </div>
    </>
  );
};

export default AuthorisedSuperAdmin;
