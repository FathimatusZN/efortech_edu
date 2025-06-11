import Link from "next/link";
import { useEffect } from "react";

export default function Footer() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://js.hsforms.net/forms/embed/v2.js";
    script.async = true;
    script.onload = () => {
      if (window.hbspt) {
        window.hbspt.forms.create({
          region: "na2",
          portalId: "243021366",
          formId: "f528fdb0-e01e-45ee-88eb-bc032434b9ff",
          target: "#hubspotForm",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  return (
    <footer className="bg-secondBlue text-white py-10 px-6 md:px-20 text-center">
      {/* Navigasi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-sm md:text-base text-center md:text-left py-8 text-white items-center justify-center">
        {/* Home */}
        <div className="space-y-2 text-center">
          <Link href="/">
            <h3 className="text-lg font-bold text-secondOrange cursor-pointer hover:underline">
              Home
            </h3>
          </Link>
        </div>

        {/* Training */}
        <div className="space-y-2 text-center">
          <Link href="/training">
            <h3 className="text-lg font-bold text-secondOrange hover:underline">
              Training
            </h3>
          </Link>
          <Link href="/training">
            <p className="hover:underline mt-2 cursor-pointer">
              Training Programme
            </p>
          </Link>
        </div>

        {/* Certificate */}
        <div className="space-y-2 text-center">
          <Link href="/certificate/check">
            <h3 className="text-lg font-bold text-secondOrange hover:underline">
              Certificate
            </h3>
          </Link>
          <Link href="/certificate/upload">
            <p className="hover:underline mt-2 cursor-pointer">
              Upload Certificate
            </p>
          </Link>
          <Link href="/certificate/check">
            <p className="hover:underline cursor-pointer mt-2">
              Check Certificate
            </p>
          </Link>
        </div>

        {/* Articles */}
        <div className="space-y-2 text-center">
          <Link href="/article">
            <h3 className="text-lg font-bold text-secondOrange hover:underline">
              Articles
            </h3>
          </Link>
          <Link href="/article">
            <p className="hover:underline mt-2 cursor-pointer">Success Story</p>
          </Link>
          <Link href="/article">
            <p className="hover:underline mt-2 cursor-pointer">Event</p>
          </Link>
          <Link href="/article">
            <p className="hover:underline mt-2 cursor-pointer">Insight</p>
          </Link>
        </div>

        {/* Profile */}
        <div className="space-y-2 text-center">
          <Link href="/edit-profile">
            <h3 className="text-lg font-bold text-secondOrange hover:underline">
              Profile
            </h3>
          </Link>
          <Link href="/edit-profile">
            <p className="hover:underline mt-2 cursor-pointer">
              History Training
            </p>
          </Link>
        </div>
      </div>

      {/* Kontak & Form */}
      <div className="flex flex-col lg:flex-row gap-8 mt-12 text-left">
        {/* Kontak */}
        <div className="flex-[2]">
          {/* Sosial Media */}
          <div className="flex justify-center lg:justify-start gap-14 my-6 flex-wrap">
            <a
              href="https://wa.me/628113300143"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/whatsapp.png"
                alt="WhatsApp"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </a>
            <a
              href="https://www.youtube.com/@efortechsolutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/youtube.png"
                alt="YouTube"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </a>
            <a href="mailto:info@efortechsolutions.com">
              <img
                src="/assets/email.png"
                alt="Email"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </a>
            <a
              href="https://www.linkedin.com/company/efortechsolutions/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/assets/linkedin.png"
                alt="LinkedIn"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </a>
          </div>

          {/* Lokasi */}
          <h3 className="font-bold pt-6 mb-4 text-center md:text-left">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-center md:text-left">
            {/* Surabaya */}
            <div>
              <p className="font-bold">Surabaya</p>
              <Link href="https://maps.app.goo.gl/49n5Yrh1vbZjmLSv7">
                <div className="hover:underline cursor-pointer">
                  <p>Ayman Building Lantai 2</p>
                  <p>Jl. Masjid Al-Akbar Utara No.7</p>
                  <p>Surabaya, 60234 - Indonesia</p>
                </div>
              </Link>
            </div>

            {/* Jakarta */}
            <div>
              <p className="font-bold">Jakarta</p>
              <Link href="https://maps.app.goo.gl/Eb8ZonRmpqgM2Sbk6">
                <div className="hover:underline cursor-pointer">
                  <p>Plaza Aminta Lantai 6 / 602</p>
                  <p>Jl. TB Simatupang No.10</p>
                  <p>Jakarta</p>
                </div>
              </Link>
            </div>

            {/* Bandung */}
            <div>
              <Link href="https://maps.app.goo.gl/yoScYVQ9fdwpXyFHA">
                <div className="hover:underline cursor-pointer">
                  <p className="font-bold">Bandung</p>
                  <p>Komplek Istana Mekarwangi</p>
                  <p>Jl. Mekar Utama No.18</p>
                  <p>Bandung, 40237 - Indonesia</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Newsletter Form */}
        <div className="flex-[1] text-white p-4 sm:p-6 bg-secondBlue rounded-md">
          <h3 className="font-bold text-lg mb-4">Send a Newsletter!</h3>
          <div id="hubspotForm"></div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-sm">
        <p>© 2025 Efortech Solutions. All Rights Reserved</p>
      </div>
    </footer>
  );
}
