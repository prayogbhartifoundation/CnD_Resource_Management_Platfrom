
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import { Autoplay, EffectFade } from "swiper/modules";
import "./styles/homeBanner.css";

import cr_img1 from "../assets/plantOperators/image_1.jpg";
import cr_img2 from "../assets/plantOperators/image_2.jpg";
import cr_img3 from "../assets/plantOperators/image_3.jpg";
import cr_img4 from "../assets/plantOperators/image_4.jpg";
import cr_img5 from "../assets/plantOperators/image_5.jpg";
import cr_img6 from "../assets/plantOperators/image_6.jpg";
import cr_img7 from "../assets/plantOperators/image_7.jpg";

import vnncr_img1 from "../assets/plantOperators/vnn/image_1.jpg";
import vnncr_img2 from "../assets/plantOperators/vnn/image_2.jpg";
import vnncr_img3 from "../assets/plantOperators/vnn/image_3.jpg";
import vnncr_img4 from "../assets/plantOperators/vnn/image_4.jpg";
import vnncr_img5 from "../assets/plantOperators/vnn/image_5.jpg";
import vnncr_img6 from "../assets/plantOperators/vnn/image_6.jpg";
import vnncr_img7 from "../assets/plantOperators/vnn/image_7.jpg";

function Banner({ vnn }) {
  const slidesData = [
    { img: vnn ? vnncr_img1 : cr_img1, heading: vnn ? "Varanasi" : "Burari", subHeading: vnn ? "Indo Enviro Integrated Solutions (P) Limited" : "Uttar Dilli C&D Waste Recycling (P) Ltd", description: "--" },
    { img: vnn ? vnncr_img2 : cr_img2, heading: vnn ? "Varanasi" : "Burari", subHeading: vnn ? "Indo Enviro Integrated Solutions (P) Limited" : "Uttar Dilli C&D Waste Recycling (P) Ltd", description: "--" },
    { img: vnn ? vnncr_img3 : cr_img3, heading: vnn ? "Varanasi" : "Shastri Park", subHeading: "Indo Enviro Integrated Solutions (P) Limited", description: "--" },
    { img: vnn ? vnncr_img4 : cr_img4, heading: vnn ? "Varanasi" : "Burari", subHeading: vnn ? "Indo Enviro Integrated Solutions (P) Limited" : "Uttar Dilli C&D Waste Recycling (P) Ltd", description: "--" },
    { img: vnn ? vnncr_img5 : cr_img5, heading: vnn ? "Varanasi" : "Shastri Park", subHeading: "Indo Enviro Integrated Solutions (P) Limited", description: "--" },
    { img: vnn ? vnncr_img6 : cr_img6, heading: vnn ? "Varanasi" : "Ranikhera", subHeading: "Indo Enviro Integrated Solutions (P) Limited", description: "--" },
    { img: vnn ? vnncr_img7 : cr_img7, heading: vnn ? "Varanasi" : "Burari", subHeading: vnn ? "Indo Enviro Integrated Solutions (P) Limited" : "Uttar Dilli C&D Waste Recycling (P) Ltd", description: "--" },
  ];

  return (
    // <div className="relative flex justify-center align-middle w-full h-[350px] sm:h-[400px] md:h-[500px] lg:h-full overflow-hidden">
    <div className="relative w-full overflow-hidden  banner-container">
      <Swiper
        effect="fade"
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        modules={[EffectFade, Autoplay]}
        loop={true}
        className="w-full h-full rounded-md shadow-lg"
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Background image */}
              <img
                src={slide.img}
                alt={`Slide ${index + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>

              {/* Text Overlay */}
              <div className="absolute bottom-0 left-0 w-full md:w-1/2 h-full flex flex-col justify-end p-4 sm:p-6 md:p-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-2">
                  {slide.logo && (
                    <img
                      src={slide.logo}
                      alt="Logo"
                      className="h-[40px] sm:h-[60px] w-[60px] sm:w-[90px] rounded-md bg-white p-[5px]"
                    />
                  )}
                  <div className="text-white text-2xl sm:text-4xl md:text-5xl font-bold leading-tight">
                    {slide.heading}
                  </div>
                </div>
                <div className="text-gray-300 text-lg sm:text-xl md:text-2xl mb-1">
                  {slide.subHeading}
                </div>
                {/* <div className="text-gray-400 text-sm sm:text-base md:text-lg max-w-[90%] leading-relaxed">
                  {slide.description}
                </div> */}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default Banner;
