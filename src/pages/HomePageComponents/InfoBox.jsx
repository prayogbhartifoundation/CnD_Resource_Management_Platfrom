import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import "./styles/InfoBox.css";

import cr_img1 from "../../assets/corousel images/image1.png"
import cr_img2 from "../../assets/corousel images/image2.png"
import cr_img3 from "../../assets/corousel images/image3.png"
import cr_img4 from "../../assets/corousel images/image4.png"

const InfoBox = () => {
  return (
    <div className="infoBox">
      <Swiper
        effect={"fade"}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        modules={[EffectFade, Autoplay]}
        loop
      >
        {/* Slide 1: News List */}
        <SwiperSlide>
          <div className="slide-content">
            <h3>News & Updates</h3>
            <hr />
            <ul>
              <li>New Product Announcement</li>
              <li>Department Announcements</li>
              <li>Mandate/Policy update information broadcast</li>
              <li>Ongoing/Upcoming Event updates & News</li>
              <li>Deadline Alerts</li>
              <li>Other Public Broadcasts...</li>
              <li>Other Public Broadcasts...</li>
              <li>Other Public Broadcasts...</li>
            </ul>
          </div>
        </SwiperSlide>

        {/* Slide 2: Image 1 */}
        <SwiperSlide>
          <div className="slide-content">
            <img src={cr_img1} alt="Image 1" className="carousel-img" />

            <div className="imgDetails">
              Bricks
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 3: Image 2 */}
        <SwiperSlide>
          <div className="slide-content">
            <img src={cr_img2} alt="Image 2" className="carousel-img" />
            <div className="imgDetails">
              Solid Waste Separation
            </div>
          </div>
        </SwiperSlide>

        {/* Slide 4: Image 3 */}
        <SwiperSlide>
          <div className="slide-content">
            <img src={cr_img3} alt="Image 3" className="carousel-img" />
            <div className="imgDetails">
              Ever Enviro Plant
            </div>
          </div>
        </SwiperSlide>
        {/* Slide 4: Image 3 */}
        <SwiperSlide>
          <div className="slide-content">
            <img src={cr_img4} alt="Image 3" className="carousel-img" />
            <div className="imgDetails">
              Processing Steps
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default InfoBox;
