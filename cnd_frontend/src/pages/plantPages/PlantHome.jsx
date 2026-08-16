import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthorisedPlantHome from "./AuthorisedPlantHome";

const PlantHome = ({usrType, setUsrType, usr, setUsr}) => {

  const [auth, setAuth] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("userType") === "agency" && navigate("/agency-home");
    axios
      .get("https://cndofftakencr.in/api/plantHome")
      .then((res) => {
        console.log(res);

        if (res.data.Status === "Success") {
          setAuth(true);
          setName(res.data.name);
        } else {
          navigate("/Login");
          setAuth(false);
          setMessage(res.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);


    return (
        <div
      style={{
        width: "100%",
      }}
    >
      {auth ? (
        <AuthorisedPlantHome name={name} usrType setUsrType usr setUsr/>
      ) : (
        <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>

          <Link to="/plant-login">Login</Link>
        </div>
      )}
    </div>
    )
};

export default PlantHome;
