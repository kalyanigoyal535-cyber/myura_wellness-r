import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const team = [
  {
    name: "Shevya Chaturvedi ",
    role: "Content Strategist",
    img: "https://images.unsplash.com/photo-1614288408701-6f3cbbe714b4",
    intro:
      "At MYURA, I envision and lead the entire content journey — from building a consistent brand voice to writing compelling narratives across our website, social media, campaigns, and beyond. With a background in journalism from the University of Delhi and currently pursuing my master’s, I bring over 4 years of experience in content writing, editing, and digital storytelling. My focus is on creating content that informs, engages, and builds trust — while aligning every word with our core purpose.",
  },
  {
    name: "Shailesh Kumar Gupta",
    role: "Motion Graphic Designer",
    img: "https://images.unsplash.com/photo-1603415526960-f7e0328c63b1",
    intro:
      "At MYURA, I envision and lead the entire content journey — from building a consistent brand voice to writing compelling narratives across our website, social media, campaigns, and beyond. With a background in journalism from the University of Delhi and currently pursuing my master’s, I bring over 4 years of experience in content writing, editing, and digital storytelling. My focus is on creating content that informs, engages, and builds trust — while aligning every word with our core purpose.",
  },
  {
    name: "Sombir Beniwal",
    role: " Digital Marketing Specialist ",
    img: "https://images.unsplash.com/photo-1606925797303-0a470f47f3c4",
    intro:
      "With proven expertise in performance marketing, lead generation, and marketing strategy, I bring a result-oriented approach to digital growth. Having managed 40+ brands across diverse sectors, I now focus on creating impactful campaigns tailored to the health and wellness industry driving quality leads & Conversions, building brand presence, and ensuring measurable outcomes. ",
  },
  {
    name: "Kalyani Goyal",
    role: "Full Stack Developer ",
    exp: "3 years of experience",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    intro:
      "I am a full stack developer experienced in building web applications using React, Django, JavaScript, Python, and REST APIs. I have worked on dashboards, e-commerce platforms, real-time chat/voice systems, and 3D model customization using Three.js. I have hands-on experience with authentication (JWT), Redis caching, WebSockets using Django Channels, and deployment workflows. I’ve also developed AR effects for SparkAR and built professional client-facing websites (like Hygaar). I enjoy solving product, UI, and system design challenges with clean, scalable code and a strong focus on user experience.",
  },
  {
    name: "Atul Tiwari",
    role: "Front-End Developer",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    intro:
      "I’m Atul Tiwari, a front-end developer who loves creating products that are fast, clean, and easy to use. I enjoy transforming ideas into functional and visually appealing web experiences with modern tools and frameworks. I always explore new technologies, improve my skills, and challenge myself to create things that make a difference.",
  },
  {
    name: "Simran Bhatia",
    role: "Hr Generalist ",
    exp: "3 years of experience",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    intro:
      "I’m Simran Bhatia, a dynamic and detail-oriented HR professional with hands-on experience in talent acquisition, onboarding, and employee relations. Over the years, I’ve worked with organizations such as Watran Pharmaceuticals, Yuno Learning and Hindustan Recruitment, managing end-to-end recruitment and supporting various HR operations. My background also includes experience in admissions and counseling, which strengthened my communication and people management skills. Currently pursuing an MBA from Chandigarh University, I aim to continue growing within a progressive HR team and contribute to building positive, productive workplaces.",
  },
];

export default function TeamEmbla() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-10 px-6">
      {/* Heading */}
      <h2 className="text-center text-3xl font-bold">Meet Our Team</h2>

      {/* Blue dots */}
      {/* <div className="flex justify-center gap-2 mt-3">
        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
        <span className="w-3 h-3 rounded-full bg-blue-300"></span>
        <span className="w-3 h-3 rounded-full bg-blue-200"></span>
        <span className="w-3 h-3 rounded-full bg-blue-100"></span>
      </div> */}

      {/* Slider Container */}
      <div className="relative mt-8">
        {/* Embla viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          {/* Embla container */}
          <div className="flex">
            {team.map((member, i) => (
              <div
                key={i}
                className="
          p-4
          flex-[0_0_100%] max-w-[100%]               // Mobile → 1 slide
          sm:flex-[0_0_50%] sm:max-w-[50%]           // Tablet → 2 slides
          lg:flex-[0_0_33.333%] lg:max-w-[33.333%]   // Desktop → 3 slides
        "
              >
               <div className="bg-white rounded-xl border shadow-md flex flex-col h-full">

                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-64 object-cover rounded-t-xl"
                  />

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold">{member.name}</h3>
                    <p className="text-gray-500 text-sm">{member.role}</p>

                    <p className="text-sm text-gray-600 mt-3  mb-4">
                      {member.intro}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prev Arrow */}
        <button
          onClick={scrollPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
        >
          ‹
        </button>

        {/* Next Arrow */}
        <button
          onClick={scrollNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center"
        >
          ›
        </button>
      </div>
    </div>
  );
}
