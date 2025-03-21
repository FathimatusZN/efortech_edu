"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
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

  return (
    <div className="bg-white">
      <div className="relative w-full h-[600px] flex items-center justify-center mt-[-118px]">
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
                    window.location.href = "/user/training"; 
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
        className={`mx-auto bg-mainBlue p-6 shadow-lg transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
      >
        <h1 className="text-3xl font-bold text-white">Empowering Tomorrow :</h1>
        <h2 className="text-2xl font-semibold text-white">
          Efortech’s Innovative Education Solutions
        </h2>
      </div>

      <div className="relative flex justify-between items-start mt-16">
      <div className="relative flex">
        <img
          src="/assets/foto2.png"
          alt="Image 1"
          className="w-[300px] shadow-lg"
        />
        <img
          src="/assets/gambar1.jpg"
          alt="Image 2"
          className="w-[300px] shadow-lg absolute left-[300px] top-12"
        />
      </div>

      <div className="bg-orange-600 text-white p-6 w-[700px]">
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
        
      </div>
      
  );
};

export default Home;