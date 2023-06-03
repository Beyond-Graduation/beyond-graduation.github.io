import React, { useEffect } from "react";
import "./Message.css";

function Message({ message, own, curr, other, colors }) {
  useEffect(() => {}, [curr, other]);

  const DateConverter = (originalDate) => {
    const date = new Date(originalDate);

    //console.log(originalDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    const formattedDate = `${formattedDay}/${formattedMonth}`;

    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const amPm = hours < 12 ? "AM" : "PM";
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedTime = `${formattedHours}:${formattedMinutes} ${amPm}`;

    const expr = own
      ? formattedTime + " " + formattedDate
      : formattedDate + " " + formattedTime;

    return expr;
  };

  return (
    <div className={`${own ? "message-cnt-own" : "message-cnt-other"}`}>
      <div className="d-flex align-items-center">
        <div
          className="msg-sender"
          // style={{ backgroundColor: `#${own ? colors[0] : colors[1]}` }}
        >
          {own ? curr.charAt(0) : other.charAt(0)}
        </div>
        <div className="msg-content">{message.text}</div>
      </div>
      <div className="sent-time">{DateConverter(message.sentAt)}</div>
    </div>
  );
}

export default Message;
