import React from "react";

const HeroAboutSection = () => {
  const sections = [
    {
      title: "Where Our Ingredients Come From",
      text: `We believe the best results start with the best ingredients. That's why we don't cut corners. We carefully pick every organic herb and raw material, choosing sources where they grow best and naturally reach their highest quality. It's simple: we treat our ingredients like gold, so they can bring you maximum benefit.`,
      reverse: false,
    },
    {
      title: "Everything We Make Is Triple-Checked",
      text: `Your safety is our top priority. Before anything leaves our facility, we send every single batch to independent labs. They test for everything—metals, contaminants, anything that shouldn't be there. If it doesn't pass these strict tests for safety and purity, we won't sell it. We want you to feel 100% confident in what you're putting into your body.`,
      reverse: true,
    },
    {
      title: "We're Here to Help You Succeed",
      text: `Think of us as your wellness support team. We're not just selling products; we're cheering you on. If you have questions about your health journey, need guidance on a product, or just want to learn more, our friendly team is here. You get genuine answers and real care, helping you feel healthier every day.`,
      reverse: false,
    },
  ];

  return (
    <div className="w-full space-y-16 md:space-y-24 m-8">
      {sections.map((sec, idx) => (
        <div
          key={idx}
          className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center m-4"
        >
          {/* Text Section */}
          <div
            className={`md:col-span-6 flex flex-col justify-center px-6 md:px-12 ${
              sec.reverse ? "order-2 md:order-2" : "order-1 md:order-1"
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-[#2A3244]">
              {sec.title}
            </h2>
            <p className="text-sm md:text-base text-gray-700">{sec.text}</p>
          </div>

          {/* Placeholder Image Section */}
          <div
            className={`md:col-span-6 flex justify-center items-center ${
              sec.reverse ? "order-1 md:order-1" : "order-2 md:order-2"
            }`}
          >
            <div className="w-full md:w-8/12 h-[250px] md:h-[300px] bg-blue-200 rounded-lg flex items-center justify-center text-blue-600 text-sm md:text-base">
              Image Placeholder
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroAboutSection;
