import React from "react";
import "./Home.css";
import home_logo from "../../../assets/images/home-grad-logo.png"

function Home() {
  return (
    <div className="home">
      <div className="home-main">
		<img src={home_logo} className="home-logo" alt="" />
		<h1 className="home-heading">Beyond<br/> Graduation</h1>
		<h2 className="home-subheading">Keeping connections alive</h2>
	  </div>
    </div>
  );
}

export default Home;
