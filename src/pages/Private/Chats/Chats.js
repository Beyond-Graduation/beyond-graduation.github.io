import React from "react";
import Message from "../../../components/Messages/Message";
import "./Chats.css";

function Chats() {
  return (
    <div className="chats d-flex">
      <div className="chats-left">left</div>
      <div className="chats-right">
        <div className="message-top">
          <Message own={1} />
          <Message own={0} />
          <Message own={1} />
          <Message own={1} />
          <Message own={0} />
          <Message own={1} />
          <Message own={1} />
          <Message own={0} />
          <Message own={1} />
          <Message own={1} />
          <Message own={0} />
          <Message own={1} />
        </div>
        <div className="message-bottom">
          <div className="chat-type d-flex align-items-center justify-content-around">
            <textarea name="send-msg" id="send-msg" rows={4}></textarea>
            <div className="send-btn">Send</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chats;
