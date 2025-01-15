import React from "react";
import "../styles/ContactUsPage.css";

function ContactUsPage() {
  return (
    <div className="contact-us-page">
      <header className="contact-header">
        <h2>Contact Us</h2>
      </header>

      <section className="contact-info">
        <h3>Get in Touch</h3>
        <p>We'd love to hear from you. Feel free to reach out to us via any of the following methods:</p>

        <div className="info-grid">
          <div className="info-card">
            <h4>Email</h4>
            <p>contact@agency.com</p>
          </div>
          <div className="info-card">
            <h4>Phone</h4>
            <p>+123 456 7890</p>
          </div>
          <div className="info-card">
            <h4>Address</h4>
            <p>123 Agency Street, City, Country</p>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <h3>Send Us a Message</h3>
        <form className="contact-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Your Name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="email" id="email" placeholder="Your Email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea id="message" rows="5" placeholder="Your Message" required></textarea>
          </div>

          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>
    </div>
  );
}

export default ContactUsPage;
