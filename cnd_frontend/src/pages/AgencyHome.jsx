import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthorisedAgencyHome from "../components/AuthorisedAgencyHome";
import axios from "axios";

const AgencyHome = ({ usrType, setUsrType, usr, setUsr }) => {

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("userType") === "plant") {
      navigate("/plant-home");
      return;
    }

    axios.get("https://cndofftakencr.in/api/agencyHome", { withCredentials: true })
      .then((res) => {
        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          setAuth(false);
          setMessage(res.data.Error);
          navigate("/Login");
        }
      })
      .catch((err) => console.log("API error:", err));
  }, [navigate]);

    return (
        <div style={{ width: "100%" }}>
      {/* <AuthorisedAgencyHome name={"A003"} /> */}
      {auth ? (
        <AuthorisedAgencyHome name={name}
          usrType={usrType}
          setUsrType={setUsrType}
          usr={usr}
          setUsr={setUsr}/>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>

          <Link to="/agency-login">Login</Link>
        </div>
      )}
    </div>
    )
};

export default AgencyHome;