import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './EditHealthRecord.css';

const EditHealthRecord = () => {
  const token = localStorage.getItem("token");
  const { recordId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    diagnosis: '',
    treatment: '',
    prescription: '',
    isEditable: true,
    dateCreated: '',
    lastUpdated: '',
    patientId: '',
    doctorId: '',
    patientName: '', // ✅ Added patientName to form state
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = process.env.REACT_APP_API_URL;

        const res = await fetch(`${BASE_URL}/api/MedicalRecord/${recordId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const data = await res.json();

        setForm({
          diagnosis: data.diagnosis || '',
          treatment: data.treatment || '',
          prescription: data.prescription || '',
          isEditable: data.isEditable ?? true,
          dateCreated: data.dateCreated || '',
          lastUpdated: data.lastUpdated || '',
          patientId: data.patientId || '',
          doctorId: data.doctorId || '',
          patientName: data.patientName || '',
        });

        setLoading(false);
      } catch (err) {
        console.error('Error fetching record:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [recordId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedRecord = {
      ...form,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const BASE_URL = process.env.REACT_APP_API_URL;

      await fetch(`${BASE_URL}/api/MedicalRecord/${recordId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedRecord),
      });

      navigate('/doctor/healthrecords');
    } catch (error) {
      console.error('Error updating record:', error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="add-record-container">
      <h2>Edit Health Record</h2>
      <form className="add-record-form" onSubmit={handleSubmit}>

      <input
          name="patientName"
          value={form.patientName}
          onChange={handleChange}
          placeholder="Patient Name"
          required
        />
        <input
          name="diagnosis"
          value={form.diagnosis}
          onChange={handleChange}
          placeholder="Diagnosis"
          required
        />
        <input
          name="treatment"
          value={form.treatment}
          onChange={handleChange}
          placeholder="Treatment"
          required
        />
        <input
          name="prescription"
          value={form.prescription}
          onChange={handleChange}
          placeholder="Prescription"
          required
        />
        <input
          name="patientId"
          value={form.patientId}
          onChange={handleChange}
          placeholder="Patient ID"
          required
        />
        <input
          name="doctorId"
          value={form.doctorId}
          onChange={handleChange}
          placeholder="Doctor ID"
          required
        />

        <button type="submit" className="submit-button">Update Record</button>
      </form>
    </div>
  );
};

export default EditHealthRecord;