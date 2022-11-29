import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import "./DashBlogCard.css";

function DashBlogCard({ blogData, type, userData }) {
  const [author, setAuthor] = useState({});
  useEffect(() => {
    if (type !== "create")
      setAuthor(userData.find((x) => x.userId === blogData.userId));
  }, [userData]);

  return (
    <div className="dash-blog-card">
      {type === "create" ? (
        <div className="blog-create-card text-center">
          <div>
            <p>+</p>
            <div className="mt-2">Create Blog</div>
          </div>
        </div>
      ) : (
        <>
          <img className="d-b-card-upper" src={blogData.imagePath} alt="" />
          <div className="d-b-card-lower">
            <div className="title">{blogData.title}</div>
            <div className="description">{blogData.abstract}</div>
            <div className="author d-flex justify-content-between align-items-between">
              <div className="d-flex align-items-center d-b-card-likes"><AiFillLike />{blogData.likes}</div>
              <div className="name">
                {blogData.firstName} {blogData.lastName}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashBlogCard;
