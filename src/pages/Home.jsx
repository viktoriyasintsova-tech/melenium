import Hero from "../components/Hero";
import Bestsellers from "../components/Bestsellers";
import Categories from "../components/Categories";
import Promotions from "../components/Promotions";
import OurSpaces from "../components/OurSpaces";
import PaymentMarquee from "../components/PaymentMarquee";
import ScentQuiz from "../components/ScentQuiz";
import Certificates from "../components/Certificates";
import Delivery from "../components/Delivery";
import Contacts from "../components/Contacts";

export default function Home() {
  return (
    <>
      <section
        id="hero-section"
        data-header-tone="dark"
        className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#1a1208] text-white lg:min-h-screen"
        style={{
          backgroundImage: "url('/assets/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }}
      >
        <div className="absolute inset-0 bg-black/15" />
        <Hero />
      </section>

      <OurSpaces />
      <PaymentMarquee />
      <Bestsellers />
      <ScentQuiz />
      <Categories />
      <Promotions />
      <Certificates />
      <Delivery />
      <Contacts />
    </>
  );
}
