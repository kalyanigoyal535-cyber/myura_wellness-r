import React from "react";
import NewBrandAccordion from "../components/newBrandAccordion/NewBrandAccordion";
import { Carousel } from "@mantine/carousel";
import IconAboutUs from "../components/iconAboutUs/IconAboutUs";
import images from "../images/images";
import OurTeam from "../components/ourTeam/OurTeam";

type Props = {};

const About = (props: Props) => {
  return (
    <div>
      {/* about us  */}
      <div className="grid grid-cols-12 bg-[#F8F8F8] py-8 px-4 md:px-12 gap-6">
        {/* Left Section (Image Placeholder) */}
        <div className="col-span-12 md:col-span-6 flex justify-center items-center">
          <div className="bg-gray-700 w-full max-w-md h-48 md:h-64 rounded-xl"></div>
        </div>

        {/* Right Section (Text) */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center text-center md:text-left">
          <h1 className="text-2xl md:text-3xl tracking-wide font-semibold mb-2">
            About Us
          </h1>
          <p className="tracking-wide text-sm md:text-base leading-relaxed">
            At Myura, we're building more than a brand—we're creating a movement
            for authentic, science-backed natural health. Our core belief is
            simple: honesty, purity, and craftsmanship are non-negotiable. We
            take ancient Ayurvedic wisdom and validate it with modern science to
            deliver solutions that simply work.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 bg-[#2A3244] py-8 px-4 md:h-[400px]">
        {/* Left Section */}
        <div className="col-span-12 md:col-span-6 flex flex-col justify-center text-white mb-6 md:mb-0 md:px-8">
          <h1 className="text-2xl md:text-3xl font-semibold underline mb-2 text-center md:text-left">
            How We're Different
          </h1>
          <p className="font-medium tracking-wide text-sm md:text-base text-center md:text-left">
            We create purpose-built formulas that directly address your daily
            needs—from enhancing energy and hormonal balance to boosting gut
            health and joint support. Our products are engineered for optimal
            absorption and maximum benefit, constantly evolving based on real
            customer feedback.
          </p>
        </div>

        {/* Right Section (Video) */}
        <div className="col-span-12 md:col-span-6 flex justify-center items-center rounded-xl">
          <div className="aspect-video w-full max-w-md">
            <iframe
              className="w-full h-full rounded-xl"
              src="https://www.youtube.com/embed/tkZfN6ZPuBo"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      <NewBrandAccordion />
      {/* culture at myura  */}
      <IconAboutUs />
      <div className="grid grid-cols-1 md:grid-cols-12 h-auto md:h-[350px] gap-4  md:mb-52">
        {/* Text Section */}
        <div className="md:col-span-6 flex flex-col justify-center items-center px-6 md:px-16 bg-[#2A3244] text-white rounded-xl order-2 md:order-1">
          <h1 className="text-2xl md:text-3xl font-semibold mb-3 text-center md:text-left">
            How We're Different
          </h1>
          <p className="text-sm md:text-base text-center md:text-left">
            We create purpose-built formulas that directly address your daily
            needs—from enhancing energy and hormonal balance to boosting gut
            health and joint support. Our products are engineered for optimal
            absorption and maximum benefit, constantly evolving based on real
            customer feedback.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:col-span-6 flex justify-center items-center order-1 md:order-2">
          <img
            src={images.HowWeAreDIfferentImage}
            alt="How we are different image"
            className="w-full md:w-7/12 rounded-lg"
          />
        </div>
      </div>

      {/* about our team  */}
      <div>
          <OurTeam />
      </div>
    </div>
  );
};

export default About;
