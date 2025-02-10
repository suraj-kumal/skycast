import React from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
const Popup = ({ message, onClose }) => {
  return (
    <div className="popup">
      <div className="popup-content">
        <p>{message}</p>
        <div className="btn">
          <button onClick={onClose} className="mybtn">OK</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
