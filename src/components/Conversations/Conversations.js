import React from "react";
import avatarIcon from "../../assets/images/avatar.png";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../components/axios";
import { toast } from "react-toastify";
import "./Conversations.css";
import { useNavigate, useParams } from "react-router-dom";
import { BiBlock } from "react-icons/bi";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";

export default function Conversations({
  conversation,
  currUser,
  setOtherUserName,
  setCurrentChat,
}) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { chatId } = useParams();

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
          console.log(err);
          toast.error("Something went wrong!!");
        });
    };

    getData();
  }, []);
  return (
    <div
      onClick={() => {
        setCurrentChat(conversation);
        setOtherUserName(user.firstName);
        navigate({
          pathname: `/chats/${conversation._id}`,
          options: { replace: true },
        });
      }}
    >
      <div className="conversations d-flex justify-content-between align-items-center">
        <div className=" d-flex align-items-center">
          <img
            className="conversation-img"
            src={user.profilePicPath || avatarIcon}
            alt={user.firstName}
          />
          <span className="conversation-name ms-3">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <BiBlock className="block-icon ms-3" onClick={handleShow} />
      </div>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Block {user.firstName} {user.lastName}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure that you want to block {user.firstName} {user.lastName}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="danger">Block</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
