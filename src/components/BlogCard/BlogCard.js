import React from "react";
import { useEffect } from "react";
import "./BlogCard.css";
import { AiFillLike } from "react-icons/ai";
import { Link } from "react-router-dom";

function BlogCard({ key, blog }) {
  return (
    <div className="blog-card-main">
      <Link to={`/blogs/${blog.blogId}`}>
        <img src={blog.imagePath} className="blog-card-img" alt="" />
        <div className="px-3 py-2">
          <div className="blog-card-details">
            <div className="blog-card-title">{blog.title}</div>
            <div className="d-flex mt-2 justify-content-between align-items-center">
              <div className="blog-card-likes d-flex justify-content-between align-items-center">
                <AiFillLike /> <span>{blog.likes}</span>
              </div>
              <div className="blog-card-author">
                <Link to={`/alumni-profile/${blog.userId}`}>
                  By - {blog.firstName} {blog.lastName}
                </Link>
              </div>
            </div>
            <div className="blog-card-desc mt-2">
              {blog.abstract}
              {blog.abstract}
            </div>
          </div>
          <div className="blog-card-date mt-2">
            {new Date(blog.dateUploaded).toLocaleDateString("en-us", {
              year: "numeric",
              day: "2-digit",
              month: "long",
            })}
          </div>
        </div>
          <div className="blog-card-more">Read More</div>
      </Link>
    </div>
  );
}

export default BlogCard;
