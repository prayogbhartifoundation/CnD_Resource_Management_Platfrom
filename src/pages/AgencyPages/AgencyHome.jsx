import axios from 'axios';
import React, { useEffect, useState } from 'react'
import AuthorisedAgencyHome from './AuthorisedAgencyHome';
import { Link } from 'react-router-dom';

const AgencyHome = () => {

    const [auth,setAuth] = useState(false);
    const [message,setMessage] = useState('');
    const [name,setName] = useState('');
    
    axios.defaults.withCredentials = true;
  
    useEffect(()=>{
      axios.get('http://localhost:8081/agencyHome')
          .then(res => {
  
              console.log(res);
              
              
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
            <AuthorisedAgencyHome name={name}/>
             :

             <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          
          <Link to="/agency-login">Login</Link>
        </div>
        }
    </div>
  )
}

export default AgencyHome