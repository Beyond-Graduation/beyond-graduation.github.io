import React, { useEffect } from "react";
import "./Message.css";

function Message({ message, own, curr, other, colors }) {
  useEffect(() => {}, [curr, other]);
  return (
    <div
      className={`${
        own ? "message-cnt-own" : "message-cnt-other"
      } d-flex align-items-center`}
    >
      <div
        className="msg-sender"
        // style={{ backgroundColor: `#${own ? colors[0] : colors[1]}` }}
      >
        {own ? curr.charAt(0) : other.charAt(0)}
      </div>
      <div className="msg-content">{message.text}</div>
    </div>
  );
}

export default Message;
