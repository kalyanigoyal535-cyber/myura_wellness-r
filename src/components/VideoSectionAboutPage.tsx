import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {

    Sparkles,
    Play,
    Pause,

  } from "lucide-react";

type Props = {};

const VideoSectionAboutPage = (props: Props) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const promoVideoRef = useRef<HTMLVideoElement | null>(null);
  const promoVideoSectionRef = useRef<HTMLDivElement | null>(null);
  const handleTogglePromoVideo = useCallback(() => {
    const videoEl = promoVideoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      void videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
    }
  }, []);

  useEffect(() => {
    const sectionEl = promoVideoSectionRef.current;
    const videoEl = promoVideoRef.current;
    if (!sectionEl || !videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const currentVideo = promoVideoRef.current;
        if (!currentVideo) return;

        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          if (currentVideo.paused) {
            currentVideo.muted = true;
            void currentVideo.play().catch(() => {});
          }
        } else if (!currentVideo.paused) {
          currentVideo.pause();
        }
      },
      { threshold: [0, 0.3, 0.6, 0.85] }
    );

    observer.observe(sectionEl);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const videoEl = promoVideoRef.current;
    if (!videoEl) return;

    const handlePlay = () => setIsVideoPlaying(true);
    const handlePause = () => setIsVideoPlaying(false);
    const handleEnded = () => setIsVideoPlaying(false);

    videoEl.addEventListener("play", handlePlay);
    videoEl.addEventListener("pause", handlePause);
    videoEl.addEventListener("ended", handleEnded);

    return () => {
      videoEl.removeEventListener("play", handlePlay);
      videoEl.removeEventListener("pause", handlePause);
      videoEl.removeEventListener("ended", handleEnded);
    };
  }, []);

  return (
    <div>
      <section className="py-20 bg-gradient-to-b from-stone-50 via-white to-stone-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={promoVideoSectionRef}
            className="relative overflow-hidden rounded-[2.75rem] border border-white/40 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-[0_52px_140px_-60px_rgba(15,23,42,0.75)]"
          >
            <div className="pointer-events-none absolute -left-32 top-16 h-[260px] w-[260px] rounded-full bg-emerald-400/25 blur-[120px]" />
            <div className="pointer-events-none absolute -right-28 bottom-12 h-[320px] w-[320px] rounded-full bg-rose-400/20 blur-[120px]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
            <video
              ref={promoVideoRef}
              className="relative block w-full aspect-[16/9] object-cover transition duration-500 ease-out"
              src="/Myura%204Product%20Reveal.mp4"
              preload="metadata"
              muted
              playsInline
              controls={isVideoPlaying}
              controlsList="nodownload"
            />
            <div
              className={`absolute inset-0 flex flex-col justify-between p-6 sm:p-10 transition-opacity duration-500 ${
                isVideoPlaying ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <div className="flex flex-col gap-4 sm:gap-6 text-white max-w-lg">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] backdrop-blur">
                  <Sparkles className="h-3.5 w-3.5 text-rose-200" />
                  Myura Signature Ritual
                </span>
                <div className="space-y-3">
                  <h3 className="text-[1.9rem] sm:text-[2.3rem] font-display font-semibold leading-tight drop-shadow-[0_10px_30px_rgba(8,47,73,0.55)]">
                    Unlock The Four Pillars of Everyday Wellness
                  </h3>
                  <p className="text-sm sm:text-base text-slate-100/90 leading-relaxed font-premium">
                    Step inside our lab with an immersive reveal of the blends
                    that power the Myura ritual. Immerse in the textures,
                    craftsmanship, and Ayurvedic intelligence behind each
                    formula.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 gap-3 text-white">
                <div className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.28em]">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                  Discover the ritual
                </div>
                <button
                  type="button"
                  onClick={handleTogglePromoVideo}
                  className="group inline-flex items-center gap-3 self-start rounded-full bg-white/95 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.28em] text-slate-900 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.6)] transition-transform duration-300 hover:translate-y-[-1px] hover:shadow-[0_26px_70px_-36px_rgba(15,23,42,0.65)]"
                  aria-label={
                    isVideoPlaying
                      ? "Pause product reveal video"
                      : "Play product reveal video"
                  }
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-[0_10px_24px_-16px_rgba(15,23,42,0.45)] transition duration-300 group-hover:scale-105">
                    {isVideoPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </span>
                  <span>{isVideoPlaying ? "Pause Story" : "Play Film"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VideoSectionAboutPage;
