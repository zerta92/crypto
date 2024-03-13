import React from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-dialog" role="document">
      <div
        className="modal-content"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="modal-header"
          style={{
            marginTop: 100,
            background: "white",
            width: 300,
            border: "2px solid #000",
            boxShadow: "2px solid black",
          }}
        >
          <h5 className="modal-title">Purchase Crypto</h5>
          <button
            type="button"
            className="close"
            aria-label="Close"
            onClick={onClose}
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div
          className="modal-body"
          style={{
            background: "white",
            height: "15%",
            width: 300,
            margin: "auto",
            padding: "2%",
            border: "2px solid #000",
            borderTop: "none",
            boxShadow: "2px solid black",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
