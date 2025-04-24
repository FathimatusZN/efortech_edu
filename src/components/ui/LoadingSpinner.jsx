"use client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const LoadingSpinner = ({ text = "Loading..." }) => {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="text-blue-600"
            >
                <Loader2 className="w-12 h-12 animate-spin" />
            </motion.div>
            <p className="mt-4 text-sm sm:text-base font-montserrat text-gray-600">{text}</p>
        </div>
    );
};

export default LoadingSpinner;
