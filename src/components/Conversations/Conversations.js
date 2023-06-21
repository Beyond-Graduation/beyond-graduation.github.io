import React from "react";
import avatarIcon from "../../assets/images/avatar.png";
import { useState } from "react";
import { useEffect } from "react";
import axios, { chatInstance } from "../../components/axios";
import { toast } from "react-toastify";
import "./Conversations.css";
import { useNavigate, useParams } from "react-router-dom";
import { BiBlock } from "react-icons/bi";
import { CgUnblock } from "react-icons/cg";
import { Button, Modal } from "react-bootstrap";

export default function Conversations({
  conversation,
  currUser,
  setCurrentChat,
  setOtherUserName,
  getAllChats,
  socket,
}) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [blocked, setBlocked] = useState(conversation?.blocked);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const blockChat = async () => {
    await chatInstance({
      method: "post",
      url: "/conversations/block",
      data: {
        convId: conversation._id,
        blockedBy: currUser,
      },
    })
      .then((res) => {
        toast.warning(`Chat from ${user?.firstName} blocked !`);
        handleClose();
        setBlocked(true);
        getAllChats();
        socket.current.emit("blockUser", user?.userId);
      })
      .catch((err) => {
        toast.error("something went wrong");
      });
  };

  const unblockChat = async () => {
    await chatInstance({
      method: "post",
      url: "/conversations/unblock",
      data: {
        convId: conversation._id,
        unblockerId: currUser,
      },
    })
      .then((res) => {
        toast.warning(`Chat from ${user?.firstName} unblocked !`);
        handleClose();
        setBlocked(false);
        getAllChats();
        socket.current.emit("blockUser", user?.userId);
      })
      .catch((err) => {
        toast.error("something went wrong");
      });
  };

  useEffect(() => {
    const friendId = conversation.member.find((m) => m !== currUser);
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");

    const getData = async () => {
      await axios({
        method: "get",
        url: `user/getDetails/${friendId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setUser(res.data);
          chatId === conversation._id && setOtherUserName(res.data.firstName);
        })
        .catch((err) => {
          toast.error("Something went wrong!!");
        });
    };

    getData();
  }, []);

  return (
    <div
      onClick={() => {
        setCurrentChat(conversation);
        setOtherUserName(user?.firstName);
        navigate({
          pathname: `/chats/${conversation._id}`,
          options: { replace: true },
        });
      }}
    >
      <div
        className={`conversations d-flex justify-content-between align-items-center ${
          chatId === conversation._id ? "active" : ""
        }`}
      >
        <div className=" d-flex align-items-center">
          <img
            className="conversation-img"
            src={user?.profilePicPath || avatarIcon}
            alt={user?.firstName}
          />
          <span
            className={`conversation-name ms-3 ${
              conversation.blocked ? "chat-block" : ""
            }`}
          >
            {user?.firstName} {user?.lastName}
          </span>
        </div>
        {conversation.blocked ? (
          conversation.blockedBy === currUser ? (
            <CgUnblock className="unblock-icon ms-3" onClick={handleShow} />
          ) : (
            <></>
          )
        ) : (
          <BiBlock className="block-icon ms-3" onClick={handleShow} />
        )}
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {conversation.blocked ? "Unblock" : "Block"} {user?.firstName}{" "}
            {user?.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to{" "}
          {conversation.blocked ? "unblock" : "block"} {user?.firstName}{" "}
          {user?.lastName} ?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="danger"
            onClick={conversation.blocked ? unblockChat : blockChat}
          >
            {conversation.blocked ? "Unblock" : "Block"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
