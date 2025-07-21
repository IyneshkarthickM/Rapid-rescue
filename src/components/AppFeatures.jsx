import React from 'react';
import './AppFeatures.css';

const AppFeatures = () => {
  return (
    <div className="app-features-container">
      <div className="app-features-header">
        <h2 className="features-title">App Features</h2>
        <p className="features-subtitle">
          Book ambulances in emergency or in advance. Experience our seamless platform.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <div className="icon mobile-icon"></div>
          <div className="feature-content">
            <h3>On the go convenience</h3>
            <p>One touch access to medical emergency services.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="icon clock-icon"></div>
          <div className="feature-content">
            <h3>Advance Booking</h3>
            <p>Book ambulances in advance for hassle-free hospital visits.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="icon pricing-icon"></div>
          <div className="feature-content">
            <h3>Transparent Pricing</h3>
            <p>Convenient mechanism, with online and cash payment mode.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="icon emergency-icon"></div>
          <div className="feature-content">
            <h3>Emergency Contact</h3>
            <p>Keep your dear ones close with emergency contact option.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="icon tips-icon"></div>
          <div className="feature-content">
            <h3>Tips & advice; First Aid Information</h3>
            <p>Arm yourself with relevant information during any emergency scenario.</p>
          </div>
        </div>

        <div className="feature-card">
          <div className="icon talk-icon"></div>
          <div className="feature-content">
            <h3>Easy to Talk</h3>
            <p>Seamless communication with ambulance drivers.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppFeatures;