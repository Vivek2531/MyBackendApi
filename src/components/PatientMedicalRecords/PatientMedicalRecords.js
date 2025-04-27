import { Component } from 'react';
import { Circles } from 'react-loader-spinner';
import PatientHeader from '../PatientHeader/PatientHeader';
import PatientMedicalRecordCard from '../PatientMedicalRecordCard/PatientMedicalRecordCard';
import './PatientMedicalRecords.css';

class PatientMedicalRecords extends Component {
  state = {
    patients: [],
    loading: true,
  };

  componentDidMount() {
    const patientId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!patientId || !token) {
      console.error("User ID or token not found in localStorage.");
      return;
    }

    const BASE_URL = process.env.REACT_APP_API_URL;

    fetch(`${BASE_URL}/api/MedicalRecord/by-patient/${patientId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch records');
        }
        return res.json();
      })
      .then((data) => {
        this.setState({ patients: data, loading: false });
      })
      .catch((err) => {
        console.error("Error fetching medical records:", err);
        this.setState({ loading: false });
      });
  }

  render() {
    const { patients, loading } = this.state;

    return (
      <>
        <PatientHeader />
        <div className="patient-heading-container">
          <h1 className="patient-heading">Medical Records</h1>
        </div>

        {loading ? (
          <div className="loader-container">
            <Circles height="60" width="60" color="#3b82f6" ariaLabel="loading" />
          </div>
        ) : (
          <div className="patient-home-bg">
            <div className="patient-medical-grid">
              {patients.length > 0 ? (
                <PatientMedicalRecordCard records={patients} />
              ) : (
                <p className="no-records">No medical records found.</p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default PatientMedicalRecords;
