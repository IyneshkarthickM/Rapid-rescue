import React from 'react';
import './WhyChooseUs.css';

const WhyChooseUs = () => {
  return (
    <div className="why-choose-container">
      <h1 className="section-title">Why Choose Us?</h1>
      
      <div className="features-container">
        <div className="feature-item">
          <div className="feature-icon patient-icon"></div>
          <p className="feature-text">Patient first policy</p>
        </div>

        <div className="feature-item">
          <div className="feature-icon emergency-icon"></div>
          <p className="feature-text">Emergency assistance time of 15 minutes or less</p>
        </div>

        <div className="feature-item">
          <div className="feature-icon support-icon"></div>
          <p className="feature-text">24/7 Support</p>
        </div>

        <div className="feature-item">
          <div className="feature-icon fleet-icon"></div>
          <p className="feature-text">Biggest fleet of ambulances across India</p>
        </div>
      </div>

      <div className="images-section">
        <div className="image-container">
          <img src="https://medulance.com/assets/images/f-kit.png" alt="Ambulance Interior" className="service-image interior-image" />
          <div className="decorative-waves"></div>
        </div>
        <div className="image-container">
          <img src="https://medulance.com/assets/images/ambulances.png" alt="Ambulance Fleet" className="service-image fleet-image" />
        </div>
      </div>

      <div className="decorative-crosses">
        <div className="cross pink"></div>
        <div className="cross blue"></div>
      </div>

      <button className="book-now-button" >BOOK NOW</button>
    </div>
  );
};

export default WhyChooseUs;