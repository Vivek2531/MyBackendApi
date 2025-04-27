import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DoctorSignupForm.css';

const DoctorSignupForm = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: '',
    hospitalName: '',
    specailty: '',
    age: '',
    gender: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Password and Confirm Password do not match.");
      return;
    }

    const doctorData = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      hospitalName: formData.hospitalName,
      specailty: formData.specailty,
      age: parseInt(formData.age),
      gender: formData.gender,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    };

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${BASE_URL}/api/Doctor`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(doctorData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('✅ Doctor registered successfully!');
        navigate('/login');
      } else {
        setError(result.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error(err);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header"></div>
      <div className="content">
        <h2 className="form-title">Doctor Signup</h2>
        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label>Username*:</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Password*:</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <label>Confirm Password*:</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
            {error && <p className="error-text" style={{ color: 'red', fontWeight: 500 }}>{error}</p>}
            <div className="form-row">
              <label>Role:</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Hospital Name:</label>
              <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Specialty:</label>
              <input type="text" name="specailty" value={formData.specailty} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Age:</label>
              <input type="number" name="age" value={formData.age} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Gender:</label>
              <input type="text" name="gender" value={formData.gender} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Phone Number:</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Address:</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <button type="submit" className="submit-button">Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DoctorSignupForm;
