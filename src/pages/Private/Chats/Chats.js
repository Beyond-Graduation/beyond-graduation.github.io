import React, { useEffect, useState } from "react";
import Message from "../../../components/Messages/Message";
import "./Chats.css";
import { chatInstance } from "../../../components/axios";
import Conversations from "../../../components/Conversations/Conversations";

function Chats() {
  const [conversations, setConversations] = useState([]);
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  useEffect(() => {
    const getConversations = async () => {
      const res = await chatInstance({
        method: "get",
        url: "/conversations/" + userId,
      })
        .then((res) => {
          setConversations(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(res);
    };

    getConversations();
  }, []);

  return (
    <div className="chats d-flex">
      <div className="chats-left">
        {conversations.map((conversation) => (
          <Conversations conversation={conversation} currUser={userId} />
        ))}
      </div>
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
