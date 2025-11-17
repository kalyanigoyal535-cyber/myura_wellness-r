import React, { useState } from "react";
import { Accordion } from "@mantine/core";

type Props = {};

const NewBrandAccordion = (props: Props) => {
  const [opened, setOpened] = useState<string | null>(null);

  const data = [
    {
      value: "Transparency First",
      description:
        "We believe you deserve to know exactly what fuels your body. That means full ingredient disclosure, clear benefits, and absolutely no harmful additives. Honesty is our first and best ingredient.",
      image: "https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2021/06/google-photos-logo.png",
    },
    {
      value: "Science Meets Tradition",
      description:
        "We don't guess; we prove. We select herbs with documented Ayurvedic success and combine them with ingredients backed by rigorous modern research. Every formula is crafted with precision and purpose.",
      image: "https://static0.anpoimages.com/wordpress/wp-content/uploads/2022/01/google-photos-motion-hero.jpg",
    },
    {
      emoji: "🥦",
      value: "Quality Without Compromise",
      description:
        "We reject mass production. Through small-batch crafting and strict quality checks, we guarantee exceptional standards. We won't sell anything we wouldn't proudly give to our own family.",
      image: "https://www.howtogeek.com/731976/how-to-manage-and-free-up-google-photos-storage-space/",
    },
  ];

  const items = data.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));

  const currentImage = data.find((item) => item.value === opened)?.image;

  return (
    <div className="grid grid-cols-12 m-4 ">
      <div className="col-span-12 flex items-center justify-center flex-col">
        <h1 className="text-3xl font-semibold">Why Trust a New Brand?</h1>
        <p className="text-xl">
          At Myura wellness, we’re dedicated to delivering the highest quality products.
        </p>
      </div>

      {/* Accordion Section */}
      <div className="col-span-12 md:col-span-6 flex justify-center items-center">
      <div className="w-full">   {/* Or w-64, w-96, w-[300px] */}
  <Accordion
    variant="separated"
    radius="lg"
    chevronIconSize={12}
    value={opened}
    onChange={setOpened}
  >
    {items}
  </Accordion>
</div>
       
      </div>

      {/* Image Section */}
      <div className="col-span-12 md:col-span-6 bg-gray-50 flex justify-center items-center">
        {currentImage ? (
          <img
            src={currentImage}
            alt="Selected"
            className="w-72 h-72 object-cover rounded-xl shadow-lg transition-all duration-300"
          />
        ) : (
          <p className="text-gray-500">Click an item to see its image</p>
        )}
      </div>
    </div>
  );
};

export default NewBrandAccordion;
