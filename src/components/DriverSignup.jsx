
import React, { useState, useEffect } from "react";
import { ref, set, get, child } from "firebase/database";
import "./DriverSignup.css";
import { database } from "./firebase";

const DriverSignup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    address: "",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    driverLicenseNumber: "",
    licenseType: "",
    licenseExpiryDate: "",
    drivingExperience: "",
    ambulanceType: "",
    currentEmployer: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    backgroundCheckAuthorization: false,
  });

  const [documents, setDocuments] = useState({
    driverLicense: null,
    profilePhoto: null,
    vehicleRC: null,
    insuranceDocument: null,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location, setLocation] = useState({ latitude: null, longitude: null });

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
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDocuments({
          ...documents,
          [name]: reader.result,
        });
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.contactNumber ||
      !formData.address ||
      !formData.emergencyContactName ||
      !formData.emergencyContactRelation ||
      !formData.emergencyContactPhone ||
      !formData.driverLicenseNumber ||
      !formData.licenseType ||
      !formData.licenseExpiryDate ||
      !formData.drivingExperience ||
      !formData.ambulanceType ||
      !formData.currentEmployer ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.agreeTerms ||
      !formData.backgroundCheckAuthorization ||
      !documents.driverLicense ||
      !documents.profilePhoto ||
      !documents.vehicleRC ||
      !documents.insuranceDocument
    ) {
      alert("Please fill in all the required fields and upload all documents.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const dbRef = ref(database);
      const driversRef = ref(database, "drivers");

      // Fetch existing drivers
      const snapshot = await get(child(dbRef, "drivers"));

      // Handle case when no data exists in Firebase
      let totalAmbulances = 0;
      if (snapshot.exists()) {
        const data = snapshot.val();
        totalAmbulances = Object.keys(data).length;
      }

      // Generate new ambulance ID
      const ambulanceKey = `ambulance${totalAmbulances + 1}`;

      // Store new driver data
      await set(ref(database, `drivers/${ambulanceKey}`), {
        ...formData,
        documents: documents,
        timestamp: new Date().toISOString(),
        location: location,
      });

      alert(`Registration Successful! Your ID is: ${ambulanceKey}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error in submission, please try again.");
    }
  };

  if (isSubmitted) {
    return (
      <div className="ambulance-signup-container">
        <div className="submission-confirmation">
          <h2>Thank you for registering!</h2>
          <p>We will review your details and contact you soon.</p>
          <p>A confirmation has been sent to your contact number: {formData.contactNumber}</p>
        </div>
      </div>
    );
  }

  return (
  
  <div className="ambulance-signup-container">
  <form onSubmit={handleSubmit} className="ambulance-signup-form">
    <label htmlFor="firstName">First Name:</label>
    <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />

    <label htmlFor="lastName">Last Name:</label>
    <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />

    <label htmlFor="contactNumber">Contact Number:</label>
    <input type="text" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} />

    <label htmlFor="address">Address:</label>
    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} />

    <label htmlFor="emergencyContactName">Emergency Contact Name:</label>
    <input type="text" id="emergencyContactName" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} />

    <label htmlFor="emergencyContactRelation">Emergency Contact Relation:</label>
    <input type="text" id="emergencyContactRelation" name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleChange} />

    <label htmlFor="emergencyContactPhone">Emergency Contact Phone:</label>
    <input type="text" id="emergencyContactPhone" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} />

    <label htmlFor="driverLicenseNumber">Driver License Number:</label>
    <input type="text" id="driverLicenseNumber" name="driverLicenseNumber" value={formData.driverLicenseNumber} onChange={handleChange} />

    <label htmlFor="licenseType">License Type:</label>
    <select id="licenseType" name="licenseType" value={formData.licenseType} onChange={handleChange}>
      <option value="">Select License Type</option>
      <option value="Regular">Regular</option>
      <option value="Commercial">Commercial</option>
      <option value="Heavy Vehicle">Heavy Vehicle</option>
      <option value="Other">Other</option>
    </select>

    <label htmlFor="licenseExpiryDate">License Expiry Date:</label>
    <input type="date" id="licenseExpiryDate" name="licenseExpiryDate" value={formData.licenseExpiryDate} onChange={handleChange} />

    <label htmlFor="drivingExperience">Driving Experience:</label>
    <input type="text" id="drivingExperience" name="drivingExperience" value={formData.drivingExperience} onChange={handleChange} />

    <label htmlFor="ambulanceType">Ambulance Type:</label>
    <select id="ambulanceType" name="ambulanceType" value={formData.ambulanceType} onChange={handleChange}>
      <option value="">Select Ambulance Type</option>
      <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
      <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
      <option value="Patient Transport">Patient Transport</option>
      <option value="Other">Other</option>
    </select>

    <label htmlFor="currentEmployer">Current Employer:</label>
    <input type="text" id="currentEmployer" name="currentEmployer" value={formData.currentEmployer} onChange={handleChange} />

    <label htmlFor="username">Username:</label>
    <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />

    <label htmlFor="password">Password:</label>
    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />

    <label htmlFor="confirmPassword">Confirm Password:</label>
    <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />

    <label htmlFor="driverLicense">Driver's License:</label>
    <input type="file" id="driverLicense" name="driverLicense" onChange={handleFileChange} />

    <label htmlFor="profilePhoto">Profile Photo:</label>
    <input type="file" id="profilePhoto" name="profilePhoto" onChange={handleFileChange} />

    <label htmlFor="vehicleRC">Vehicle RC:</label>
    <input type="file" id="vehicleRC" name="vehicleRC" onChange={handleFileChange} />

    <label htmlFor="insuranceDocument">Insurance Document:</label>
    <input type="file" id="insuranceDocument" name="insuranceDocument" onChange={handleFileChange} />

    <div className="checkbox-group">
      <input type="checkbox" id="agreeTerms" name="agreeTerms" checked={formData.agreeTerms} onChange={handleChange} />
      <label htmlFor="agreeTerms">I Agree to Terms&Conditions</label>
    </div>

    <div className="checkbox-group">
      <input type="checkbox" id="backgroundCheckAuthorization" name="backgroundCheckAuthorization" checked={formData.backgroundCheckAuthorization} onChange={handleChange} />
      <label htmlFor="backgroundCheckAuthorization">Background Check Authorization:</label>
    </div>
    <button type="submit" className="submit-button">Submit</button>
  </form>
</div>
  );
};

export default DriverSignup;
