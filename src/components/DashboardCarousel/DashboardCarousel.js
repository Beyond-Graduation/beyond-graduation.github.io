import React, { useRef } from "react";
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Link } from "react-router-dom";
import DashBlogCard from "../DasboardCards/DashBlogCard/DashBlogCard";
import DashProfilCard from "../DasboardCards/DashProfileCard/DashProfileCard";
import "./DashboardCarousel.css";

function DashboardCarousel({
  cardCount,
  type,
  data,
  userData,
  userType,
  create,
  bookmark,
  ...props
}) {
  const carouselRef = useRef();

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: cardCount
        ? cardCount
        : userType === "alumni" && type === "blog"
        ? 2
        : 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  // useEffect(() => {
  //   if (cardCount === 4 && type === "blog") {
  //     console.log(data);
  //   }
  // }, [data]);

  return (
    <div {...props}>
      {type?.toLowerCase() === "blog" ? (
        <div className="d-flex justify-content-center">
          {userType === "alumni" && create !== false ? (
            <div className="carousel-card create-card d-none d-lg-block">
              <Link to="/blogs/create">
                <DashBlogCard type="create" />
              </Link>
            </div>
          ) : null}
          <Carousel
            responsive={responsive}
            infinite={true}
            ref={carouselRef}
            className={`${
              userType === "alumni" && create !== false
                ? "sm-carousel"
                : "lg-carousel"
            }`}
          >
            {data.length === 0 && bookmark ? (
              <div className="carousel-empty p-4">
                <span>No Bookmarked Blogs</span>
                <Link to="/blogs">
                  <div className="mt-4 explore-btn">Explore Blogs</div>
                </Link>
              </div>
            ) : null}
            {data.map((blog) => {
              return (
                <div className="carousel-card">
                  <Link to={`/blogs/${blog.blogId}`}>
                    <DashBlogCard blogData={blog} userData={userData} />
                  </Link>
                </div>
              );
            })}
          </Carousel>
        </div>
      ) : (
        <Carousel responsive={responsive} infinite={true}>
          {data.length === 0 ? (
            <div className="carousel-empty p-4">
              <span>No Favourite Alumni</span>
              <Link to="/alumni-profiles">
                <div className="mt-4 explore-btn">Explore Alumni Profiles</div>
              </Link>
            </div>
          ) : null}
          {data.map((user) => (
            <div className="carousel-card">
              <Link
                to={
                  userType === "student"
                    ? `/student-profile/${user.userId}`
                    : userType === "alumni"
                    ? `/alumni-profile/${user.userId}`
                    : ""
                }
              >
                <DashProfilCard userData={user} />
              </Link>
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default DashboardCarousel;
