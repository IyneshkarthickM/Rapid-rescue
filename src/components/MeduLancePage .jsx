import React from 'react';
import './MedulancePage.css';
import { Link } from 'react-router-dom';

function MedulancePage() {
  return (
    <div className="medulance-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="https://i.pinimg.com/736x/12/b0/48/12b048d7db928af81e139566e19f0237.jpg" alt="Medulance Logo" />
          <span>Rapid Rescue</span>
        </div>
        <nav className="nav-items">
          <Link to='/MedulanceSupport'><a href="#">About</a></Link>
          <a href="#">Services</a>
          <a href="#">Training</a>
        </nav>
        <div className="header-buttons">
          <Link to="/DriverSignup">
          <button className="Diversignup">DRIVER SIGNUP</button>
          </Link> .
          <Link to='/MapComponent'><button className="book-now">BOOK NOW</button></Link>
          <Link to="/LoginForm" >
          <button className="login">LOGIN</button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hero-content" style={{ flex: 1 }}>
            <h1>24/7 Emergency Ambulance Care with Medulance</h1>
            <h2 className="subtitle">For Emergency Medical Service</h2>
            <p>
              Help / Rescues the Patient in case of an Emergency situation by just a click.
              Medulance Ambulance comes right in front of the door for help.
            </p>
            
            <Link to='/MapComponent'><button className="book-now-hero">BOOK NOW</button></Link>
            
            <div className="call-assistance">
              <span>or</span>
              <p>Call Our Assistance</p>
              <div className="phone-number">
                <span>+91 77081 39041</span>
              </div>
            </div>
          </div>
          <div className="hero-video" style={{ flex: 1 }}>
            <video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
              <source src="https://www.shutterstock.com/shutterstock/videos/3529879407/preview/stock-footage-cartoon-ambulance-car-rides-through-the-city-with-the-siren-turned-on-looped-k-d-motion.webm" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </section>
    </div>
  );
}

export default MedulancePage;
