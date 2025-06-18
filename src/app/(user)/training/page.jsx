"use client";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { PageTitle } from "@/components/layout/InputField";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TrainingCard from "@/components/layout/TrainingCard";
import { NotFound } from "@/components/ui/ErrorPage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function TrainingPage() {
  const router = useRouter();
  const [trainingList, setTrainingList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);
  const itemsPerPage = 9;

  const fetchTrainings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training`);
      const data = await res.json();
      if (res.ok) {
        setTrainingList(data.data || []);
      } else {
        console.error("Failed to fetch trainings:", data.message);
        setTrainingList([]);
      }
    } catch (err) {
      console.error("Error:", err);
      setTrainingList([]);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const totalPages = Math.ceil(trainingList.length / itemsPerPage);
  const paginatedTraining = trainingList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const descriptionRef = useRef(null);
  const [descHeight, setDescHeight] = useState(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (hovered && descriptionRef.current) {
      setDescHeight(descriptionRef.current.offsetHeight + 16);
    }
  }, [hovered]);

  const fetchSearchResults = async () => {
    if (!searchQuery.trim()) {
      fetchTrainings();
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/training?search=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (res.ok) {
        setTrainingList(data.data || []);
      } else {
        console.error("Search failed:", data.message);
        setTrainingList([]);
      }
    } catch (err) {
      console.error("API error:", err);
      setTrainingList([]);
    } finally {
      setIsLoading(false);
      setHasFetched(true);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-screen mx-auto min-h-screen px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-8">
        <PageTitle title="Training Program" />
        <div className="relative flex w-full sm:w-[330px]">
          <input
            type="text"
            placeholder="Search training..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setPage(1);
                fetchSearchResults();
              }
            }}
            className="w-full h-[36px] pl-5 pr-10 border-2 border-mainOrange rounded-md"
          />
          <button
            onClick={() => {
              setPage(1);
              fetchSearchResults();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-black hover:text-mainOrange"
          >
            <FaSearch className="mr-2" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center pt-8">
          <LoadingSpinner />
        </div>
      ) : trainingList.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8 pt-8 justify-center">
            {paginatedTraining.map((training) => (
              <TrainingCard key={training.training_id} training={training} />
            ))}
          </div>

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
        </>
      ) : hasFetched ? (
        <div className="pt-8">
          <NotFound message="We couldn’t find any training matching your search. Try different keywords." buttons={[]} />
        </div>
      ) : null}
    </div>
  );
}
