import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddHealthRecord.css';

const AddHealthRecord = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    patientId: '',
    doctorId: '',
    patientName: ''
  });

  const [patientIds, setPatientIds] = useState([]);
  const [doctorIds, setDoctorIds] = useState([]);

  useEffect(() => {
    const BASE_URL = process.env.REACT_APP_API_URL;

    const fetchIds = async () => {
      try {
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const [patientsResponse, doctorsResponse] = await Promise.all([
          fetch(`${BASE_URL}/api/patient/ids`, { headers }),
          fetch(`${BASE_URL}/api/doctor/ids`, { headers })
        ]);

        if (!patientsResponse.ok || !doctorsResponse.ok) {
          throw new Error("Unauthorized or failed to fetch IDs");
        }

        const patientData = await patientsResponse.json();
        const doctorData = await doctorsResponse.json();

        setPatientIds(patientData);
        setDoctorIds(doctorData);
      } catch (err) {
        console.error("Failed to fetch IDs", err);
        alert("Failed to fetch doctor or patient IDs. Please ensure you're logged in.");
      }
    };

    if (token) {
      fetchIds();
    }
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recordData = {
      dateCreated: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      diagnosis: form.diagnosis,
      treatment: form.treatment,
      prescription: form.prescription,
      isEditable: true,
      patientName: form.patientName,
      patientId: parseInt(form.patientId),
      doctorId: parseInt(form.doctorId),
    };

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(`${BASE_URL}/api/MedicalRecord`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(recordData),
      });

      if (response.ok) {
        navigate('/doctor/healthrecords');
      } else {
        const errorData = await response.json();
        if (
          errorData.message?.toLowerCase().includes('patient') ||
          errorData.message?.toLowerCase().includes('doctor')
        ) {
          alert("Invalid Patient ID or Doctor ID. Please check and try again.");
        } else {
          alert("Failed to add health record. Please try again.");
        }
        console.error('Failed to add record:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
      alert("DoctorId or PatientId is wrong. Try with another one.");
    }
  };

  return (
    <div className="add-record-container">
      <h2>Add New Health Record</h2>
      <form className="add-record-form" onSubmit={handleSubmit}>
        <input name="patientName" placeholder="Patient Name" onChange={handleChange} required />
        <input name="diagnosis" placeholder="Diagnosis" onChange={handleChange} required />
        <input name="treatment" placeholder="Treatment" onChange={handleChange} required />
        <input name="prescription" placeholder="Prescription" onChange={handleChange} required />

        <select name="patientId" value={form.patientId} onChange={handleChange} required>
          <option value="">Select Patient ID</option>
          {patientIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

        <select name="doctorId" value={form.doctorId} onChange={handleChange} required>
          <option value="">Select Doctor ID</option>
          {doctorIds.map(id => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

        <button className="submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddHealthRecord;