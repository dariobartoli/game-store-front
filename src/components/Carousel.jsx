import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from '../styles/Carousel.module.css'

const Carousel = ({ images }) => {
    if (!images || !Array.isArray(images)) {
        return <div>No images to display</div>;
    }

  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    speed: 1200,
    autoplaySpeed: 5000,
    cssEase: "linear",
    pauseOnHover: true
  };
  return (
    <Slider {...settings} className={styles.images__container}>
      {images.map((image, index) => (
        <div key={index}>
          <img src={image} alt={`Image ${index}`} className={styles.image}/>
        </div>
      ))}
    </Slider>
  );
};

export default Carousel;
