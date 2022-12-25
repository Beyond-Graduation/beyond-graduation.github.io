import React, { useEffect, useRef, useState } from "react";
import BlogCard from "../../../components/BlogCard/BlogCard";
import "./BlogsVew.css";
import axios from "../../../components/axios";
import { toast } from "react-toastify";
import searchIcon from "../../../assets/icons/search.svg";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBloggerB } from "react-icons/fa";

function BlogsView() {
  const userType = localStorage.getItem("userType");
  const [blogData, setBlogData] = useState([]);
  const searchRef = useRef();
  const filterRef = useRef();

  const blogsFilter = ["popular", "latest", "oldest", "blogname"];

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

  const filterChange = (e) => {
    const token = localStorage.getItem("authKey");
    axios({
      method: "get",
      url: `/blog?sort=${blogsFilter[e]}`,
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

  return (
    <div className="blogs-view">
      <div className="blogs-view-cnt">
        {userType === "alumni" ? (
          <Link to="/blogs/create">
            <div className="create-notice-btn  d-flex align-items-center">
              <FaBloggerB className="me-2" /> create blog
            </div>
          </Link>
        ) : null}

        <h1 className="blog-heading">Blogs</h1>
        <div className="d-flex mt-5 align-items-center justify-content-between">
          <div className="blog-search-cnt d-flex align-items-center">
            <img src={searchIcon} alt="" />
            <input type="text" placeholder="Search" ref={searchRef} />
          </div>
          <DropdownButton
            menuVariant="dark"
            title="Sort By"
            onSelect={filterChange}
            ref={filterRef}
          >
            <Dropdown.Item active eventKey="1">
              MOST RECENT
            </Dropdown.Item>
            <Dropdown.Item eventKey="0">MOST POPULAR</Dropdown.Item>
            <Dropdown.Item eventKey="2">FORMER BLOGS</Dropdown.Item>
            <Dropdown.Item eventKey="3">ALPAHABETICAL SORT</Dropdown.Item>
            {/* <Dropdown.Divider />
            <Dropdown.Item href="#/action-4">Separated link</Dropdown.Item> */}
          </DropdownButton>
        </div>

        <div className="blogs-view-list mt-5">
          {blogData.map((blog) => {
            return <BlogCard key={blog.id} blog={blog} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogsView;
