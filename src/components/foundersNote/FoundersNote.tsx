import React from "react";
import AOS from "aos";
import { useEffect } from "react";
const FoundersNote = () => {
    useEffect(() => {
        AOS.init({
          duration: 800, // animation duration
          easing: "ease-in-out", // smooth easing
          once: true, // whether animation should happen only once
          offset: 120, // offset from the top
        });
      }, []);
  return (
    <div className="bg-white py-12" >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 px-6 md:px-16">
        {/* LEFT TEXT SECTION */}
        <div className="col-span-12 md:col-span-6 max-w-xl space-y-5">
          <h1 className="text-3xl font-bold tracking-wide mb-4 relative">
            <span className="border-l-4 border-[#2A3244] pl-3">
              Founder's Note
            </span>
          </h1>

          <p className="text-gray-700 leading-relaxed">
            At MYURA, we don’t just make wellness products—we nurture daily
            rituals of self-care rooted in nature’s intelligence.
          </p>

          <p className="text-gray-700 leading-relaxed">
            The idea behind MYURA was born in a personal space. Like many of
            you, I’ve seen loved ones struggle with lifestyle imbalances—
            digestive discomfort, low energy, joint stiffness—not serious enough
            for treatment, but enough to impact how we feel every day.
          </p>

          <p className="text-gray-700 leading-relaxed">
            That’s where MYURA comes in.
          </p>

          <p className="text-gray-700 leading-relaxed">
            Blending time-honoured Ayurvedic wisdom with modern science, we
            create plant-powered solutions that are clean, balanced, and crafted
            to fit into real, everyday lives. No exaggerated promises. No
            shortcuts.
          </p>

          {/* SIGNATURE SECTION */}
          <div className="mt-6">
            <h3 className="font-semibold text-lg">— Vinay Chahal</h3>
            <p className="text-gray-600">Founder & Director, MYURA Wellness</p>

            <h3 className="font-semibold text-lg mt-3">— Jatin Lather</h3>
            <p className="text-gray-600">Founder & Director, MYURA Wellness</p>
          </div>
        </div>

        {/* RIGHT IMAGE SECTION */}
        <div className="col-span-12 md:col-span-6 bg-[#2A3244] rounded-xl flex items-center justify-center p-8 text-white">
          <h1 className="text-lg opacity-80">Image will be displayed here</h1>
        </div>
      </div>
      <div className="my-20 bg-white">
  <div className="grid grid-cols-1 md:grid-cols-12 gap-10 px-6 md:px-16">

    {/* LEFT IMAGE SECTION */}
    <div className="col-span-12 md:col-span-6 bg-[#2A3244] rounded-xl flex items-center justify-center p-10 text-white">
      <h1 className="text-lg opacity-80">Image will be displayed here</h1>
    </div>

    {/* RIGHT TEXT SECTION */}
    <div className="col-span-12 md:col-span-6 max-w-xl space-y-5">
      <h1 className="text-3xl font-bold tracking-wide mb-4">
        <span className="border-l-4 border-[#2A3244] pl-3">
          Our Vision
        </span>
      </h1>

      <p className="text-gray-700 leading-relaxed">
        At MYURA, I envision operations as the heartbeat behind every promise
        we make. My mission is to ensure that every product we craft flows
        seamlessly—from sourcing to shelf—upholding purity, precision, and
        purpose. Because true wellness isn't just created—it’s consistently
        delivered.
      </p>

      {/* SIGNATURE */}
      <div className="pt-4">
        <p className="font-semibold text-lg">— Kamna Gautam</p>
        <p className="text-gray-600">Head of Operations, MYURA Wellness</p>
      </div>
    </div>

  </div>
</div>

    </div>
  );
};

export default FoundersNote;
