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
  const userType =
    localStorage.getItem("userType") || sessionStorage.getItem("userType");
  const [blogData, setBlogData] = useState([]);
  const [showBlogData, setShowBlogData] = useState([]);
  const [sortActive, setSortActive] = useState("1");

  const blogsFilter = ["popular", "latest", "oldest", "blogname"];

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
      axios({
        method: "get",
        url: "/blog",
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setBlogData(res.data);
          setShowBlogData(res.data);
        })
        .catch((err) => {
          toast.error("Something went wrong!!");
        });
    };

    fetchData();
  }, []);

  const searchBlogs = (e) => {
    const filteredBlogs = blogData.filter((blog) => {
      const titleMatch = blog.title
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
      const abstractMatch = blog.abstract
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
      return titleMatch || abstractMatch;
    });

    setShowBlogData(filteredBlogs);
  };

  const filterChange = (e) => {
    const token =
      localStorage.getItem("authKey") || sessionStorage.getItem("authKey");
    setSortActive(e);
    axios({
      method: "get",
      url: `/blog?sort=${blogsFilter[e]}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setBlogData(res.data);
        setShowBlogData(res.data);
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
            <input type="text" placeholder="Search" onChange={searchBlogs} />
          </div>
          <DropdownButton
            menuVariant="dark"
            title="Sort By"
            onSelect={filterChange}
          >
            <Dropdown.Item active={sortActive === "1"} eventKey="1">
              MOST RECENT
            </Dropdown.Item>
            <Dropdown.Item active={sortActive === "0"} eventKey="0">
              MOST POPULAR
            </Dropdown.Item>
            <Dropdown.Item active={sortActive === "2"} eventKey="2">
              FORMER BLOGS
            </Dropdown.Item>
            <Dropdown.Item active={sortActive === "3"} eventKey="3">
              ALPHABETICAL SORT
            </Dropdown.Item>
          </DropdownButton>
        </div>

        <div className="blogs-view-list mt-5">
          {showBlogData.map((blog) => {
            return <BlogCard key={blog.id} blog={blog} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogsView;
