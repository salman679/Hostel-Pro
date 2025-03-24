import { Outlet } from "react-router-dom";
import Header from "../components/sheard/Header/Header";
import Footer from "../components/Sheard/Footer/Footer";

export default function Main() {
  return (
    <>
      <Header />
      <main className="container mx-auto ">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
