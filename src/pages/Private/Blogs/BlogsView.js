import React, { useEffect, useState } from "react";
import BlogCard from "../../../components/BlogCard/BlogCard";
import "./BlogsVew.css";
import axios from "../../../components/axios";
import { toast } from "react-toastify";

function BlogsView() {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authKey");
      axios({
        method: "get",
        url: "/blog",
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setBlogData(res.data);
        })
        .catch((err) => {
          toast.error("Something went wrong!!");
        });
    };

    fetchData();
  }, []);

  return (
    <div className="blogs-view">
      <div className="blogs-view-cnt">
        <h1 className="blog-heading">Blogs</h1>
        <div className="blogs-view-list">
          {blogData.map((blog) => {
            return <BlogCard key={blog.id} blog={blog} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogsView;
