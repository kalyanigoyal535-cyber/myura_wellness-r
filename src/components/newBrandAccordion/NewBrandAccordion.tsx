import React, { useState } from "react";
import { Accordion } from "@mantine/core";
import AboutUsImage1 from "../../images/aboutUsImage/AboutUsImage.png";
import AboutUsImage2 from "../../images/aboutUsImage/AboutUs2.png";
import AboutUsImage3 from "../../images/aboutUsImage/AboutUs3.png";

const NewBrandAccordion = () => {
  const data = [
    {
      value: "Transparency First",
      description:
        "We believe you deserve to know exactly what fuels your body. That means full ingredient disclosure, clear benefits, and absolutely no harmful additives. Honesty is our first and best ingredient.",
      image: AboutUsImage1,
    },
    {
      value: "Science Meets Tradition",
      description:
        "We don't guess; we prove. We select herbs with documented Ayurvedic success and combine them with ingredients backed by rigorous modern research. Every formula is crafted with precision and purpose.",
      image: AboutUsImage2,
    },
    {
      value: "Quality Without Compromise",
      description:
        "We reject mass production. Through small-batch crafting and strict quality checks, we guarantee exceptional standards. We won't sell anything we wouldn't proudly give to our own family.",
      image: AboutUsImage3,
    },
  ];

  const [opened, setOpened] = useState<string | null>(data[0].value);
  const currentItem = data.find((item) => item.value === opened);
  const currentImage = currentItem?.image;

  return (
    <section className="w-full bg-[#F8F8F8] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#8D9BB6] mb-2">
            Why Trust Us
          </p>
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1E2738] mb-3">
            Why Trust a New Brand?
          </h1>
          <p className="text-sm md:text-base text-gray-600 leading-relaxed">
            At Myura Wellness, we’re committed to delivering absolute purity,
            backed by science and complete transparency.
          </p>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
          {/* Accordion */}
          <div className="col-span-12 md:col-span-5">
            <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 border border-gray-100">
              <Accordion
                variant="separated"
                radius="lg"
                chevronSize={16}
                value={opened}
                onChange={setOpened}
              >
                {data.map((item) => (
                  <Accordion.Item key={item.value} value={item.value}>
                    <Accordion.Control>
                      <div className="flex items-center gap-2">
                        <span className="text-sm md:text-base font-medium">
                          {item.value}
                        </span>
                      </div>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <p className="text-sm md:text-[15px] leading-relaxed text-gray-600">
                        {item.description}
                      </p>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-span-12 md:col-span-7 order-first md:order-none">
            <div className="relative rounded-2xl overflow-hidden bg-[#1E2738] p-5 md:p-8 shadow-lg">
              {/* Glow (less intense on mobile) */}
              <div className="pointer-events-none absolute md:-right-10 md:-top-10 w-28 h-28 md:w-40 md:h-40 bg-[#5BD4C5] opacity-20 blur-xl md:blur-3xl" />

              {/* Tag */}
              <div className="relative z-10 mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium bg-white/10 text-[#C8D3F0] border border-white/10 backdrop-blur-sm">
                  {currentItem?.value || "Select an option"}
                </span>
              </div>

              {/* Image */}
              <div className="relative z-10">
                {currentImage ? (
                  <div
                    className="
                      w-full
                      aspect-[4/1]        /* mobile: keep as before */
                      md:aspect-[3/1]      /* desktop: taller image */
                      rounded-xl
                      overflow-hidden shadow-lg
                      border border-white/10
                      bg-black/10
                      mx-auto
                    "
                  >
                    <img
                      src={currentImage}
                      alt={currentItem?.value}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-gray-300 text-center text-sm py-8">
                    Tap an item to preview.
                  </p>
                )}
              </div>

              {/* Caption */}
              <p className="relative z-10 mt-4 md:mt-6 text-xs md:text-sm text-gray-300 leading-relaxed">
                Every promise here reflects how we formulate and test each
                product—so you feel confident from label to last dose.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewBrandAccordion;
