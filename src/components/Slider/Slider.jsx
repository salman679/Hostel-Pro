import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { motion } from "motion/react";
import PropTypes from "prop-types";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function Slider({ searchQuery, setSearchQuery }) {
  const banners = [
    {
      title: "Streamline Hostel Life with Ease",
      description:
        "Efficient meal management, seamless reviews, and enhanced convenience.",
      image:
        "https://i.ibb.co.com/WGS22Sf/tbbteam-philippines-siargao-sinag-hostel.webp",
    },
    {
      title: "Administer Meals Like Never Before",
      description:
        "Manage menus, reviews, and student feedback with a few clicks.",
      image: "https://i.ibb.co.com/Pjxy4gj/p0c0tpbh-jpg.webp",
    },
    {
      title: "Tailored for Hostel Students",
      description: "Enjoy delicious meals and share your reviews effortlessly.",
      image:
        "https://i.ibb.co.com/9317Kk4/group-of-young-tourists-standing-in-youth-hostel-guest-house-happy-multiracial-friends.webp",
    },
  ];

  return (
    <div className="">
      <div className="container mx-auto px-4 md:px-6 ">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          className="rounded-lg overflow-hidden"
        >
          {banners.map((banner, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] bg-cover bg-center"
                style={{ backgroundImage: `url(${banner.image})` }}
              >
                <div className="absolute inset-0 bg-black text-left bg-opacity-50 flex items-center justify-center ">
                  <div className="text-left w-full px-14 md:px-24">
                    <motion.h2
                      animate={{ opacity: 1, y: [-50, 0] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                      initial={{ opacity: 0, y: -50 }}
                      className="text-3xl  sm:text-5xl md:text-6xl lg:text-7xl text-white font-bold max-w-xs md:max-w-lg"
                    >
                      {banner.title}
                    </motion.h2>
                    <motion.p
                      animate={{ opacity: 1, x: [-50, 0] }}
                      initial={{ opacity: 0, x: -50 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatType: "mirror",
                      }}
                      className="text-white  text-lg sm:text-xl md:text-2xl mt-2 max-w-xs  md:max-w-xl"
                    >
                      {banner.description}
                    </motion.p>

                    <label className="input input-bordered flex items-center gap-2 max-w-[300px] mt-5">
                      <input
                        type="text"
                        className="grow"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

Slider.propTypes = {
  searchQuery: PropTypes.string,
  setSearchQuery: PropTypes.func,
};
