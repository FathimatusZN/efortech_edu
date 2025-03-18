import Link from "next/link";
import { FaWhatsapp, FaYoutube, FaEnvelope, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-secondBlue text-white py-10 px-6 md:px-20 text-center">
      {/* Navigasi */}
      <div className="flex flex-wrap justify-center py-8 gap-28 text-sm md:text-base">
        <div>
          <Link href="/">
            <h3 className="text-lg font-bold text-secondOrange cursor-pointer hover:underline">Home</h3>
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondOrange">Training</h3>
          <Link href="/training">
            <p className="hover:underline py-6 cursor-pointer">Training Programme</p>
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondOrange">Certificate</h3>
          <Link href="/certificate/upload">
            <p className="hover:underline py-6 cursor-pointer">Upload Certificate</p>
          </Link>
          <Link href="/certificate/check">
            <p className="hover:underline cursor-pointer">Check Certificate</p>
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondOrange">Articles</h3>
          <Link href="/articles/success">
            <p className="hover:underline py-6 cursor-pointer">Success Story</p>
          </Link>
          <Link href="/articles/event">
            <p className="hover:underline cursor-pointer">Event</p>
          </Link>
          <Link href="/articles/insight">
            <p className="hover:underline pt-6 cursor-pointer">Insight</p>
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-bold text-secondOrange">Profile</h3>
          <Link href="/user/profile">
            <p className="hover:underline py-6 cursor-pointer">History Training</p>
          </Link>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
            <div className="flex-[2] justify-items-start">
                <div className="flex justify-center gap-16 my-6">
                    <a href="https://wa.me/your-number" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/whatsapp.png" alt="WhatsApp" className="w-12 h-12"/>
                    </a>
                    <a href="https://www.youtube.com/channel/your-channel-id" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/youtube.png" alt="YouTube" className="w-15 h-12"/>
                    </a>
                    <a href="mailto:5kH4T@example.com">
                        <img src="/assets/email.png" alt="Email" className="w-12 h-12"/>
                    </a>
                    <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/linkedin.png" alt="LinkedIn" className="w-12 h-12"/>
                    </a>
                </div>
                <div className="text-center">
                    <h3 className="font-bold text-left pt-6 mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="text-left">
                        <p className="font-bold">Surabaya</p>
                        <p>Ayman Building Lantai 2</p>
                        <p>Jl. Masjid Al-Akbar Utara No.7</p>
                        <p>Surabaya, 60234 - Indonesia</p>
                        </div>
                        <div className="text-left">
                        <p className="font-bold">Jakarta</p>
                        <p>Plaza Aminta Lantai 6 / 602</p>
                        <p>Jl. TB Simatupang No.10</p>
                        <p>Jakarta</p>
                        </div>
                        <div className="text-left">
                        <p className="font-bold">Bandung</p>
                        <p>Komplek Istana Mekarwangi</p>
                        <p>Jl. Mekar Utama No.18</p>
                        <p>Bandung, 40237 - Indonesia</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-[1] text-white p-6">
                <h3 className="font-bold text-lg mb-4">Send a Newsletter!</h3>
                <form className="space-y-4">
                {/* Email */}
                <div>
                    <label className="block text-sm text-left font-medium mb-1">Email <span className="text-red-500">*</span></label>
                    <input 
                    type="email" 
                    placeholder="Email" 
                    className="w-full p-2 rounded text-black border border-gray-300"
                    />
                </div>
                {/* Full Name */}
                <div>
                    <label className="block text-sm text-left font-medium mb-1">Full Name <span className="text-red-500">*</span></label>
                    <input 
                    type="text" 
                    placeholder="Full Name" 
                    className="w-full p-2 rounded text-black border border-gray-300"
                    />
                </div>
                {/* Submit Button */}
                <button className="w-28 bg-mainBlue hover:bg-secondBlue shadow-md text-white px-4 py-2 rounded">
                    Submit
                </button>
                </form>
            </div>
        </div>

      <div className="text-center mt-6">
        <p>© 2025 Efortech Solutions. All Rights Reserved</p>
      </div>
    </footer>
  );
}