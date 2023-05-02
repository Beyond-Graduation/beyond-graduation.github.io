import React, { useEffect, useRef, useState } from "react";
import Message from "../../../components/Messages/Message";
import "./Chats.css";
import { chatInstance } from "../../../components/axios";
import Conversations from "../../../components/Conversations/Conversations";
import { useStateValue } from "../../../reducer/StateProvider";
import { io } from "socket.io-client";

function Chats() {
  const scrollRef = useRef();
  const socket = useRef();
  const [{ userData }, dispatch] = useStateValue();
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [otherUserName, setOtherUserName] = useState("");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const userId =
    localStorage.getItem("userId") || sessionStorage.getItem("userId");

  const handleSubmit = async () => {
    const message = {
      sender: userId,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.member.find((member) => member !== userId);

    socket.current.emit("sendMessage", {
      senderId: userId,
      receiverId: receiverId,
      text: newMessage,
    });

    await chatInstance({
      method: "post",
      url: "/messages",
      data: message,
    })
      .then((res) => {
        setMessages([...messages, res.data]);
        setNewMessage("");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const getConversations = async () => {
      await chatInstance({
        method: "get",
        url: "/conversations/" + userId,
      })
        .then((res) => {
          setConversations(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getConversations();
  }, []);

  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat.member?.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userId);
    socket.current.on("getUsers", (users) => {
      console.log(users);
    });
  }, [userId]);

  useEffect(() => {
    const getMessages = async () => {
      await chatInstance({
        method: "get",
        url: "/messages/" + currentChat._id,
      })
        .then((res) => {
          setMessages(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getMessages();
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  console.log(socket);

  const randomColors = () => {
    // generate an array of 2 random colors
    const color1 = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
    const color2 = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0")
      .toUpperCase();
    return [color1, color2];
  };

  return (
    <div className="chats d-flex">
      <div className="chats-left d-flex flex-column">
        {conversations.map((conversation) => (
          <Conversations
            conversation={conversation}
            currUser={userId}
            setOtherUserName={setOtherUserName}
            setCurrentChat={setCurrentChat}
          />
        ))}
      </div>
      <div className="chats-right">
        {currentChat ? (
          <>
            <div className="message-top">
              {messages.map((m) => {
                const colors = randomColors();
                return (
                  <div ref={scrollRef}>
                    <Message
                      message={m}
                      own={m.sender === userId}
                      curr={userData.firstName}
                      other={otherUserName}
                      colors={colors}
                    />
                  </div>
                );
              })}
            </div>
            <div className="message-bottom">
              <div className="chat-type d-flex align-items-center justify-content-around">
                <textarea
                  name="send-msg"
                  id="send-msg"
                  rows={4}
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                ></textarea>
                <div className="send-btn" onClick={handleSubmit}>
                  Send
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="no-conversation-text">
            Open Conversation to start a chat
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
