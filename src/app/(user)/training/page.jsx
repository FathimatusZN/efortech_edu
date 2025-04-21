"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { PageTitle } from "../../../components/layout/InputField";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TrainingCard from "../../../components/layout/TrainingCard";

export default function TrainingPage() {
  const router = useRouter();
  const [trainingList, setTrainingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training`);
        const data = await res.json();
        if (res.ok) {
          setTrainingList(data.data || []);
        } else {
          console.error("Gagal ambil data training:", data.message);
        }
      } catch (err) {
        console.error("Error fetch training:", err);
      }
    };

    fetchTrainings();
  }, []);

  const filteredTrainingList = trainingList.filter((training) =>
    training.training_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredTrainingList.length / itemsPerPage);
  const paginatedTraining = filteredTrainingList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const descriptionRef = useRef(null);
  const [descHeight, setDescHeight] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered && descriptionRef.current) {
      setDescHeight(descriptionRef.current.offsetHeight + 16); // tambahkan sedikit padding
    }
  }, [hovered]);

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto min-h-screen px-6 py-12">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8">
        <PageTitle title="Training Program" />
        <input
          type="text"
          placeholder="Search training..."
          className="w-full sm:w-64 px-4 py-2 border-2 border-secondOrange rounded-lg focus:outline-none focus:ring-2 focus:ring-mainOrange"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setPage(1); // reset ke page 1 saat search
          }}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 pt-8 justify-center">
        {paginatedTraining.length > 0 ? (
          paginatedTraining.map((training) => (
            <TrainingCard key={training.training_id} training={training} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No training found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="flex mt-6 pr-8 justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={page === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}