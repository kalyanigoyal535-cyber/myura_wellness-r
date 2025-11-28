import React from "react";
import img1 from "../../images/aboutUsImage/1.png";
import img2 from "../../images/aboutUsImage/2.png";
import img3 from "../../images/aboutUsImage/3.png";

const HeroAboutSection = () => {
  const sections = [
    {
      title: "Where Our Ingredients Come From",
      text: `We believe the best results start with the best ingredients. That's why we don't cut corners. We carefully pick every organic herb and raw material, choosing sources where they grow best and naturally reach their highest quality. It's simple: we treat our ingredients like gold, so they can bring you maximum benefit.`,
      reverse: false,
      image: img1,
    },
    {
      title: "Everything We Make Is Triple-Checked",
      text: `Your safety is our top priority. Before anything leaves our facility, we send every single batch to independent labs. They test for everything—metals, contaminants, anything that shouldn't be there. If it doesn't pass these strict tests for safety and purity, we won't sell it. We want you to feel 100% confident in what you're putting into your body.`,
      reverse: true,
      image: img2,
    },
    {
      title: "We're Here to Help You Succeed",
      text: `Think of us as your wellness support team. We're not just selling products; we're cheering you on. If you have questions about your health journey, need guidance on a product, or just want to learn more, our friendly team is here. You get genuine answers and real care, helping you feel healthier every day.`,
      reverse: false,
      image: img3,
    },
  ];

  return (
    <div className="w-full bg-[#F8F8F8] py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-12 md:space-y-16">
        {sections.map((sec, idx) => {
          const isHighlight = idx === 1; // middle section special

          return (
            <section
              key={idx}
              className={`rounded-2xl overflow-hidden border shadow-sm md:shadow-md transition-transform duration-200 hover:-translate-y-1
              ${
                isHighlight
                  ? "bg-[#1E2738] border-[#1E2738]"
                  : "bg-white border-gray-100"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center p-6 md:p-10">
                {/* Text Section */}
                <div
                  className={`md:col-span-6 flex flex-col justify-center order-1 ${
                    sec.reverse ? "md:order-2" : "md:order-1"
                  }`}
                >
                  <span
                    className={`text-[11px] font-semibold tracking-[0.25em] uppercase mb-2
                    ${isHighlight ? "text-[#A8B5D6]" : "text-[#8D9BB6]"}`}
                  >
                    Transparency · Quality · Care
                  </span>

                  <h2
                    className={`text-2xl md:text-3xl font-semibold mb-3 ${
                      isHighlight ? "text-white" : "text-[#2A3244]"
                    }`}
                  >
                    {sec.title}
                  </h2>

                  <p
                    className={`text-sm md:text-base leading-relaxed ${
                      isHighlight ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {sec.text}
                  </p>
                </div>

                {/* Image Section */}
                <div
                  className={`md:col-span-6 flex justify-center items-center order-2 ${
                    sec.reverse ? "md:order-1" : "md:order-2"
                  }`}
                >
                  <div className="w-full md:w-10/12 aspect-[4/3] rounded-xl overflow-hidden shadow-md">
                    <img
                      src={sec.image}
                      alt={sec.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default HeroAboutSection;
