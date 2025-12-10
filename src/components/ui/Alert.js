"use client"

const Alert = ({ type, message, onClose }) => {
  return (
    <div className={`alert alert-${type}`}>
      {message}
      {onClose && (
        <button
          className="close-btn"
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            float: "right",
            cursor: "pointer",
            fontSize: "1.1rem",
          }}
        >
          &times;
        </button>
      )}
    </div>
  )
}

export default Alert

