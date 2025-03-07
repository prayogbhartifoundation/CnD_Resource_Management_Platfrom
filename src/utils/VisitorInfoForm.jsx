import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import '../styles/VisitorInfoForm.css';

export default function VisitorInfoForm() {
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const hasSubmitted = localStorage.getItem("visitorInfoSubmitted");
    if (!hasSubmitted && location.pathname !== "/") {
      setShowModal(true);
    }
  }, [location]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const visitorData = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      org: formData.get("org"),
    };
    localStorage.setItem("visitorInfo", JSON.stringify(visitorData));
    localStorage.setItem("visitorInfoSubmitted", "true");
    setShowModal(false);
  };

  return (
    showModal && (
      <div className="modal-overlay">
        <div className="modal">
          <h2>Visitor Information</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="tel" name="phone" placeholder="Phone Number" required />
            <input type="text" name="org" placeholder="Organisation" required />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    )
  );
}
