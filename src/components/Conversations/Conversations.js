import React from "react";
import avatarIcon from "../../assets/images/avatar.png";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../components/axios";
import { toast } from "react-toastify";
import "./Conversations.css";

export default function Conversations({ conversation, currUser }) {
  const [user, setUser] = useState({});

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
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!!");
        });
    };

    getData();
  }, []);
  return (
    <div className="conversations d-flex align-items-center">
      <img
        className="conversation-img"
        src={user.profilePicPath || avatarIcon}
        alt={user.firstName}
      />
      <span className="conversation-name">
        {user.firstName} {user.lastName}
      </span>
    </div>
  );
}
