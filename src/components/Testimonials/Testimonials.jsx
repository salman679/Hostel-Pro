export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      feedback:
        "Amazing meals and excellent service! Highly recommend to everyone.",
      image: "https://i.ibb.co.com/y6hZTqf/speaker-3.jpg",
    },
    {
      name: "Jane Smith",
      feedback: "Delicious food and prompt delivery. Five stars all the way!",
      image: "https://i.ibb.co.com/JHFCMd7/180709-A-SP580-001.jpg",
    },
    {
      name: "Michael Lee",
      feedback: "The meals are healthy and taste great. Very satisfied!",
      image: "https://i.ibb.co.com/D7FmZt6/images.jpg",
    },
  ];

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-6">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="card shadow-md p-4">
            <figure className="mb-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="rounded-full w-24 mx-auto"
              />
            </figure>
            <div>
              <h3 className="text-xl font-bold text-center">
                {testimonial.name}
              </h3>
              <p className="text-center italic text-gray-600">
                &quot;{testimonial.feedback}&quot;
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
