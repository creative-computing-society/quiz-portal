import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper";


// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

import styles from "../Style/carousel.module.css";

// import required modules



import img1 from "../Assets/img1.jpg";
import img2 from "../Assets/img2.jpg";
import img3 from "../Assets/img3.jpg";
import img4 from "../Assets/img4.jpg";
import img5 from "../Assets/img5.jpg";


function Carousel() {
  return (
    <div className={styles.center}>
      <Swiper
        id="carouselid"
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        breakpoints={{
          640: {
            // width: 640,
            slidesPerView: 2,
          },
         
        }}
        pagination={true}
        modules={[Autoplay, EffectCoverflow, Pagination]}
        className={styles.swiper}
      >
        {/* <SwiperSlide><img src={img1} alt="ipsum1" /></SwiperSlide>
        <SwiperSlide><img src={img2} alt="ipsum2" /></SwiperSlide> */}
        <SwiperSlide className={styles.swiperSlide}>
          <img src={img1} alt="ipsum3" className={styles.carouselImage} />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <img src={img2} alt="ipsum3" className={styles.carouselImage} />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <img src={img3} alt="ipsum3" className={styles.carouselImage} />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <img src={img4} alt="ipsum3" className={styles.carouselImage} />
        </SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}>
          <img src={img5} alt="ipsum3" className={styles.carouselImage} />
        </SwiperSlide>
        {/* <SwiperSlide className={styles.swiperSlide}><img src="https://picsum.photos/300/400" alt="ipsum3" /></SwiperSlide>
        <SwiperSlide className={styles.swiperSlide}><img src="https://picsum.photos/300/400" alt="ipsum3" /></SwiperSlide> */}
      </Swiper>
    </div>
  );
}

export default Carousel;
