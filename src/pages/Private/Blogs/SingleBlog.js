import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../../components/axios";
import parse from "html-react-parser";
import "./SingleBlog.css";
import { AiFillLike } from "react-icons/ai";
import { useStateValue } from "../../../reducer/StateProvider";
import { getData } from "../../../App";
import { BsFillReplyFill } from "react-icons/bs";

function SingleBlog() {
  const [{ userData, userId }, dispatch] = useStateValue();
  const navigate = useNavigate();
  const [childCommentOpen, setChildCommentOpen] = useState([]);

  const { blogId } = useParams();
  const [blogData, setBlogData] = useState({});
  const [blogImg, setBlogImg] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [childComments, setChildComments] = useState({});
  const [postCommentEnabled, setPostCommentEnabled] = useState(true);
  const [blogLiked, setBlogLiked] = useState(false);

  const commentRef = useRef();
  const childCommentRef = useRef([]);

  const postComment = (type, parent, index) => {
    console.log(childCommentRef.current[index].value);
    if (postCommentEnabled) {
      setPostCommentEnabled(false);
      let commentId = "com";
      const possible =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < 5; i++) {
        commentId += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }

      const content =
        type === "parent"
          ? commentRef.current.value
          : childCommentRef.current[index].value;

      if (content === "" || content.trim().length === 0) {
        if (type === "parent") toast.error("Comment cannot be empty");
        else if (type === "child") toast.error("Reply cannot be empty");
        setPostCommentEnabled(true);
        return;
      }
      const token = localStorage.getItem("authKey");
      const commData =
        type === "parent"
          ? {
              blogId: blogData.blogId,
              commentId: commentId,
              content: content,
            }
          : {
              blogId: blogData.blogId,
              commentId: commentId,
              content: content,
              parent: parent,
            };

      axios({
        method: "post",
        url: `blog/addComments`,
        data: commData,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          commentRef.current.value = "";
          fetchBlogComments();
          setPostCommentEnabled(true);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!!");
        });
    }
  };

  const fetchBlogComments = async () => {
    const token = localStorage.getItem("authKey");
    axios({
      method: "get",
      url: `blog/getComments?blogId=${blogId}`,
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        setComments(res.data);
        setChildCommentOpen(Array(res.data.length).fill(0));
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!!");
      });
  };

  const fetchChildComments = async () => {
    const token = localStorage.getItem("authKey");
    for (var j = 0; j < comments.length; j++) {
      if (comments[j].childCommentCount > 0) {
        const cId = comments[j].commentId;
        axios({
          method: "get",
          url: `blog/getComments?parentId=${comments[j].commentId}`,
          headers: {
            Authorization: `bearer ${token}`,
          },
        })
          .then((res) => {
            setChildComments({ ...childComments, [cId]: res.data });
          })
          .catch((err) => {
            console.log(err);
            toast.error("Something went wrong!!");
          });
      }
      return 0;
    }
  };

  const likeBlog = async () => {
    if (blogLiked) {
      setLikeCount(likeCount - 1);
      setBlogLiked(false);
    } else {
      setLikeCount(likeCount + 1);
      setBlogLiked(true);
    }

    const token = localStorage.getItem("authKey");
    axios({
      method: "post",
      url: `blog/like`,
      data: { blogId: blogId },
      headers: {
        Authorization: `bearer ${token}`,
      },
    })
      .then((res) => {
        // dispatch({
        //   type: "SET_USER_DATA",
        //   item: res.data,
        // });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong!!");
      });
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      const token = localStorage.getItem("authKey");
      axios({
        method: "get",
        url: `blog?blogId=${blogId}`,
        headers: {
          Authorization: `bearer ${token}`,
        },
      })
        .then((res) => {
          setBlogData(res.data);
          setBlogImg(res.data.imagePath);
          setLikeCount(res.data.likes);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Something went wrong!!");
        });
    };

    fetchBlogComments();
    fetchBlogData();
  }, [blogId]);

  useEffect(() => {
    setBlogLiked(blogData.isLiked);
  }, [blogData]);

  useEffect(() => {
    if (comments.length > 0) fetchChildComments();
  }, [comments]);

  useEffect(() => {
    console.log(childComments);
  }, [childComments]);

  return (
    <div className="single-blog">
      <div className="single-blog-cnt">
        <div className="single-blog-main">
          <div
            className={`blog-like-btn d-flex align-items-center ${
              blogLiked ? "active" : ""
            }`}
            onClick={likeBlog}
          >
            <div>
              <AiFillLike />
            </div>
            <div>{blogLiked ? "UNLIKE" : "LIKE"}</div>
            <div>{likeCount}</div>
          </div>
          <div className="single-blog-title text-center">{blogData.title}</div>
          <div className="single-blog-author my-3 text-center">
            By - {blogData.firstName} {blogData.lastName}
          </div>
          <div className="single-blog-img text-center">
            <img src={blogImg} alt="" />
          </div>
          <div className="single-blog-content mt-5">
            {blogData.content ? parse(blogData?.content) : null}
          </div>
        </div>
        <div className="comments-heading">Comments ({comments.length})</div>
        <div className="post-comment text-center my-5 mt-4">
          <textarea
            name="commet"
            cols="30"
            rows="5"
            ref={commentRef}
          ></textarea>
          <span onClick={() => postComment("parent", "", 0)}>POST COMMENT</span>
        </div>
        <div className="single-blog-comments">
          {comments.map((com, i) => {
            let comId = com.commentId;
            return (
              <div className="blog-comment p-4">
                <div className="d-flex justify-content-between blog-comment-head">
                  <div className="comment-author">
                    {com.firstName} {com.lastName}
                  </div>
                  <div className="comment-date">
                    {new Date(com.dateUploaded).toLocaleDateString("en-us", {
                      year: "numeric",
                      day: "2-digit",
                      month: "long",
                    })}
                  </div>
                  <div className="comment-likes">
                    <AiFillLike /> <span>{com.likes}</span>
                  </div>
                </div>
                <div className="comment-content mt-2">{com.content}</div>
                {/* <div
                  className="comm-reply mt-2 me-4"
                  onClick={() => {
                    let arr = childCommentOpen.map((x, index) => {
                      if (index === i)
                        return childCommentOpen[index] === 0 ? 1 : 0;
                      else return childCommentOpen[index];
                    });
                    setChildCommentOpen(arr);
                  }}
                >
                  <BsFillReplyFill />
                  <span>Reply</span>
                </div>
                <div
                  className="comment-reply mt-2"
                  hidden={!childCommentOpen[i]}
                >
                  <textarea
                    name={`childComm${i}`}
                    id={`childComm${i}`}
                    rows="2"
                    ref={(ref) => childCommentRef.current.push(ref)}
                  />
                  <span onClick={() => postComment("child", com.commentId, i)}>
                    Reply
                  </span>
                </div>
                <div className="child-comment">
                  {childComments[com.commentId] &&
                    childComments[com.commentId].map((child) => (
                      <div className="ms-5 mt-2">
                        <div className="d-flex justify-content-between blog-comment-head">
                          <div className="comment-author">
                            {child.firstName} {child.lastName}
                          </div>
                          <div className="comment-date">
                            {new Date(child.dateUploaded).toLocaleDateString(
                              "en-us",
                              {
                                year: "numeric",
                                day: "2-digit",
                                month: "long",
                              }
                            )}
                          </div>
                          <div className="comment-likes">
                            <AiFillLike /> <span>{child.likes}</span>
                          </div>
                        </div>
                        <div className="comment-content mt-2">
                          {child.content}
                        </div>
                      </div>
                    ))}
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SingleBlog;
