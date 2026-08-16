import axios from "axios";
import { useEffect, useState } from "react";
import AuthorisedSuperAdmin from "./AuthorisedSuperAdmin";
import { Link } from "react-router-dom";

const SuperAdminHome = () => {

     const [auth,setAuth] = useState(false);
  const [message,setMessage] = useState('');
  const [name,setName] = useState('');
  
  axios.defaults.withCredentials = true;

  useEffect(()=>{
    axios.get('https://cndofftakencr.in/api/superAdminHome')
        .then(res => {

            console.log(`res : ${res}`);
            
            
            if(res.data.Status === "Success"){
              
              setAuth(true)  
              setName(res.data.name)
              // navigate('/login')
            } else {
              setAuth(false)  
              setMessage(res.data.Error)
            }
        })
        .catch(err => console.log(err))
  },[])


    return (
        <div className="w-full flex flex-col items-center justify-center py-10">
  {auth ? (
    <AuthorisedSuperAdmin name={name} />
  ) : (
    <div className="text-center bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-sm w-full">
      <h3 className="text-lg font-semibold text-[#325A58]">{message}</h3>

      <h3 classclassName="text-xl font-bold text-gray-800 mt-3">
        Login Now
      </h3>

      <Link
        to="/s_admin-login"
        className="inline-block mt-5 px-6 py-2 text-white bg-[#02AB6A] rounded-lg font-medium hover:bg-[#027348] transition"
      >
        Login
      </Link>
    </div>
  )}
</div>

    )
}

export default SuperAdminHome