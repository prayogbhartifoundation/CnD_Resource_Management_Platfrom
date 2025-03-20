import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import AuthorisedSuperAdmin from './AuthorisedSuperAdmin';

const SuperAdminHome = () => {

    const [auth,setAuth] = useState(false);
  const [message,setMessage] = useState('');
  const [name,setName] = useState('');
  
  axios.defaults.withCredentials = true;

  useEffect(()=>{
    axios.get('https://cndofftakencr.in/superAdminHome')
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
    <div>
        {
            auth ? 
            <AuthorisedSuperAdmin name={name}/>
             :

             <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          
          <Link to="/s_admin-login">Login</Link>
        </div>
        }
    </div>
  )
}

export default SuperAdminHome