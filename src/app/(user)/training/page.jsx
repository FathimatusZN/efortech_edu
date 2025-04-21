"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { trainingList } from "./Data";
import { PageTitle } from "../../../components/layout/InputField";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"; // pastikan path-nya sesuai

export default function TrainingPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredTrainingList = trainingList.filter((training) =>
    training.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 9;
  const totalPages = Math.ceil(filteredTrainingList.length / itemsPerPage);

  const paginatedTraining = filteredTrainingList.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

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
            <div
              key={training.id}
              className="relative group overflow-hidden rounded-lg shadow-lg w-full max-w-[400px] h-[277px] mx-auto transition-all duration-500 ease-in-out"
              onClick={() => router.push(`/training/${training.id}`)}
            >
              <img
                src={
                  training.images?.[0] ||
                  "https://img.freepik.com/free-vector/no-data-concept-illustration_114360-536.jpg?t=st=1745203424~exp=1745207024~hmac=87ca4b0bf418de92dc6555ab5000a009470c89519a827b8be8db1fbc7158e032&w=826"
                }
                alt={training.title}
                className="w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:blur-sm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col justify-end">
                <h3 className="text-white font-semibold text-lg">
                  {training.title}
                </h3>
                <p className="text-white text-sm mt-2 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  {training.description}
                </p>
              </div>
            </div>
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