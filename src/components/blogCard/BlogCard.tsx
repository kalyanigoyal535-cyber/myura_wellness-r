import React from "react";
import images from "../../images/images";
type Props = {};

const BlogCard = (props: Props) => {
  return (
    <div className="col-span-12 md:col-span-4 m-4">
      <img
        src={images.BannerImageDesktop2}
        alt="Blogimage"
        className="w-[550px]"
      />
      <h1 className="text-2xl font-semibold">
        Unlock Thicker, Stronger Hair with Plant-Based Biotin: The Ultimate
        Guide to Cureveda Grow
      </h1>
      <p className="mt-2">
        Got thinning hair or finding clumps in your brush? Don’t worry it’s
        super common when stress, diet, or just life throws your hair off track.
        Cureveda Grow is a total lifesaver if you want thicker .
      </p>
      <div className="flex justify-between">
        <p>
            Date:10/11/25
        </p>
        <p className="underline">
            Shevya 
        </p>
      </div>
    </div>
  );
};

export default BlogCard;

// export const TempCard = () => {
//   return (
//     <div className="col-span-12 md:col-span-4 mx-2">
//     {/* Card content */}
//     <div className="flex  px-6 py-4 m-2">
//       <img
//         src={images.BannerImageDesktop1}
//         alt="Blogimage"
//         className="w-24 h-32"
//       />
//       <div className="ml-10">
//         <h1 className="font-semibold text-xl">The Men's Vitality Booster</h1>
//         <p className="text-sm text-gray-700">
//           Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo vel id
//           deserunt soluta, quidem nobis fugit error minima nam inventore ea
//           dolore tempora sint eius et, veritatis dolor quasi delectus.
//         </p>
//         <Link to="#" className="underline text-lime-700">
//           Read More
//         </Link>
//       </div>
//     </div>
//     <Divider size="sm" color="gray" />

//   </div>
//   )
// }
