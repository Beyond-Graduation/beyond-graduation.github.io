import React from "react";
import "./About.css";
import sourav from "../../../assets/images/sourav.jpeg";
import natasha from "../../../assets/images/natasha.jpg";
import kishor from "../../../assets/images/nanda kishor.jpg";
import paurnami from "../../../assets/images/paurnami.jpg";

const About = () => {
  return (
    <div className="about">
      <div className="about-cnt">
        <div className="about-head mt-5">What is Beyond Graduation?</div>
        <div className="d-lg-flex about-main align-items-center justify-content-between">
          <div>
            Beyond Graduation is a platform where alumni and students can
            interact with each other by sharing experiences and getting
            visibility over our Alumni Network and features that facilitate
            focused alumni searching. This platform encourages students to
            connect with Alumni with similar interests and grow beyond
            graduation.
          </div>
          <div>
            <img
              src="https://images.shiksha.com/mediadata/images/1568879912phpvKYujb.jpeg"
              alt=""
            />
          </div>
        </div>
        <div className="about-head mt-5">Our Team</div>
        <div className="d-flex flex-wrap">
          <div className="about-person text-center">
            <img src={sourav} alt="Sourav Satheesh" />
            <div className="about-name">Sourav Satheesh</div>
            <div className="about-role">Frontend Developer</div>
          </div>
          <div className="about-person text-center">
            <img src={natasha} alt="" />
            <div className="about-name">Natasha Mathew</div>
            <div className="about-role">Frontend Developer</div>
          </div>
          <div className="about-person text-center">
            <img src={kishor} alt="" />
            <div className="about-name">Nanda Kishor M Pai</div>
            <div className="about-role">Backend Developer</div>
          </div>
          <div className="about-person text-center">
            <img src={paurnami} alt="" />
            <div className="about-name">Paurnami Pradeep</div>
            <div className="about-role">Backend Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
