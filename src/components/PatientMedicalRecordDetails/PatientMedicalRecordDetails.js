// PatientMedicalRecordDetails.js
import { Component } from 'react';
import { useParams } from 'react-router-dom';
import './PatientMedicalRecordDetails.css';

// HOC for class components to use URL params
function withParams(Component) {
  return props => <Component {...props} params={useParams()} />;
}

class PatientMedicalRecordDetails extends Component {
  state = {
    record: null,
  };

  componentDidMount() {
    const { id } = this.props.params;

    // Simulated API response
    const dummyData = [
      {
        date: '2025-04-01',
        illness: 'Flu',
        doctor: 'Dr. Emily Stone',
        symptoms: 'Fever, chills, fatigue',
        updated: '2025-04-08',
        allergies: 'None',
        treatment: 'Rest, fluids, antiviral meds',
        prescription: 'Tamiflu',
        hospital: 'City Health Hospital',
        address: '123 Wellness St, Louisville, KY'
      }
      // Add more dummy data as needed
    ];

    this.setState({ record: dummyData[id] });

    // Real API call usage (to be uncommented later):
    // fetch(`/api/patient/record/${id}`)
    //   .then(res => res.json())
    //   .then(data => this.setState({ record: data }))
    //   .catch(err => console.error(err));
  }

  render() {
    const { record } = this.state;

    return (
      <div className="record-details-container">
        <h1>Patient Medical Record</h1>
        {record ? (
          <div className="record-details">
            <p><strong>Date:</strong> {record.date}</p>
            <p><strong>Illness:</strong> {record.illness}</p>
            <p><strong>Doctor Name:</strong> {record.doctor}</p>
            <p><strong>Symptoms:</strong> {record.symptoms}</p>
            <p><strong>Last Updated:</strong> {record.updated}</p>
            <p><strong>Allergies:</strong> {record.allergies}</p>
            <p><strong>Treatment:</strong> {record.treatment}</p>
            <p><strong>Prescription:</strong> {record.prescription}</p>
            <p><strong>Hospital Name:</strong> {record.hospital}</p>
            <p><strong>Hospital Address:</strong> {record.address}</p>
          </div>
        ) : (
          <p>Loading or record not found...</p>
        )}
      </div>
    );
  }
}

export default withParams(PatientMedicalRecordDetails);
