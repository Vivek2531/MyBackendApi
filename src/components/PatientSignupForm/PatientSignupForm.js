import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PatientSignupForm.css';

const PatientSignupForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    dateOfBirth: '',
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
      setError('Passwords do not match!');
      return;
    }

    const patientData = {
      username: formData.username,
      password: formData.password,
      role: formData.role,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      gender: formData.gender,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      address: formData.address,
    };

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${BASE_URL}/api/Patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patientData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Patient registered successfully!');
        navigate('/login');
      } else {
        setError(result.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <h2 className="form-title">Patient Signup</h2>
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
            {error && <p className="error-text">{error}</p>}
            <div className="form-row">
              <label>Date of Birth*:</label>
              <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
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

export default PatientSignupForm;
