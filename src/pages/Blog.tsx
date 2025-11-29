import React, { useEffect } from "react";
import { Calendar, MessageCircle, ArrowLeft, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { Button, Divider, Input } from "@mantine/core";
import BlogSection from "../components/blogTabs/BlogSection";
import AOS from "aos";
import "aos/dist/aos.css";

const Blog: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
    });

    // Helps avoid blank/hidden content on first load
    setTimeout(() => {
      AOS.refresh();
    }, 200);
  }, []);

  return (
    <section
      className="min-h-screen bg-[#F8F8F8] py-8 md:py-12"
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Top bar */}
        <div
          className="flex items-center justify-between mb-4 md:mb-6"
          data-aos="fade-up"
          data-aos-delay="50"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm md:text-base text-[#1F2839] hover:text-[#0f1724] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          {/* Optional CTA */}
          <div className="flex items-center gap-2">
            <Input
              placeholder="Email-ID"
              rightSection={<Search className="w-4 h-4 text-gray-400" />}
              radius="xl"
              size="sm"
            />
            <Button
              variant="outline"
              radius="xl"
              size="xs"
              className="hidden md:inline-flex text-[#1F2839]"
            >
              Subscribe
            </Button>
          </div>
        </div>

        <Divider my="sm" data-aos="fade-up" data-aos-delay="100" />

        {/* Blog content section */}
        <div
          className="bg-white rounded-2xl shadow-sm md:shadow-md border border-gray-100 p-4 md:p-6"
          data-aos="fade-up"
          data-aos-delay="150"
        >
          <BlogSection />
        </div>
      </div>
    </section>
  );
};

export default Blog;
