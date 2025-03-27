import { Star } from "lucide-react";
import { useEffect, useState } from "react";

export default function Testimonials() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testimonials = [
    {
      name: "Alex Smith",
      feedback:
        "The meal quality at Hostel Pro is exceptional. Ive been a Standard plan member for 6 months and the variety of options keeps me satisfied every day.",
      rating: 5,
      image: "https://i.ibb.co.com/y6hZTqf/speaker-3.jpg",
    },
    {
      name: "Jessica Lee",
      feedback:
        "As a student with dietary restrictions, I appreciate how Hostel Pro accommodates my needs. The Premium plan is worth every penny for the customization options.",
      rating: 5,
      image: "https://i.ibb.co.com/JHFCMd7/180709-A-SP580-001.jpg",
    },
    {
      name: "Michael Johnson",
      feedback:
        "The weekend specials are always something to look forward to. Hostel Pro has transformed my hostel experience with their consistent quality and friendly service.",
      rating: 4,
      image: "https://i.ibb.co.com/D7FmZt6/images.jpg",
    },
  ];

  return (
    // <div className="p-8 bg-gray-100">
    //   <h2 className="text-3xl font-bold text-center mb-6">
    //     What Our Customers Say
    //   </h2>
    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {testimonials.map((testimonial, index) => (
    //       <div key={index} className="card shadow-md p-4">
    //         <figure className="mb-4">
    //           <img
    //             src={testimonial.image}
    //             alt={testimonial.name}
    //             className="rounded-full w-24 mx-auto"
    //           />
    //         </figure>
    //         <div>
    //           <h3 className="text-xl font-bold text-center">
    //             {testimonial.name}
    //           </h3>
    //           <p className="text-center italic text-gray-600">
    //             &quot;{testimonial.feedback}&quot;
    //           </p>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>

    <section className="py-10 sm:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
          What Our Members Say
        </h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Hear from our satisfied members about their experience
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100"
            >
              <div className="flex items-center mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-800 rounded-full mr-3">
                  <img
                    src={testimonial.image}
                    alt="image"
                    className="object-cover w-full h-full rounded-full"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">
                    {testimonial.name}
                  </h4>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={windowWidth < 640 ? 14 : 16}
                        className={`${
                          i < testimonial.rating
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                &quot;{testimonial.feedback}&quot;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
