import React from "react";
import { FaMicroscope } from "react-icons/fa";
import { Microscope, CircleCheckBig, Dumbbell } from "lucide-react";
import images from "../../images/images";
import { Divider } from "@mantine/core";
type Props = {};

const IconAboutUs = (props: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 h-auto bg-[#2A3244] text-white  py-6 gap-6">
    <div className="flex flex-col items-center justify-center text-center px-4 border-r-2">
      <Microscope size={80} className="text-white" />
      <h1 className="text-2xl font-semibold mt-2">Science-Backed</h1>
      <p className="text-lg">Clinically studied ingredients</p>
  
    </div>
    <div className="flex flex-col items-center justify-center text-center px-4 border-r-2">
      <Dumbbell size={80} className="text-white" />
      <h1 className="text-2xl font-semibold mt-2">Strengthens Immunity</h1>
      <p className="text-lg">Maintain good Immunity</p>
      <Divider orientation="vertical" />
    </div>
  
    <div className="flex flex-col items-center justify-center text-center px-4 border-r-2">
      <CircleCheckBig size={80} className="text-white" />
      <h1 className="text-2xl font-semibold mt-2">Gold Standard</h1>
      <p className="text-lg">Premium Quality Supplements</p>
    </div>
  
    <div className="flex flex-col items-center justify-center text-center px-4">
      <img src={images.IndianFlagIcon} alt="" className="w-24 h-24" />
      <h1 className="text-2xl font-semibold mt-2">Proudly Indian</h1>
      <p className="text-lg">Sourced & manufactured in India</p>
    </div>
  </div>
  
  );
};

export default IconAboutUs;
