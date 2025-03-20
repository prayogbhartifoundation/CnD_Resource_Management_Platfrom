import axios from 'axios';
import React, { useState } from 'react'

const SuperAdminReg = () => {
    const [formData, setFormData] = useState({
        sAdminId: '',
        password: '',
      });
    
      const [responseMessage, setResponseMessage] = useState('');
      const [error, setError] = useState(null);
    
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
          const response = await axios.post('https://cndofftakencr.in/api/superAdminRegister', formData);
          console.log(response);
          
          setResponseMessage(response.data.msg);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.msg || 'An error occurred. Please try again.');
          setResponseMessage('');
        }
      };
    
      return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <h2>Super Admin Registration</h2>
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="sAdminId" style={{ display: 'block', marginBottom: '5px' }}>Super Admin ID:</label>
              <input
                type="text"
                id="sAdminId"
                name="sAdminId"
                value={formData.sAdminId}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
    
            <div style={{ marginBottom: '15px' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
              />
            </div>
    
            <button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', background: '#007bff', color: '#fff', cursor: 'pointer' }}>
              Register
            </button>
          </form>
    
          {responseMessage && (
            <div style={{ marginTop: '20px', color: 'green' }}>
              {responseMessage}
            </div>
          )}
    
          {error && (
            <div style={{ marginTop: '20px', color: 'red' }}>
              {error}
            </div>
          )}
        </div>
      );
}

export default SuperAdminReg