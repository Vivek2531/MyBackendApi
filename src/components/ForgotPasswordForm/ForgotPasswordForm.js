import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordForm.css';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${BASE_URL}/login/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Password reset successfully.');
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      } else {
        setError(data.message || 'Failed to reset password.');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="header" />
      <div className="content">
        <h2 className="form-title">Forgot Password</h2>
        <div className="form-container">
          <form className="signup-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="email">Email*:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="password">New Password*:</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="confirmPassword">Confirm Password*:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}
            {success && <p className="success-text">{success}</p>}

            <button type="submit" className="submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
