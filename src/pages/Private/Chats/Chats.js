import React, { useEffect, useRef, useState } from "react";
import Message from "../../../components/Messages/Message";
import "./Chats.css";
import { chatInstance } from "../../../components/axios";
import Conversations from "../../../components/Conversations/Conversations";
import { useStateValue } from "../../../reducer/StateProvider";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { Button } from "react-bootstrap";

function Chats() {
  const { chatId } = useParams();
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
        //console.log(err);
      });
  };

  const getConversations = async () => {
    await chatInstance({
      method: "get",
      url: "/conversations/" + userId,
    })
      .then((res) => {
        setConversations(res.data);
      })
      .catch((err) => {
        //console.log(err);
      });
  };

  useEffect(() => {
    getConversations();
  }, [chatId]);

  useEffect(() => {
    if (!chatId) setCurrentChat(null);
  }, [chatId]);

  useEffect(() => {
    socket.current = io("ws://64.227.157.21:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        sentAt: Date.now,
      });
    });
    socket.current.on("blocked", () => {
      getConversations();
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat.member?.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.current.emit("addUser", userId);
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
          //console.log(err);
        });
    };

    if (currentChat) {
      getMessages();
    }
  }, [currentChat]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    let current = conversations?.filter(
      (x) => x._id === chatId || x._id === currentChat?._id
    );
    if (current.length !== 0) setCurrentChat(current[0]);
  }, [conversations]);

  return (
    <div className="chats d-flex">
      <div className="chats-left d-flex flex-column">
        <div className="d-flex flex-column mx-auto my-5">
          {conversations.map((conversation) => (
            <Conversations
              conversation={conversation}
              currUser={userId}
              setOtherUserName={setOtherUserName}
              setCurrentChat={setCurrentChat}
              getAllChats={getConversations}
              socket={socket}
            />
          ))}
        </div>
      </div>
      <div className="chats-right">
        {currentChat?.blocked && <div className="blocked-overlay"></div>}
        {currentChat ? (
          <>
            <div className="message-top">
              {messages.length > 0 ? (
                messages.map((m) => {
                  return (
                    <div style={{ scrollBehavior: "smooth" }} ref={scrollRef}>
                      <Message
                        message={m}
                        own={m.sender === userId}
                        curr={userData.firstName}
                        other={otherUserName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className="no-conversation-text">
                  Send a message to start conversation
                </div>
              )}
            </div>
            <div className="message-bottom">
              {!currentChat.blocked ? (
                <div className="chat-type d-flex align-items-center justify-content-around">
                  <textarea
                    name="send-msg"
                    id="send-msg"
                    rows={4}
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <Button
                    variant="success"
                    className="send-btn"
                    onClick={handleSubmit}
                  >
                    Send
                  </Button>
                </div>
              ) : currentChat.blockedBy !== userId ? (
                <div className="cannot-reply text-center">
                  You cannot reply to this conversation.
                </div>
              ) : (
                <div className="chat-type d-flex align-items-center justify-content-around">
                  <textarea
                    name="send-msg"
                    id="send-msg"
                    rows={4}
                    disabled={true}
                    placeholder="Unblock this chat to continue conversation"
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <Button
                    variant="success"
                    disabled={true}
                    className="send-btn"
                    onClick={handleSubmit}
                  >
                    Send
                  </Button>
                </div>
              )}
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
