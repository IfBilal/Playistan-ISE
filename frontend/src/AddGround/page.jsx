import React, { useState } from "react";
import "./page.css";

const AddGround = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleSend = () => {
    if (phoneNumber.trim() === "") {
      alert("Please enter your number first!");
      return;
    }
    setShowPopup(true);
    setPhoneNumber("");
  };

  return (
    <div className="add-ground-container">
      <h1 className="add-ground-title">Add Your Ground to Playistan</h1>
      <p className="add-ground-subtitle">
        Enter your phone number and we’ll reach out to help list your ground.
      </p>

      <div className="add-ground-form">
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="add-ground-input"
        />
        <button onClick={handleSend} className="add-ground-button">
          Send to Playistan
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-box">
            <h2>Thank you!</h2>
            <p>We will contact you soon to add your ground to Playistan.</p>
            <button onClick={() => setShowPopup(false)} className="popup-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddGround;
