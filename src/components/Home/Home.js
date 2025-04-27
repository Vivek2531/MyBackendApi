import { Component } from 'react';
import Header from '../Header/Header';
import PatientCard from '../PatientCard/PatientCard';
import { Circles } from 'react-loader-spinner';
import './Home.css';

class Home extends Component {
  state = {
    patients: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchPatients();
  }

  fetchPatients = async () => {
    const token = localStorage.getItem("token");
    const BASE_URL = process.env.REACT_APP_API_URL;;

    try {
      const response = await fetch(`${BASE_URL}/api/MedicalRecord/recent`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.status}`);
      }

      const data = await response.json();
      this.setState({ patients: data, loading: false });
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { patients, loading } = this.state;

    return (
      <>
        <Header />
        <div className='heading-container'>
          <h1 className='heading-home'>Patient Details</h1>
        </div>

        {loading ? (
          <div className="loader-wrapper">
            <Circles
              height="60"
              width="60"
              color="#4fa94d"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        ) : (
          <div className="home-bg">
            <div className="patient-grid">
              {patients.map((patient, index) => (
                <PatientCard key={index} patient={patient} />
              ))}
            </div>
          </div>
        )}
      </>
    );
  }
}

export default Home;
