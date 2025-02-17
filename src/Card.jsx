import React from "react";

const Card = ({ value, matched, shown, onClick }) => {
  return (
    <div
      className={`card ${matched ? "matched" : shown ? "shown" : "hidden"}`}
      onClick={onClick}
    >
      {shown || matched ? value : ""}
    </div>
  );
};

export default Card;
