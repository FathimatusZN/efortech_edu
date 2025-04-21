import Image from "next/image";

const NotFound = ({ message = "No data found.", image = "/assets/not-found.png", className = "" }) => {
    return (
        <div className={`flex flex-col items-center justify-center text-center py-10 px-4 ${className}`}>
            <div className="relative w-72 h-72 mb-6">
                <Image
                    src={image}
                    alt="Not Found"
                    fill
                    className="object-contain"
                />
            </div>
            <p className="text-lg sm:text-xl text-neutral-500">{message}</p>
        </div>
    );
};

export default NotFound;