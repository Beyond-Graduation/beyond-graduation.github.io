import React, { useEffect, useState } from "react";
import "./DashBlogCard.css";

function DashBlogCard({ blogData, userData }) {
  const [author,setAuthor] = useState({});
  useEffect(() => {
    setAuthor(userData.find(x => x.userId === blogData.userId));
  }, []);
  return (
    <div className="dash-blog-card">
      <div className="d-b-card-upper"></div>
      <div className="d-b-card-lower">
        <div className="title">{blogData.title}</div>
        <div className="description">{blogData.content}</div>
        <div className="author">
          <div className="name">
            {blogData.firstName} {blogData.lastName}
          </div>
          <div className="d-flex">
            <div className="department">{author?.department ? author.department : "Computer Science"}</div>
            <div className="batch">{author?.yearGraduation ? author.yearGraduation : "1968"} Batch</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashBlogCard;
