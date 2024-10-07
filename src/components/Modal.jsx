import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close modal only if the overlay is clicked
    if (e.target.classList.contains("modal-overlay")) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={handleOverlayClick}
    >
      <div
        className="modal-content"
        style={{
          width: "400px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          zIndex: 10000,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="modal-header d-flex justify-content-between align-items-center"
          style={{
            padding: "15px",
            background: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
          }}
        >
          <h5 className="modal-title" style={{ margin: 0 }}>
            Purchase Crypto
          </h5>
          <button
            type="button"
            className="close"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
        <div className="modal-body" style={{ padding: "20px" }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
