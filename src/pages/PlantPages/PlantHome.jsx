import React, { useEffect, useState } from 'react'
import AuthorisedPlantHome from './AuthorisedPlantHome';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PlantHome = () => {
    const [auth,setAuth] = useState(false);
    const [message,setMessage] = useState('');
    const [name,setName] = useState('');
    
    axios.defaults.withCredentials = true;
  
    useEffect(()=>{
      axios.get('http://localhost:8081/plantHome')
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
            <AuthorisedPlantHome name={name}/>
             :

             <div>
          <h3>{message}</h3>
          <h3>Login Now</h3>
          
          <Link to="/plant-login">Login</Link>
        </div>
        }
    </div>
  )
}

export default PlantHome