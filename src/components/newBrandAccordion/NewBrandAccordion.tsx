import React from "react";
import { Accordion } from "@mantine/core";
type Props = {};

const NewBrandAccordion = (props: Props) => {
  const data = [
    {
      value: "Transparency First",
      description:
        "We believe you deserve to know exactly what fuels your body. That means full ingredient disclosure, clear benefits, and absolutely no harmful additives. Honesty is our first and best ingredient.",
    },
    {
      emoji: "🍌",
      value: "Bananas",
      description:
        "Naturally sweet and potassium-rich fruit. Bananas are a popular choice for their energy-boosting properties and can be enjoyed as a quick snack, added to smoothies, or used in baking.",
    },
    {
      emoji: "🥦",
      value: "Broccoli",
      description:
        "Nutrient-packed green vegetable. Broccoli is packed with vitamins, minerals, and fiber. It has a distinct flavor and can be enjoyed steamed, roasted, or added to stir-fries.",
    },
  ];
  const items = data.map((item) => (
    <Accordion.Item key={item.value} value={item.value}>
      <Accordion.Control icon={item.emoji}>{item.value}</Accordion.Control>
      <Accordion.Panel>{item.description}</Accordion.Panel>
    </Accordion.Item>
  ));
  return (
    <div className=" grid grid-cols-12 h-[350px] ">
      <div className="col-span-12  flex  items-center justify-center flex-col">
        <h1 className=" text-3xl font font-semibold">Why Trust a New Brand?</h1>
        <p className="text-xl">
          At Myura wellness , we’re dedicated to delivering the highest quality
          products.
        </p>
      </div>
      <div className="col-span-12 md:col-span-6  w-6/12 flex  justify-center  items-center  ">
        <Accordion
          variant="separated"
          radius="lg"
          chevronIconSize={12}
          defaultValue="Apples"
        >
          {items}
        </Accordion>
      </div>
      <div className="col-span-12 md:col-span-6  bg-gray-50 "></div>
    </div>
  );
};

export default NewBrandAccordion;
