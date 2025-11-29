import {useEffect} from "react";
import { Microscope, CircleCheckBig, Dumbbell } from "lucide-react";
import images from "../../images/images";
import AOS from "aos";
import "aos/dist/aos.css";
type Props = {};

const IconAboutUs = (props: Props) => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);
  return (
    <div className="bg-[#1E2433] text-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Optional small label – remove if not needed */}
        <p className="text-center text-sm uppercase tracking-[0.2em] font-bold underline text-white/60 mb-2">
          Why Choose Us
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 px-5 py-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#38BDF8]/15 transition-colors">
              <Microscope className="h-10 w-10 text-[#38BDF8]" />
            </div>
            <h3 className="text-lg font-semibold">Science-Backed</h3>
            <p className="mt-2 text-sm text-white/70">
              Formulated with clinically studied ingredients.
            </p>
          </div>

          {/* Card 2 */}
          <div className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 px-5 py-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#22C55E]/15 transition-colors">
              <Dumbbell className="h-10 w-10 text-[#22C55E]" />
            </div>
            <h3 className="text-lg font-semibold">Strengthens Immunity</h3>
            <p className="mt-2 text-sm text-white/70">
              Supports your body&apos;s natural defense system.
            </p>
          </div>

          {/* Card 3 */}
          <div className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 px-5 py-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#FACC15]/15 transition-colors">
              <CircleCheckBig className="h-10 w-10 text-[#FACC15]" />
            </div>
            <h3 className="text-lg font-semibold">Gold Standard</h3>
            <p className="mt-2 text-sm text-white/70">
              Premium quality supplements you can rely on.
            </p>
          </div>

          {/* Card 4 */}
          <div className="group flex flex-col items-center text-center rounded-2xl border border-white/10 bg-white/5 px-5 py-7 shadow-md transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-xl">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 group-hover:bg-[#F97316]/15 transition-colors overflow-hidden">
              <img
                src={images.IndianFlagIcon}
                alt="Indian flag"
                className="h-10 w-10 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold">Proudly Indian</h3>
            <p className="mt-2 text-sm text-white/70">
              Thoughtfully sourced & manufactured in India.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconAboutUs;
