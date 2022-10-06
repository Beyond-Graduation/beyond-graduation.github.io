import React from "react";
import { useEffect } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import DashBlogCard from "../DasboardCards/DashBlogCard/DashBlogCard";
import DashProfilCard from "../DasboardCards/DashProfileCard/DashProfileCard";
import "./DashboardCarousel.css";

function DashboardCarousel({ cardCount, type, data, userData, ...props }) {
  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: cardCount ? cardCount : 3,
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
  return (
    <div {...props}>
      {type?.toLowerCase() === "blog" ? (
        <Carousel responsive={responsive} infinite={true}>
          {data.map((blog) => (
            <div className="carousel-card">
              <DashBlogCard blogData={blog} userData={userData} />
            </div>
          ))}
        </Carousel>
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
