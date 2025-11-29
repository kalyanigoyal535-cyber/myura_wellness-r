import React from "react";
import NewBrandAccordion from "../components/newBrandAccordion/NewBrandAccordion";
import { Carousel } from "@mantine/carousel";
import IconAboutUs from "../components/iconAboutUs/IconAboutUs";
import images from "../images/images";
import OurTeam from "../components/ourTeam/OurTeam";
import HeroAboutSection from "../components/heroAboutSection/HeroAboutSection";

type Props = {};

const About = (props: Props) => {
  return (
    <div>
      {/* about us  */}
      <section className="w-full bg-[#F8F8F8] py-12 md:py-16">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      
      {/* Image Section */}
      <div className="col-span-12 md:col-span-6 flex justify-center items-center">
        <div className="relative rounded-2xl overflow-hidden shadow-md bg-[#1E2738]">
          {/* Soft glow */}
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-[#5BD4C5] opacity-20 blur-2xl pointer-events-none" />
          
          <img
            src={images.AboutUsImage}
            alt="About Myura"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Text Section */}
      <div className="col-span-12 md:col-span-6 flex flex-col justify-center text-center md:text-left">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-[#1E2738]/10 text-[#2A3244] border border-[#2A3244]/10 mb-3 md:mb-4 mx-auto md:mx-0">
          Our Story
        </span>

        <h2 className="text-2xl md:text-3xl font-semibold text-[#1E2738] mb-3 md:mb-4 leading-snug">
          About Us
        </h2>

        <p className="text-sm md:text-base text-gray-700 leading-relaxed">
          At Myura, we're building more than a brand—we're creating a movement
          for authentic, science-backed natural health. Our core belief is
          simple: <span className="text-[#1E2738] font-medium">honesty, purity, and craftsmanship</span> 
          are non-negotiable. We combine ancient Ayurvedic wisdom with modern
          scientific validation to deliver solutions that simply work.
        </p>

        {/* Optional CTA Button / Learn more */}
        {/* <div className="mt-5 md:mt-6">
          <button className="px-5 py-2 text-sm md:text-base rounded-full bg-[#1E2738] text-white hover:bg-[#141b25] transition-all">
            Learn More
          </button>
        </div> */}
      </div>

    </div>
  </div>
</section>


      <section className="w-full bg-[#1E2738] py-12 md:py-16">
  <div className="max-w-6xl mx-auto px-4 md:px-8">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center">
      {/* Left Section */}
      <div className="col-span-12 md:col-span-6 text-white">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-[#C8D3F0] border border-white/10 backdrop-blur-sm mb-3">
          Our Approach
        </span>

        <h2 className="text-2xl md:text-3xl font-semibold mb-3 md:mb-4 leading-snug">
          How We&apos;re Different
        </h2>

        <p className="font-medium tracking-wide text-sm md:text-base text-gray-200 leading-relaxed mb-4">
          We create purpose-built formulas that directly address your daily
          needs—from enhancing energy and hormonal balance to boosting gut health
          and joint support. Our products are engineered for optimal absorption
          and maximum benefit, constantly evolving based on real customer
          feedback.
        </p>

        <ul className="space-y-2 text-xs md:text-sm text-gray-300">
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#5BD4C5]" />
            <span>Targeted formulas for real, everyday needs.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#5BD4C5]" />
            <span>Designed for higher absorption and consistent results.</span>
          </li>
          <li className="flex gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#5BD4C5]" />
            <span>Improved continuously based on real customer feedback.</span>
          </li>
        </ul>
      </div>

      {/* Right Section (Video) */}
      <div className="col-span-12 md:col-span-6 flex justify-center items-center">
        <div className="w-full max-w-xl">
          <div className="relative rounded-2xl bg-[#222b3a] p-4 md:p-5 shadow-xl overflow-hidden">
            {/* Glow accent */}
            <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 bg-[#5BD4C5] opacity-20 blur-2xl" />

            {/* Small label */}
            <div className="relative z-10 mb-3 flex items-center justify-between gap-2">
        
              <span className="text-[11px] px-2 py-1 rounded-full bg-white/5 text-gray-200 border border-white/10">
                0:52 min
              </span>
            </div>

            {/* Video */}
            <div className="relative z-10">
              <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-lg">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/zQHCDwjzGoY"
                  title="Myura Men’s Vitality Booster"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Caption */}
            <p className="relative z-10 mt-3 text-[11px] md:text-xs text-gray-300 leading-relaxed">
              Get a closer look at how Myura Men&apos;s Vitality Booster is crafted
              and why it stands apart from typical one-size-fits-all supplements.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* <FoundersNote/> */}
      <HeroAboutSection />

      <NewBrandAccordion />
      {/* culture at myura  */}

      <IconAboutUs />
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:h-[400px] md:mb-52 p-4">
  {/* Image Section */}
  <div className="md:col-span-6 flex justify-center items-center order-1 md:order-1">
    <div className="relative w-full max-w-[450px]">
      <img
        src={images.yourBestHealth}
        alt="Wellness Image"
        className="w-full rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
      />
      {/* Accent element */}
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-xl bg-[#FACC15]/20 blur-xl hidden md:block"></div>
    </div>
  </div>

  {/* Text Section */}
  <div className="md:col-span-6 flex flex-col justify-center px-8 py-8 bg-[#2A3244] text-white rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 order-2 md:order-2">
    <h1 className="text-2xl md:text-4xl font-bold leading-snug mb-4 text-center md:text-left">
      Your Best Health Is Waiting — Are You Ready?
    </h1>

    <p className="text-sm md:text-base text-white/80 leading-relaxed text-center md:text-left">
      Experience the synergy of ancient Ayurvedic wisdom and modern science with
      <span className="text-[#38BDF8] font-medium"> MYURA</span>.
      Wake up refreshed, feel balanced, and stay unstoppable all day.
      <br />
      <br />
      Our advanced botanical formulations detoxify naturally, enhance vitality,
      support hormonal balance, aid digestion, and fortify joint health — helping
      you feel lighter and more alive from within.
      <br />
      <br />
      <span className="font-medium text-white">
        No fillers. No shortcuts. Just clean, transparent ingredients crafted
        for real results.
      </span>
    </p>
  </div>
</div>


      {/* about our team  */}
      <div>{/* <OurTeam /> */}</div>
    </div>
  );
};

export default About;

export const NewSection = () => {
  return <div>NewSection</div>;
};
