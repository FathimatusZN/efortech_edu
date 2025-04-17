"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-cards";
import { institutions, colleges } from "./partner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaAngleRight } from "react-icons/fa";
import Link from "next/link";
import {courses, reviews, articles} from "./dummydata"

const Home = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { type: "image", src: "/assets/Slide-1.svg" },
    { type: "video", src: "https://www.youtube.com/embed/1Ddx4gRhPbA?autoplay=1&mute=1&enablejsapi=1&rel=0&modestbranding=1&playsinline=1" },
    { type: "image", src: "/assets/Slide-2.svg" },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    let timer;
    let player;
  
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
      timer = setTimeout(() => {
        nextSlide();
      }, 2000);
    }

    return () => {
      clearTimeout(timer);
      if (player?.destroy) {
        player.destroy();
      }
    };
  }, [currentSlide]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const [selectedCategory, setSelectedCategory] = useState("College");
  const partners = selectedCategory === "Institution" ? institutions : colleges;
  const scrollRef = useRef(null);

  useEffect(() => {
    const scrollEl = scrollRef.current;
    let scrollAmount = 0;

    const slide = () => {
      if (scrollEl) {
        scrollAmount += 1;
        if (scrollAmount >= scrollEl.scrollWidth / 2) {
          scrollAmount = 0;
        }
        scrollEl.scrollLeft = scrollAmount;
      }
    };

    const interval = setInterval(slide, 20);
    return () => clearInterval(interval);
  }, []);

  const repeatedPartners = [...partners, ...partners];

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  
  const getDiscountedPrice = (price, discount) => {
    if (!discount) return price;
    return Math.round(price - (price * discount) / 100);
  };
  
  const getReviewCount = (courseId) =>
    reviews.filter((review) => review.courseId === courseId).length;

  const reversedArticles = [...articles].reverse();

  const cards = [
  {
    name: "John Doe",
    role: "IoT Training Participant",
    avatar: "https://i.pravatar.cc/100?img=1",
    rating: 4,
    testimonial:
      "Pelatihan ini sangat bermanfaat! Materinya jelas, aplikatif, dan langsung bisa diterapkan. Saya merasa lebih percaya diri dalam mengembangkan proyek berbasis teknologi setelah mengikuti workshop ini.",
  },
  {
    name: "Jane Smith",
    role: "Software Engineer",
    avatar: "https://i.pravatar.cc/100?img=2",
    rating: 5,
    testimonial:
      "Fasilitatornya luar biasa dan pendekatannya sangat praktikal. Banyak hal baru yang saya pelajari dan bisa langsung saya terapkan dalam pekerjaan saya sehari-hari.",
  },
  {
    name: "Michael Lee",
    role: "Product Manager",
    avatar: "https://i.pravatar.cc/100?img=3",
    rating: 4,
    testimonial:
      "Program ini membuka wawasan saya mengenai penerapan IoT dalam pengembangan produk. Sangat direkomendasikan untuk siapapun yang ingin upgrade skill di era digital ini.",
  },
  {
    name: "Ayu Lestari",
    role: "Tech Enthusiast",
    avatar: "https://i.pravatar.cc/100?img=4",
    rating: 5,
    testimonial:
      "Pengalaman yang sangat menyenangkan! Saya merasa lebih siap untuk menghadapi tantangan teknologi terbaru setelah mengikuti pelatihan ini.",
  },
];

  return (
    <div className="bg-white">
      <div className="relative w-full h-[600px] flex items-center justify-center mt-[-50px]">
        <div className="w-full max-w-[1200px] h-[400px] md:h-[450px] relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                {slide.type === "video" ? (
                  <iframe
                    key={currentSlide}
                    className="w-full h-full absolute top-0 left-0 px-1 rounded-xl"
                    src={`${slide.src}?enablejsapi=1&modestbranding=1&rel=0&autoplay=1`}
                    title="IIoT Training Video"
                    frameBorder="0"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="relative w-full max-w-[1400px] mx-auto px-[4px] max-h-[450px] rounded-lg mb-4">
                    <img
                      src={slide.src}
                      alt="Slide"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {(index === 0 || index === 2) && (
                      <Button
                        onClick={() => {
                          if (index === 2) {
                            window.location.href = "/article";
                          } else {
                            window.location.href = "/training";
                          }
                        }}
                        variant="orange"
                        size="xl"
                        className={`absolute top-[76%] font-semibold shadow-lg
                          ${index === 0 ? "left-[8%]" : "left-[66%]"}
                          w-[110px] h-[32px] sm:w-[130px] sm:h-[36px] md:w-[150px] md:h-[40px]
                          text-xs sm:text-sm md:text-base`}
                      >
                        {index === 2 ? "See Article" : "Enroll Now"}
                      </Button>
                )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-[220px] sm:bottom-[100px] md:bottom-10 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full border-2 flex items-center justify-center transition-all ${
                currentSlide === index ? "border-mainOrange" : "border-gray-400"
              }`}
            >
              <div
                className={`w-1 h-1 rounded-full ${
                  currentSlide === index ? "bg-mainOrange" : "bg-transparent"
                }`}
              ></div>
            </button>
          ))}
        </div>
      </div>

      <div
        ref={sectionRef}
        className={`mx-auto bg-mainBlue p-10 shadow-xl transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <h1 className="text-3xl font-bold text-white">Empowering Tomorrow :</h1>
        <h2 className="text-2xl font-semibold text-white">
          Efortech’s Innovative Education Solutions
        </h2>
      </div>

      <div className="relative flex flex-col md:flex-row justify-between md:items-start mt-16">
      <div className="relative flex flex-col md:flex-row justify-center items-center  gap-4 mt-16">
        <img
          src="/assets/foto2.png"
          alt="Image 1"
          className="w-[400px] md:w-[300px] shadow-lg"
        />
        <img
          src="/assets/gambar1.jpg"
          alt="Image 2"
          className="w-[400px] md:w-[300px] shadow-lg md:absolute md:left-[300px] md:top-12"
        />
      </div>
      <div className="bg-orange-600 text-white p-6 w-full md:w-[700px] mt-20">
        <h2 className="text-3xl font-bold text-right">Efortech Solutions</h2>
        <p className="text-sm mt-3 text-right pl-6">
          Offers training and certification programs focused on the implementation of the Industrial
          Internet of Things (IIoT) through the use of a Smart Integrated IIoT Training Kit.
        </p>
      </div>
    </div>

      <div className="flex flex-col p-8 mt-10">
          <h2 className="text-2xl font-bold text-black text-right">Why Choose Us?</h2>
          <p className="text-lg text-mainOrange font-semibold text-right mt-2 mb-8">
            Using Smart Integrated IIoT Training Kit
          </p>
        <img
          src="/assets/kit.png"
          alt="IIoT Diagram"
          className="rounded-lg w-[800px] mt-[-30px] mx-auto"
        />
      </div>

      <div className="flex flex-col p-10 items-center">
          <h2 className="text-2xl font-bold text-black text-right">What Will You Get?</h2>
          <p className="text-lg text-mainOrange font-semibold text-right mt-2 mb-8">
            Enhance Your Skills with Our IIoT Trainer Kit Features
          </p>
        <img
          src="/assets/get.svg"
          alt="IIoT Kit"
          className="rounded-lg w-[600px] mt-[10px] mx-auto"
        />
      </div>

      <div className="text-center p-16">
        <h2 className="text-2xl font-bold text-black">Our Partner</h2>
        <div className="flex justify-center p-4 gap-4 my-4">
          <button
            className={`px-4 py-2 min-w-[120px] border rounded-full shadow-lg ${selectedCategory === "Institution" ? "bg-mainBlue text-white" : "border-mainBlue"}`}
            onClick={() => setSelectedCategory("Institution")}
          >
            Institution
          </button>
          <button
            className={`px-4 py-2 min-w-[120px] border rounded-full shadow-lg ${selectedCategory === "College" ? "bg-mainBlue text-white" : "border-mainBlue"}`}
            onClick={() => setSelectedCategory("College")}
          >
            College
          </button>
        </div>

        <div className="relative w-full max-w-6xl mx-auto overflow-x-hidden  px-8">
        <div
          ref={scrollRef}
          className="flex gap-6 mt-4 pb-10 overflow-x-auto overflow-y-visible scroll-smooth no-scrollbar"
        >
        {repeatedPartners.map((partner, index) => (
          <div
            key={`${partner.id}-${index}`}
            className="relative w-32 h-36 group cursor-pointer flex justify-center items-center flex-shrink-0"
          >
            {/* Layer nama mitra */}
            <div className="absolute bottom-[-32px] left-1/2 transform -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-300 z-10">
            <div className="bg-white border-2 border-mainOrange text-mainOrange text-sm font-semibold py-1 px-2 rounded-md text-center break-words w-fit max-w-none shadow-md line-clamp-3">
              {partner.name}
            </div>
          </div>

            {/* Layer tengah */}
            <div className="absolute w-full h-24 bottom-0 rounded-md overflow-hidden flex flex-col">
              <div className="h-1/2 bg-white w-full"></div>
              <div className="h-1/2 bg-gray-200 w-full"></div>
            </div>

            {/* Layer logo */}
            <div className="relative z-20 w-20 h-20 bg-white rounded-md shadow-md flex items-center justify-center">
              <img
                src={partner.logo}
                alt={partner.name}
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
        ))}
      </div>
    </div>

      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-screen-xl mx-auto">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Top Courses & Certifications</h2>
          <Link
            href="/training"
            className="text-sm text-gray-600 hover:underline flex items-center gap-1"
          >
            See All <FaAngleRight className="text-xs" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses
            .map((course) => ({
              ...course,
              graduateCount: getReviewCount(course.id),
            }))
            .sort((a, b) => b.graduateCount - a.graduateCount)
            .slice(0, 3)
            .map((course) => {
              const discountedPrice = getDiscountedPrice(course.price, course.discount);

              return (
                <Card
                  key={course.id}
                  className="shadow-md rounded-xl overflow-hidden min-h-[400px] transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-48 w-full object-cover"
                    />
                    <span className="absolute top-2 left-2 bg-mainBlue text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {course.level}
                    </span>
                    {course.discount && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-[2px] rounded-full shadow-md animate-bounce">
                        🔥 {course.discount}% OFF
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-4 text-left">
                      {course.title}
                    </h3>
                    <p className="text-sm italic text-gray-500 mb-8 text-left">
                      Graduates: {course.graduateCount.toLocaleString()} Mentee
                      {course.graduateCount !== 1 ? "'s" : ""}
                    </p>
                    <hr className="mb-3" />
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col text-sm font-semibold">
                        {course.discount && (
                          <span className="line-through text-gray-400 text-xs">
                            {formatCurrency(course.price)}
                          </span>
                        )}
                        <span>{formatCurrency(discountedPrice)}</span>
                      </div>
                      <Link href={`/training/${course.id}`}>
                      <Button variant="orange" size="sm">
                        View Details
                      </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      <div className="py-10 px-4">
        <div className="flex justify-between items-center mb-6 ">
          <h2 className="text-3xl font-bold">Educational Article Highlight</h2>
          <Link
            href="/article"
            className="text-sm text-gray-600 hover:underline flex items-center gap-1"
          >
            See All <FaAngleRight className="text-xs" />
          </Link>
        </div>

        <Swiper
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          modules={[Autoplay]}
        >
          {articles.map((article, idx) => (
            <SwiperSlide key={idx}>
              <Card className="p-0 bg-transparent shadow-none border-none mt-4">
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-60 w-full object-cover rounded-tl-2xl"
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold text-base mb-2 text-left">
                    {article.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 text-left">
                    Category: {article.category}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, tagIdx) => (
                      <div
                        key={tagIdx}
                        className="border border-mainOrange text-black rounded-lg px-3 py-1 text-xs"
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    <div className="flex flex-col md:flex-row justify-between items-center mt-20">
    <div className="text-center md:text-left">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
          What They Say?
        </h2>
        <p className="text-mainOrange text-md sm:text-lg md:text-xl font-semibold mt-2">
          About this program
        </p>
      </div>
      <div className="w-full flex">
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards]}
        className="w-[300px] h-[420px] overflow-visible"
        cardsEffect={{
        perSlideRotate: 0,
        perSlideOffset: 10,
        slideShadows: false, }}
        >
        {cards.map((card, idx) => (
  <SwiperSlide key={idx}>
    <div
      className="text-white text-center p-6 rounded-[20px] h-full flex flex-col items-center justify-between"
      style={{ backgroundColor: idx % 2 === 0 ? "#014AAD" : "#F26B1D" }}
    >
      <img
        src={card.avatar}
        alt={card.name}
        className="w-20 h-20 rounded-full mb-2 object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{card.name}</h3>
        <p className="text-sm text-white/80">{card.role}</p>
        <div className="my-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i}>
              {i < card.stars ? "⭐" : "☆"}
            </span>
          ))}
        </div>
        <p className="text-sm text-white/90 mt-2">
          “{card.testimonial}”
        </p>
      </div>
    </div>
  </SwiperSlide>
))}
      </Swiper>
    </div>
    </div>


    </div>
  </div>
  );
};

export default Home;