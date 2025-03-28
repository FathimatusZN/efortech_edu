"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { EffectCoverflow, Pagination } from 'swiper/modules';
import { institutions, colleges } from "./partner";

const Home = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredPartner, setHoveredPartner] = useState(null);
  const slides = [
    { type: "image", src: "/assets/Slide-1.svg" },
    { type: "video", src: "https://www.youtube.com/embed/1Ddx4gRhPbA?autoplay=1&mute=1&enablejsapi=1" },
    { type: "image", src: "/assets/Slide-2.svg" },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    let timer;

    const onYouTubeIframeAPIReady = () => {
      if (slides[currentSlide].type === "video") {
        const checkVideoEnd = () => {
          const iframe = document.querySelector("iframe");
          if (iframe && window.YT) {
            const player = new YT.Player(iframe, {
              events: {
                onStateChange: (event) => {
                  if (event.data === YT.PlayerState.ENDED) {
                    nextSlide();
                  }
                },
              },
            });
          }
        };

        if (window.YT) {
          checkVideoEnd(); 
        } else {
          const tag = document.createElement("script");
          tag.src = "https://www.youtube.com/iframe_api";
          window.onYouTubeIframeAPIReady = checkVideoEnd;
        }
      } else {
        timer = setTimeout(() => {
          nextSlide();
        }, 2000);
      }
    };

    onYouTubeIframeAPIReady();

    return () => clearTimeout(timer);
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
  const [selectedPartner, setSelectedPartner] = useState(null);
  const partners = selectedCategory === "Institution" ? institutions : colleges;

  return (
    <div className="bg-white">
      <div className="relative w-full h-[600px] flex items-center justify-center mt-[-50px]">
        <div className="w-full max-w-[1200px] h-[450px] relative overflow-hidden rounded-lg">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0 relative">
                {slide.type === "video" ? (
                  <iframe
                    className="w-full h-[450px] rounded-lg"
                    src={slide.src}
                    title="IIoT Training Video"
                    frameBorder="0"
                    allow="autoplay"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <div className="relative w-full h-[450px]">
                    <img
                      src={slide.src}
                      alt="Slide"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {(index === 0 || index === 2) && (
              <button
                onClick={() => {
                  if (index === 2) {
                    window.location.href = "/article"; 
                  } else {
                    window.location.href = "/training"; 
                  }
                }}
                className={`absolute top-[76%] text-white font-semibold min-w-[180px] min-h-[30px] px-4 py-2 rounded-lg shadow-lg hover:bg-orange-500
                  ${index === 0 ? "left-[8%] bg-orange-600" : "left-[75%] bg-orange-600"}`}
              >
                {index === 2 ? "See Article" : "Enroll Now"}
              </button>
            )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-10 flex justify-center space-x-2">
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

      <div className="relative flex flex-col md:flex-row justify-between items-start mt-16">
      <div className="relative flex flex-col md:flex-row justify-center items-center gap-4 mt-16">
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

      <div className="bg-orange-600 text-white p-6 w-full md:w-[700px] mt-24">
        <h2 className="text-3xl font-bold text-right">Efortech Solutions</h2>
        <p className="text-sm mt-3 text-right pl-6">
          Offers training and certification programs focused on the implementation of the Industrial
          Internet of Things (IIoT) through the use of a Smart Integrated IIoT Training Kit.
        </p>
      </div>
    </div>

    <div className="flex flex-col p-8">
        <h2 className="text-2xl font-bold text-black text-right">Why Choose Us?</h2>
        <p className="text-lg text-mainOrange font-semibold text-right mt-2 mb-8">
          Using Smart Integrated IIoT Training Kit
        </p>
        <div className="flex justify-end w-full">
        <div className="relative w-[320px] h-[80px]">
          <div className="absolute top-1/2 left-0 w-[260px] h-[4px] bg-black"></div>
          <div className="absolute top-0 left-[260px] w-[4px] h-[44px] bg-black"></div>
          <div className="absolute left-[-6] top-[52%] -translate-y-1/2 w-0 h-0 
                          border-t-[15px] border-t-transparent 
                          border-b-[15px] border-b-transparent 
                          border-r-[25px] border-r-black"></div>
        </div>     
      </div>
      <img
        src="/assets/kit.png"
        alt="IIoT Diagram"
        className="rounded-lg w-[800px] mt-[-100px] mx-auto"
      />
    </div>

    <div className="flex flex-col p-10 items-center">
        <h2 className="text-2xl font-bold text-black text-right">Why Choose Us?</h2>
        <p className="text-lg text-mainOrange font-semibold text-right mt-2 mb-8">
          Using Smart Integrated IIoT Training Kit
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

      <div className="flex gap-6 justify-center mt-4 overflow-x-auto">
      {partners.map((partner) => {
        const isHovered = hoveredPartner === partner.id;
        return (
          <div
            key={partner.id}
            className="relative flex flex-col items-center cursor-pointer"
            onMouseEnter={() => setHoveredPartner(partner.id)}
            onMouseLeave={() => setHoveredPartner(null)}
          >
            {/* Kotak belakang yang akan slide ke bawah */}
            <div
              className={`absolute w-24 h-24 bg-gray-300 rounded-lg transition-transform duration-300 ${
                isHovered ? "translate-y-6 opacity-100" : "opacity-0"
              }`}
            ></div>

            {/* Kotak logo */}
            <div className="relative z-10 w-24 h-24 bg-gray-100 flex items-center justify-center text-lg font-bold rounded-lg shadow-md">
              {partner.logo}
            </div>

            {/* Nama mitra muncul saat hover */}
            <p
              className={`absolute text-orange-500 text-sm font-semibold transition-opacity duration-300 ${
                isHovered ? "opacity-100 translate-y-10" : "opacity-0"
              }`}
            >
              {partner.name}
            </p>
          </div>
        );
      })}
    </div>
    </div>

  </div>
  );
};

export default Home;