"use client";

import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import PartnerSection from "@/components/home/partner_home";
import TopTrainingSection from "@/components/home/training_home";
import ArticleSection from "@/components/home/article_home";

const Home = () => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Data states
  const [slides, setSlides] = useState([]);
  const [partnersData, setPartnersData] = useState({
    Institution: [],
    College: [],
  });
  const [topCourses, setTopCourses] = useState([]);
  const [highlightArticles, setHighlightArticles] = useState([]);
  const [reviewCards, setReviewCards] = useState([]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const sectionRef = useRef(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch and prepare all required home data
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [slidesRes, instRes, collRes, courseRes, articleRes, reviewRes] =
          await Promise.all([
            fetch(`${BASE_URL}/api/home/`),
            fetch(`${BASE_URL}/api/partner/search?category=1&status=1`),
            fetch(`${BASE_URL}/api/partner/search?category=2&status=1`),
            fetch(`${BASE_URL}/api/training?sort_order=desc&sort_by=graduates`),
            fetch(`${BASE_URL}/api/articles?sort_by=views&sort_order=desc`),
            fetch(`${BASE_URL}/api/review/search?score=5`),
          ]);

        const [
          slidesData,
          instJson,
          collJson,
          courseJson,
          articleJson,
          reviewJson,
        ] = await Promise.all([
          slidesRes.json(),
          instRes.json(),
          collRes.json(),
          courseRes.json(),
          articleRes.json(),
          reviewRes.json(),
        ]);

        const isYoutubeLink = (url) =>
          /(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/.test(url);

        const extractYoutubeID = (url) => {
          const match = url.match(/(?:youtube\.com\/(?:.*v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
          return match ? match[1] : '';
        };

        setSlides(
          (slidesData.data || [])
            .sort((a, b) => a.content_id.localeCompare(b.content_id))
            .map((item) => {
              const isYoutube = isYoutubeLink(item.content_link);
              const youtubeID = extractYoutubeID(item.content_link);
              return {
                type: isYoutube ? "video" : "image",
                src: isYoutube
                  ? `https://www.youtube.com/embed/${youtubeID}?autoplay=1&mute=1`
                  : item.content_link,
              };
            })
        );

        setPartnersData({
          Institution: instJson.data || [],
          College: collJson.data || [],
        });

        setTopCourses((courseJson.data || []).slice(0, 3));
        setHighlightArticles((articleJson.data || []).slice(0, 6));

        const reviews = (reviewJson.data || []).sort(() => Math.random() - 0.5);
        const cards = reviews.map((rev) => ({
          user: rev.fullname,
          avatar: rev.user_photo || "/default-avatar.jpg",
          courseTitle: rev.training_name,
          level: rev.level || "Unknown",
          rating: 5,
          comment:
            rev.review_description.length > 150
              ? rev.review_description.slice(0, 150) + "..."
              : rev.review_description,
          id: rev.review_id,
        }));
        setReviewCards(cards.slice(0, 10));
      } catch (err) {
        console.error("Failed to load home data:", err);
      }
    };

    loadAllData();
  }, []);

  // Slide autoplay & YouTube integration
  useEffect(() => {
    let timer;
    let player;

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    const checkVideoEnd = () => {
      const iframe = document.querySelector("iframe");
      if (iframe && window.YT) {
        player = new window.YT.Player(iframe, {
          events: {
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                nextSlide();
              }
            },
          },
        });
      }
    };

    if (!slides[currentSlide]) return;

    if (slides[currentSlide].type === "video") {
      if (window.YT) {
        checkVideoEnd();
      } else {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        window.onYouTubeIframeAPIReady = checkVideoEnd;
        document.body.appendChild(tag);
      }
    } else {
      timer = setTimeout(() => nextSlide(), 2000);
    }

    return () => {
      clearTimeout(timer);
      if (player?.destroy) player.destroy();
    };
  }, [currentSlide, slides]);

  // Fade-in animation trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => sectionRef.current && observer.unobserve(sectionRef.current);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white">
      <div className="relative w-full max-h-[90vh] flex items-center justify-center">
        <div className="w-full aspect-[21/9] relative overflow-hidden">
          {/* Banner Slide */}
          <div
            className="flex transition-transform duration-1000 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                {slide.type === "video" && currentSlide === index ? (
                  <div className="relative w-full h-full">
                    <div className="absolute top-0 left-0 w-full h-full">
                      <iframe
                        key={currentSlide}
                        className="w-full h-full"
                        src={`${slide.src}&enablejsapi=1&modestbranding=1&rel=0&autoplay=1&mute=1`}
                        title="IIoT Training Video"
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                ) : slide.type === "image" ? (
                  <div className="relative w-full h-full">
                    <img
                      src={slide.src}
                      alt="Slide"
                      className="w-full h-full object-cover object-center"
                      style={{ aspectRatio: "21/9" }}
                    />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[5px] flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${currentSlide === index ? "border-mainOrange" : "border-gray-400"
                }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                  }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      {/* Empowering Tomorrow Section */}
      <div
        ref={sectionRef}
        className={'mx-auto bg-mainBlue p-10 shadow-xl transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0" }'} >
        <h1 className="text-3xl font-bold text-white">Empowering Tomorrow :</h1>
        <h2 className="text-2xl font-semibold text-white">
          Efortech’s Innovative Education Solutions
        </h2>
      </div>

      {/* Efortech Solutions */}
      <div className="relative flex flex-col md:flex-row justify-between items-center mt-6 lg:mt-16 md:mt-10 sm:mt-6 gap-8">
        {/* Container gambar */}
        <div className="relative flex justify-center items-center mt-10 sm:mt-2">
          <img
            src="/assets/foto2.png"
            alt="Image 1"
            className="shadow-xl z-10"
            style={{ width: 'clamp(140px, 28vw, 50vw)' }}
          />
          <img
            src="/assets/gambar1.jpg"
            alt="Image 2"
            className="shadow-xl z-20"
            style={{
              width: 'clamp(140px, 28vw, 50vw)',
              marginTop: '4rem',
            }}
          />
        </div>

        <div className="relative bg-orange-600 text-white p-6 w-full md:w-[65%] mt-0 lg:mt-32 md:mt-10 sm:mt-0">
          <div className="relative z-30">
            <h2 className="text-xl md:text-3xl font-bold text-right">Efortech Solutions</h2>
            <p className="text-xs md:text-sm mt-3 pl-12 lg:pl-24 md:pl-10 sm:pl-16 text-right">
              Offers training and certification programs focused on the implementation of the Industrial Internet of Things (IIoT) through the use of a Smart Integrated IIoT Training Kit.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us? */}
      <div className="flex flex-col p-8 mt-10">
        <h2 className="text-xl md:text-3xl font-bold text-black text-center md:text-right">
          Why Choose Us?
        </h2>
        <p className="text-sm md:text-lg font-semibold text-mainOrange text-center md:text-right mt-2 mb-8">
          Using Smart Integrated IIoT Training Kit
        </p>
        <img
          src="/assets/kit.png"
          alt="IIoT Diagram"
          className="rounded-lg w-[800px] mt-[-30px] mx-auto"
        />
      </div>

      {/* What Will You Get? */}
      <div className="flex flex-col p-10 items-center">
        <h2 className="text-xl md:text-3xl font-bold text-black">
          What Will You Get?
        </h2>
        <p className="text-sm md:text-lg text-mainOrange text-center font-semibold mt-2 mb-8">
          Enhance Your Skills with Our IIoT Trainer Kit Features
        </p>
        <img
          src="/assets/get.svg"
          alt="IIoT Kit"
          className="rounded-lg w-[600px] mt-[10px] mx-auto"
        />
      </div>

      {/* Partner */}
      <PartnerSection partnersData={partnersData} />

      <div className="text-center px-4 py-4">
        {/* Top Training */}
        <TopTrainingSection topCourses={topCourses} />

        {/* Educational Article Highlight */}
        <ArticleSection highlightArticles={highlightArticles} />

        {/* Review */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10 md:gap-20 mt-10 px-4 md:px-16 mb-20">
          {/* Review Cards */}
          <div className="w-full md:w-[50%] flex justify-center">
            <Swiper
              effect={"cards"}
              grabCursor={true}
              modules={[EffectCards]}
              className="w-[280px] sm:w-[300px] h-[420px] overflow-visible"
              cardsEffect={{
                perSlideRotate: 0,
                perSlideOffset: 10,
                slideShadows: false,
              }}
            >
              {reviewCards.map((card, idx) => (
                <SwiperSlide key={card.id}>
                  <div
                    className="text-white text-center p-6 rounded-[20px] h-full flex flex-col items-center justify-start"
                    style={{
                      backgroundColor: idx % 2 === 0 ? "#014AAD" : "#F26B1D",
                    }}
                  >
                    <img
                      src={card.avatar}
                      alt={card.user}
                      className="w-36 h-36 rounded-full object-cover aspect-square"
                    />
                    <div className="flex flex-col items-center mt-2 gap-2">
                      <h3 className="text-xl font-bold mt-2">{card.user}</h3>
                      <p className="text-xs text-center text-white/80">
                        {card.courseTitle}
                      </p>
                      <hr className="w-48 border-t-1 border-white/70" />
                      <div className="flex space-x-1 text-xl tracking-tight">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className={
                              i < card.rating ? "text-yellow-400" : "text-white"
                            }
                          >
                            {i < card.rating ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs bg-white text-black px-4 py-2 rounded-md leading-relaxed text-center w-50">
                        “
                        {card.comment.length > 120
                          ? card.comment.slice(0, 120) + "..."
                          : card.comment}
                        ”
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Review Section Heading */}
          <div className="w-full md:w-[50%] text-center md:text-left">
            <h2 className="text-xl md:text-3xl font-bold text-black">
              What They Say?
            </h2>
            <p className="text-mainOrange text-sm md:text-lg font-semibold md:pl-8 mt-2">
              About this program
            </p>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-white shadow-lg rounded-full p-3 transition hover:bg-gray-100"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6 text-mainOrange"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;