import React, { useState, useEffect } from 'react';
import { getDatabase, ref, get, update } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  
  const navigate = useNavigate(); 

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const database = getDatabase();
      const driverRef = ref(database, `drivers`);
      const snapshot = await get(driverRef);

      if (!snapshot.exists()) {
        setError('No drivers found.');
        return;
      }

      let driverData = null;
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        if (data.contactNumber === mobileNumber) {
          driverData = { key: childSnapshot.key, ...data };
        }
      });

      if (!driverData) {
        setError('Driver not found.');
        return;
      }

      if (driverData.password !== password) {
        setError('Incorrect password.');
        return;
      }

   
      if (location.latitude && location.longitude) {
        const driverLocationRef = ref(database, `drivers/${driverData.key}`);
        await update(driverLocationRef, {
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        });
      }

      alert('Login successful! Your location has been updated.');
      navigate('/MapforAmbulance'); 

    } catch (firebaseError) {
      console.error('Login error:', firebaseError);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-heading">
          Book Ambulance Services for event with <span className="highlight">Best Facility</span>
        </h1>
        <div className="decorative-shapes">
          <div className="pink-square"></div>
          <div className="blue-square"></div>
        </div>
      </div>
      <div className="login-right">
        <h2 className="login-title">🚑 Log in Rapid Rescue 🚑</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your Contact No."
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="privacy-note">We'll never share your Number with anyone else.</p>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="submit-button">SUBMIT</button>
          <Link to='/DriverSignup'>
            <button type="button" className="driver-button">DRIVER SIGNUP</button>
          </Link>
        </form>
        <div className="footer">
          <p>Copyright © Medulance. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

