import MealsByCategory from "../components/Meals/MealsByCategory";
import Membership from "../components/Membership/Membership";
import Slider from "../components/Slider/Slider";
import CustomerTestimonials from "../components/Testimonials/CustomerTestimonials";

export default function Home() {
  return (
    <>
      <Slider />
      <MealsByCategory />
      <Membership />
      <CustomerTestimonials />
    </>
  );
}
