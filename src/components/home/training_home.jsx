import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaAngleRight } from "react-icons/fa";
import Link from "next/link";

function formatCurrency(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(value);
}

function getDiscountedPrice(originalPrice, discount) {
  return originalPrice - (originalPrice * discount) / 100;
}

export default function TopTrainingSection({ topCourses }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-4 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
        <h2 className="text-base md:text-3xl font-bold">
          Top Training & Certifications
        </h2>
        <Link
          href="/training"
          className="text-xs md:text-sm text-gray-600 hover:underline flex items-center gap-1"
        >
          See All <FaAngleRight className="text-xs" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {topCourses.map((course) => {
          const discountedPrice = getDiscountedPrice(
            course.final_price ?? course.training_fees,
            course.discount
          );

          return (
            <Card
              key={course.training_id}
              className="shadow-md rounded-xl overflow-hidden min-h-[400px] flex flex-col transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative">
                <img
                  src={course.images?.[0] || "/default-image.jpg"}
                  alt={course.training_name}
                  className="h-48 w-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-mainBlue text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {["Beginner", "Intermediate", "Advanced"][course.level - 1] ||
                    "Unknown"}
                </span>
                {course.discount > 0 && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[11px] font-semibold px-2 py-[2px] rounded-full shadow-md animate-bounce">
                    🔥 {Math.round(course.discount)}% OFF
                  </div>
                )}
              </div>

              <CardContent className="p-4 flex flex-col h-full">
                <h3 className="font-semibold text-lg mb-2 text-left">
                  {course.training_name}
                </h3>
                <p className="text-sm italic text-gray-500 text-left">
                  Graduates: {course.graduates.toLocaleString()} Mentees
                </p>

                {/* Spacer untuk dorong harga ke bawah */}
                <div className="mt-auto">
                  <hr className="my-3" />
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col text-sm font-semibold">
                      {course.discount > 0 && (
                        <span className="line-through text-gray-400 text-xs">
                          {formatCurrency(course.training_fees)}
                        </span>
                      )}
                      <span>{formatCurrency(discountedPrice)}</span>
                    </div>
                    <Link href={`/training/${course.training_id}`}>
                      <Button variant="orange" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
