import React, { useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { TbCloudUpload } from "react-icons/tb";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const PAGE_SIZE = 10;

// Status labels mapped to status codes
const STATUS_LABELS = {
  1: "Pending",
  2: "Waiting for Payment",
  3: "Validated",
  4: "Completed",
  5: "Cancelled",
};

// Dropdown for status selection
const StatusDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="border rounded p-1 text-sm"
  >
    {Object.entries(STATUS_LABELS).map(([key, label]) => (
      <option key={key} value={key}>{label}</option>
    ))}
  </select>
);

export const ValidationTrainingTable = ({
  data,
  mode,
  onStatusChange,
  onShowDetailRegistration,
  onAttendanceChange,
  onUploadClick,
  disablePagination = false,
}) => {

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Render attendance buttons or status
  const renderAttendanceColumn = (item) => {
    const id = item.registration_participant_id;
    const status = item.attendance_status;
    const isPresent = status === true;
    const isAbsent = status === false;
    const isNull = status === null || status === undefined;

    const attendanceLocked = item.has_certificate && status === true;

    const renderButton = (label, icon, active, onClick, disabled, tooltip) => {
      const isPresentButton = label === "Present";
      const textColor = isPresentButton ? "text-green-600" : "text-red-600";
      const hoverColor = isPresentButton ? "hover:bg-green-100" : "hover:bg-red-100";

      return (
        <div className={`relative group`}>
          <div
            className={`
              flex flex-col items-center justify-center gap-1 p-2 px-4 h-auto w-auto rounded-md transition
              ${active ? "opacity-100" : "opacity-30"}
              ${textColor} ${hoverColor}
              ${disabled ? "cursor-not-allowed pointer-events-none" : "cursor-pointer"}
            `}
            onClick={!disabled ? onClick : undefined}
          >
            {icon}
            <span className="text-xs">{label}</span>
          </div>

          {disabled && (
            <div className="absolute bottom-full mb-1 w-max max-w-[150px] bg-neutral1 text-mainOrange text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {tooltip}
            </div>
          )}
        </div>
      );
    };

    return (
      <div className="flex gap-1 justify-center">
        {renderButton(
          "Present",
          <BsCheckCircleFill className="w-7 h-7" />,
          isPresent || isNull,
          () => onAttendanceChange(id, true),
          attendanceLocked,
          "Attendance cannot be changed after certificate is issued"
        )}
        {renderButton(
          "Absent",
          <BsFillXCircleFill className="w-7 h-7" />,
          isAbsent || isNull,
          () => onAttendanceChange(id, false),
          attendanceLocked,
          "Attendance cannot be changed after certificate is issued"
        )}
      </div>
    );
  };

  // Render certificate upload status or button
  const renderCertificateUploadColumn = (item) => {
    const status = item.attendance_status;

    if (item.has_certificate) {
      return <span className="text-green-600">Uploaded</span>;
    }

    const canUpload = status === true;

    return (
      <Button
        variant="orange"
        onClick={() => onUploadClick(item)}
        disabled={!canUpload}
      >
        Upload
        <TbCloudUpload className="ml-2" />
      </Button>
    );
  };

  return (
    <div>
      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No data available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {mode === "needprocess" || mode === "cancelled" ? (
                <TableHead>Registrant Name</TableHead>
              ) : (
                <TableHead>Participant Name</TableHead>
              )}
              <TableHead>Registration Date</TableHead>
              <TableHead>Training Date</TableHead>
              <TableHead>Training Name</TableHead>
              {mode === "needprocess" || mode === "cancelled" ? (
                <>
                  <TableHead>Participant</TableHead>
                  <TableHead>Status</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Certificate</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.registration_id + (item.registration_participant_id || "")}
              >
                <TableCell>
                  {mode === "needprocess" || mode === "cancelled"
                    ? item.registration_id
                    : item.registration_participant_id}
                </TableCell>

                {mode === "needprocess" || mode === "cancelled" ? (
                  <TableCell>{item.registrant_name}</TableCell>
                ) : (
                  <TableCell>{item.fullname}</TableCell>
                )}

                <TableCell>
                  {new Date(item.registration_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.training_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.training_name}</TableCell>

                {mode === "needprocess" || mode === "cancelled" ? (
                  <>
                    <TableCell>
                      <Button
                        onClick={() => onShowDetailRegistration(item)}
                        className="bg-white text-black hover:bg-lightBlue hover:text-white transition duration-300 ease-in-out py-2 px-4 rounded-md"
                      >
                        {item.participants.length} Participants
                      </Button>
                    </TableCell>
                    <TableCell>
                      <StatusDropdown
                        value={item.status}
                        onChange={(newStatus) =>
                          onStatusChange(item.registration_id, newStatus)
                        }
                      />
                    </TableCell>
                  </>
                ) : (
                  <>
                    <TableCell>{renderAttendanceColumn(item)}</TableCell>
                    <TableCell>{renderCertificateUploadColumn(item)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {/* Pagination */}
      {!disablePagination && (
        <div className="flex justify-center mt-8">
          <Pagination>
            <PaginationContent className="gap-2">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((prev) => Math.max(prev - 1, 1));
                  }}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
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
                    setPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                  className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      {!disablePagination && (
        <div className="text-xs text-gray-600 text-center mt-2">
          Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
          {Math.min(page * PAGE_SIZE, data.length)} of {data.length} data
        </div>
      )}
    </div>
  );
};