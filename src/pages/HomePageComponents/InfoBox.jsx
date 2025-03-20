/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { EffectFade, Autoplay } from "swiper/modules";
import "./styles/InfoBox.css";

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
      </Swiper>
    </div>
  );
};

export default InfoBox;
