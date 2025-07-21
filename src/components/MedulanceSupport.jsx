import React from 'react';
import { Link } from 'react-router-dom';
import './MedulanceSupport.css';

const MedulanceSupport = () => {
  return (
    <div className="support-container">
      <div className="support-header">
        <div className="value-added">Value-added</div>
        <h1 className="support-title">Customer Support</h1>
        <p className="support-description">
          Medulance provides GPS Enabled ambulances that are stationed 24*7, at the client's office premises and ready to serve the client during any emergency, these ambulances can take the patient to the nearest hospital within 10 mins in tier 1 cities.
        </p>
      </div>

      <div className="features-container">
        <div className="feature-card">
          <div className="feature-image-container">
            <img src="https://medulance.com/assets/images/faster-than-ever.svg" alt="Faster than ever" className="feature-image" />
          </div>
          <h3 className="feature-title">Faster than ever</h3>
          <p className="feature-description">
            Medulance aims to provide medical support to patients in the shortest time possible.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-image-container">
            <img src="https://medulance.com/assets/images/choose-right-one.svg" alt="Choose the Right one" className="feature-image" />
          </div>
          <h3 className="feature-title">Choose the Right one</h3>
          <p className="feature-description">
            We assist you in selecting the right ambulance that suits your need.
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-image-container">
            <img src="https://medulance.com/assets/images/lingual-diversity.svg" alt="Lingual Diversity" className="feature-image" />
          </div>
          <h3 className="feature-title">Lingual Diversity</h3>
          <p className="feature-description">
            We are equipped with a multi-linguistic approach to sync in with your tone (Hindi, Telugu, Kannada and Bengali).
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-image-container">
            <img src="https://medulance.com/assets/images/free-toll-number.svg" alt="Free Toll Number" className="feature-image" />
          </div>
          <h3 className="feature-title">Free Toll Number</h3>
          <p className="feature-description">
            Enquire about our services and for pre-book option on our toll number
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedulanceSupport;