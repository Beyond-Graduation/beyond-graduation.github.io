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
      items: cardCount ? cardCount : userType === "alumni" ? 2 : 3,
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
        <div className="d-flex">
          {userType === "alumni" && create !== false ? (
            <div className="carousel-card create-card">
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
            {/* <DashBlogCard blogData={data[0]} userData={userData} /> */}
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
          {data.map((user) => (
            <div className="carousel-card">
              <DashProfilCard userData={user} />
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default DashboardCarousel;
