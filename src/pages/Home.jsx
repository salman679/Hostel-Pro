import MealsByCategory from "../components/Meals/MealsByCategory";
import Membership from "../components/Membership/Membership";
import Slider from "../components/Slider/Slider";
import SpecialOffers from "../components/SpecialOffers/SpecialOffers";
import Testimonials from "../components/Testimonials/Testimonials";

export default function Home() {
  return (
    <>
      <Slider />
      <MealsByCategory />
      <SpecialOffers />
      <Membership />
      <Testimonials />
    </>
  );
}
