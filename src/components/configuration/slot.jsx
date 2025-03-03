import PropTypes from "prop-types";

export default function Slot({ children }) {
  return (
    <div style={{ padding: "5px", width: "50%" }}>
      <div
        style={{
          border: "solid 1px #ccc",
          borderRadius: "5px",
          margin: "5px 0",
          padding: "20px",
        }}
      >
        {children}
      </div>
    </div>
  );
}

Slot.propTypes = {
  children: PropTypes.node,
};
