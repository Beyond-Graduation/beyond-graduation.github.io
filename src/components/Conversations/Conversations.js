import React from "react";
import avatarIcon from "../../assets/images/avatar.png";
import { useState } from "react";
import { useEffect } from "react";
import axios from "../../components/axios"

export default function Conversations({ conversation, currUser }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const friendId = conversation.member.find((m) => m !== currUser);
    const token =
    localStorage.getItem("authKey") || sessionStorage.getItem("authKey");


    const getData = async () => {
        await axios({
          method: "get",
          url: `user/getDetails/6yd2P`,
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
          .then((res) => {
            // setData(res.data);
            console.log(res)
          })
          .catch((err) => {
            console.log(err);
            // toast.error("Something went wrong!!");
          });
      };

      getData();
  }, []);
  return (
    <div className="conversations">
      <img className="conversation-img" src={avatarIcon} alt="" />
      <span className="conversation-name">Jane Doe</span>
    </div>
  );
}
