import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="top-button">
          <a href="#top">↑ GO TO TOP</a>
        </div>

        <div className="footer-grid">
          <div className="footer-column">
            <h3>About</h3>
            <ul>
              <li><a href="/what-we-do">What we do</a></li>
              <li><a href="/journey">Journey</a></li>
              <li><a href="/team">Team</a></li>
              <li><a href="/privacy-policy">Privacy Policy</a></li>
              <li><a href="/faqs">FAQ's</a></li>
              <li><a href="/terms">Terms and Conditions</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Services</h3>
            <ul>
              <li><a href="/enterprise">Enterprise</a></li>
              <li><a href="/individual">Individual</a></li>
              <li><a href="/hospital">Hospital</a></li>
              <li><a href="/government">Government</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Training</h3>
            <ul>
              <li><a href="/driver-training">Driver Training</a></li>
              <li><a href="/paramedical">Paramedical Training Institute</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Reach Us</h3>
            <ul>
              <li><a href="/contact">Contact Us</a></li>
              <li><a href="/partner">Partner With Us</a></li>
              <li><a href="/locations">Locations</a></li>
              <li><a href="/work-with-us">Work with us</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Blogs</h3>
            <ul>
              <li><a href="/founders-desk">Founders Desk</a></li>
              <li><a href="/blogs">Blogs</a></li>
            </ul>

            <div className="payment-section">
              <h3>Pay now with</h3>
              <div className="payment-icons">
                <img src="https://medulance.com/assets/images/am-card.png" alt="American Express" />
                <img src="https://medulance.com/assets/images/m-card.png" alt="Mastercard" />
                <img src="https://medulance.com/assets/images/vs-card.png" alt="Visa" />
                <img src="https://medulance.com/assets/images/r-pay.png" alt="RuPay" />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>Copyright © Medulance. All rights reserved.</p>
          <div className="social-links">
            <span>Follow us on</span>
            <a href="/facebook" className="social-icon facebook"></a>
            <a href="/twitter" className="social-icon twitter"></a>
            <a href="/linkedin" className="social-icon linkedin"></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;