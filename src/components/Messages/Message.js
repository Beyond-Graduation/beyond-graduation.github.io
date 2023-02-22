import React from "react";
import "./Message.css";

function Message({own}) {
  return (
    <div className={`${own ? "message-cnt-own" : "message-cnt-other"} d-flex align-items-center`}>
      <div className="msg-sender">S</div>
      <div className="msg-content">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consectetur
        nobis, sunt enim, necessitatibus dolores nisi nostrum, saepe error iure
      </div>
    </div>
  );
}

export default Message;
