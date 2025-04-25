"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import funfacts from "@/components/data/funfacts";

const ErrorTemplate = ({ code, message, image, buttons }) => {
    const [randomFact, setRandomFact] = useState("");

    useEffect(() => {
        const index = Math.floor(Math.random() * funfacts.length);
        setRandomFact(funfacts[index]);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center py-8 px-4">
            {image && (
                <div className="relative w-[200px] h-[200px] mb-1 sm:w-[250px] sm:h-[250px]">
                    <Image
                        src={image}
                        alt="Error"
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-contain"
                    />
                </div>
            )}
            <h1 className="text-[24px] sm:text-[32px] font-bold text-lightBlue font-montserrat">{code}</h1>
            <p className="text-base sm:text-lg font-montserrat text-black mb-4">
                {message}
            </p>
            <div className="bg-blue-50 rounded-xl px-4 py-3 max-w-[350px] sm:max-w-xl shadow-md mb-4">
                <p className="text-xs sm:text-sm font-montserrat text-black italic">💡 {randomFact}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
                {buttons.map((button, index) => (
                    <Link
                        key={index}
                        href={button.href}
                        className="bg-gradient-to-r from-[#01458E] to-[#157AB2] text-white font-semibold text-base sm:text-lg px-5 py-2 rounded-2xl text-center transition-all duration-300 transform hover:scale-105 hover:bg-gradient-to-r hover:from-[#157AB2] hover:to-[#01458E]"
                    >
                        {button.text}
                    </Link>
                ))}
            </div>
        </div>
    );
};

// Factory-style exports

export const BadRequest = () => {
    return (
        <ErrorTemplate
            code="400 Bad Request"
            message="Your request could not be understood by the server due to malformed syntax."
            image="/assets/bad-request.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
};

export const Unauthorized = () => {
    return (
        <ErrorTemplate
            code="401 Unauthorized"
            message="You need to sign in to access this page."
            image="/assets/unauthorized.png"
            buttons={[
                { text: "Back to Home", href: "/home" },
                { text: "Go to Sign In", href: "/auth/signin" }
            ]}
        />
    );
};

export const Forbidden = () => {
    return (
        <ErrorTemplate
            code="403 Forbidden"
            message="You don’t have permission to access this page. Please sign in with an account that has the appropriate access rights."
            image="/assets/forbidden.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const NotFound = () => {
    return (
        <ErrorTemplate
            code="404 Not Found"
            message="The page you are looking for could not be found."
            image="/assets/not-found.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const RequestTimeout = () => {
    return (
        <ErrorTemplate
            code="408 Request Timeout"
            message="The server timed out waiting for your request. Please try again."
            image="/assets/request-timeout.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const InternalServerError = () => {
    return (
        <ErrorTemplate
            code="500 Internal Server Error"
            message="Something went wrong on our side. Please try again later."
            image="/assets/internal-server-error.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const BadGateway = () => {
    return (
        <ErrorTemplate
            code="502 Bad Gateway"
            message="The server received an invalid response. Please try again shortly."
            image="/assets/bad-gateway.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const ServiceUnavailable = () => {
    return (
        <ErrorTemplate
            code="503 Service Unavailable"
            message="The service is temporarily unavailable. Please try again later."
            image="/assets/service-unavailable.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}

export const GatewayTimeout = () => {
    return (
        <ErrorTemplate
            code="504 Gateway Timeout"
            message="The server did not receive a timely response. Please try again later."
            image="/assets/gateway-timeout.png"
            buttons={[{ text: "Back to Home", href: "/home" }]}
        />
    );
}
