import React from "react";

type Props = {};

const About = (props: Props) => {
  return (
    <div>
      {/* about us  */}
      <div className=" grid grid-cols-12 h-[300px]">
        <div className="col-span-12 md:col-span-6 m-4 min-h-92 bg-gray-700 w-10/12 mx z-auto   ">
        {/* img */}
        </div>
        <div className="col-span-12 md:col-span-6 m-12 ">
          <h1 className="text-3xl tracking-wide font-semibold ">About us</h1>
          <p className="mt-1 tracking-wide">
            At Myura, we're building more than a brand—we're creating a movement
            for authentic, science-backed natural health. Our core belief is
            simple: honesty, purity, and craftsmanship are non-negotiable. We
            take ancient Ayurvedic wisdom and validate it with modern science to
            deliver solutions that simply work.
          </p>

        </div>
      </div>

      <div className=" grid grid-cols-12 h-[300px]">
        <div className="col-span-12 md:col-span-6 m-4 min-h-92 bg-gray-700 w-10/12 mx z-auto   ">
        {/* img */}
        </div>
        <div className="col-span-12 md:col-span-6 m-12 ">
         
          
        </div>
      </div>
    </div>
  );
};

export default About;
