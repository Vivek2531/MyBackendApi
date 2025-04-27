import { Component } from 'react';
import Header from '../Header/Header';
import HealthRecordCard from '../HealthRecordCard/HealthRecordCard';
import { Circles } from 'react-loader-spinner';
import './HealthRecord.css';
import { Link } from 'react-router-dom';

class HealthRecord extends Component {
  state = {
    searchQuery: '',
    patients: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchMedicalRecords('');
  }

  // Fetch records with token
  fetchMedicalRecords = async (query = '') => {
    this.setState({ loading: true });

    const token = localStorage.getItem("token");
    const BASE_URL = process.env.REACT_APP_API_URL;
        const endpoint = query
      ? `/api/MedicalRecord/search/${encodeURIComponent(query)}`
      : `/api/MedicalRecord`;

    const url = `${BASE_URL}${endpoint}`;
    console.log("Calling URL:", url);

    try {
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ patients: data, loading: false });
    } catch (error) {
      console.error('Error fetching medical records:', error.message);
      this.setState({ loading: false });
    }
  };

  handleSearchChange = (event) => {
    const query = event.target.value;
    this.setState({ searchQuery: query });
    this.fetchMedicalRecords(query);
  };

  handleDelete = async (recordId) => {
    const token = localStorage.getItem("token");
    const BASE_URL = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${BASE_URL}/api/MedicalRecord/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to delete record: ${response.status}`);
      }

      this.fetchMedicalRecords('');
    } catch (error) {
      console.error('Error deleting patient:', error.message);
    }
  };

  render() {
    const { patients, searchQuery, loading } = this.state;

    const filteredPatients = searchQuery
      ? patients.filter(
          (patient) =>
            patient.patientName &&
            patient.patientName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : patients;

    return (
      <>
        <Header />
        <div className='heading-container'>
          <div className="left-heading">
            <h1 className='heading-healthrecord'>Health Records</h1>
          </div>
          <div className="search-add-container">
            <input
              type="text"
              placeholder="Search by name..."
              className="search-input"
              value={searchQuery}
              onChange={this.handleSearchChange}
            />
            <Link to="/healthrecords/add">
              <button className="add-button">Add Record</button>
            </Link>
          </div>
        </div>

        <div className="home-bg">
          {loading ? (
            <div className="loader-wrapper">
              <Circles height="70" width="70" color="#3b82f6" ariaLabel="loading" />
            </div>
          ) : (
            <div className="patient-grid">
              {filteredPatients.map((patient, index) => (
                <HealthRecordCard
                  key={index}
                  patient={patient}
                  onDelete={this.handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </>
    );
  }
}

export default HealthRecord;
