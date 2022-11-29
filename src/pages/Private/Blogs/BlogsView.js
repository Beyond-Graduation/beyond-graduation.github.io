import React, { useEffect, useRef, useState } from "react";
import BlogCard from "../../../components/BlogCard/BlogCard";
import "./BlogsVew.css";
import axios from "../../../components/axios";
import { toast } from "react-toastify";
import searchIcon from "../../../assets/icons/search.svg";
import { Dropdown, DropdownButton } from "react-bootstrap";

function BlogsView() {
  const [blogData, setBlogData] = useState([]);
  const searchRef = useRef();

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

  const handleSearch = () => {};

  return (
    <div className="blogs-view">
      <div className="blogs-view-cnt">
        <h1 className="blog-heading">Blogs</h1>
        <div className="d-flex mt-5 align-items-center justify-content-between">
          <div className="blog-search-cnt d-flex align-items-center">
            <img src={searchIcon} alt="" />
            <input type="text" placeholder="Search" ref={searchRef} />
          </div>
          <DropdownButton menuVariant="dark" title="Sort By">
            <Dropdown.Item active>MOST RECENT</Dropdown.Item>
            <Dropdown.Item>MOST POPULAR</Dropdown.Item>
            <Dropdown.Item>ALPAHABETICAL SORT</Dropdown.Item>
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
