// efortech_edu\src\components\admin\ValidationTrainingTable.jsx
import React, { useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import CertificateDetailDialog from "@/components/admin/CertificateDetailDialog";
import { AdvantechCertificateDetailDialog } from "@/components/admin/AdvantechCertificateDetailDialog";
const PAGE_SIZE = 50;

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
  onMarkNoCertificate,
  disablePagination = false,
  // Selection props (injected by SelectableTableWrapper or passed manually)
  selectedRows = [],
  onSelectRow = () => { },
  onSelectAll = () => { },
  selectionEnabled = false,
}) => {

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

  // Check if all rows on current page are selected
  const isAllSelected = selectionEnabled && paginatedData.length > 0 &&
    paginatedData.every(item => selectedRows.includes(item.registration_id));

  // Check if some (but not all) rows are selected
  const isSomeSelected = selectionEnabled &&
    paginatedData.some(item => selectedRows.includes(item.registration_id)) && !isAllSelected;

  // Handle select all on current page
  const handleSelectAll = (checked) => {
    const currentPageIds = paginatedData.map(item => item.registration_id);
    onSelectAll(checked, currentPageIds);
  };

  // Render attendance buttons or status
  const renderAttendanceColumn = (item) => {
    const id = item.registration_participant_id;
    const status = item.attendance_status;
    const isPresent = status === true;
    const isAbsent = status === false;
    const isNull = status === null || status === undefined;

    const attendanceLocked = item.has_certificate && isPresent;

    // Badge design if attendance is locked
    if (attendanceLocked) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 border border-green-400 text-green-600 bg-white rounded-full px-3 py-1 text-sm font-medium">
            <BsCheckCircleFill className="w-4 h-4" />
            Present
          </div>
        </div>
      );
    }

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
          false,
          ""
        )}
        {renderButton(
          "Absent",
          <BsFillXCircleFill className="w-7 h-7" />,
          isAbsent || isNull,
          () => onAttendanceChange(id, false),
          false,
          ""
        )}
      </div>
    );
  };

  // Render certificate upload status or button
  const renderCertificateUploadColumn = (item) => {
    const status = item.attendance_status;

    if (item.has_certificate) {
      return (
        <Button
          variant="outline"
          className="text-green-600 border-green-500 hover:bg-green-100"
          onClick={() => handleOpenCertificateDetail(item.certificate_id)}
        >
          Uploaded
        </Button>
      );
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

  const renderAdvantechCertificateColumn = (item) => {
    const certUrl = item.advantech_cert;

    if (certUrl) {
      return (
        <Button
          className="bg-white text-black hover:bg-lightBlue hover:text-white transition duration-300 ease-in-out py-2 px-4 rounded-md"
          onClick={() => {
            setSelectedItem(item);
            setDialogOpen(true);
          }}>
          Preview
        </Button>
      );
    }

    return <span className="text-red-500 italic">Not Found</span>;
  };

  // Render "No Certificate" button for On Progress mode
  const renderNoCertificateColumn = (item) => {
    const canMarkNoCert = item.attendance_status === true && !item.has_certificate && !item.no_certificate;

    if (!canMarkNoCert) {
      return <span className="text-gray-400 text-sm">-</span>;
    }

    return (
      <Button
        variant="outline"
        className="text-orange-600 border-orange-500 hover:bg-orange-100"
        onClick={() => onMarkNoCertificate(item.registration_participant_id)}
      >
        No Certificate
        <BsFillXCircleFill className="ml-2" />
      </Button>
    );
  };

  // Render status badge for Completed mode
  const renderCompletedStatus = (item) => {
    if (item.has_certificate) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          <BsCheckCircleFill className="w-3 h-3" />
          Certified
        </span>
      );
    }
    if (item.no_certificate) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
          <BsFillXCircleFill className="w-3 h-3" />
          Uncertified
        </span>
      );
    }
    if (item.attendance_status === false) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          <BsFillXCircleFill className="w-3 h-3" />
          Absent
        </span>
      );
    }
    return <span className="text-gray-400 text-sm">-</span>;
  };

  const handleOpenCertificateDetail = async (certificateId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/${certificateId}`);
      const json = await res.json();
      if (json.status === "success" && json.data) {
        setSelectedCertificate(json.data);
        setShowCertificateDialog(true);
      } else {
        alert("Certificate not found or failed to fetch.");
      }
    } catch (err) {
      console.error("Error fetching certificate:", err);
    }
  };

  return (
    <div>
      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No data available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              {/* Checkbox column - show when selection is enabled */}
              {selectionEnabled && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    {...(isSomeSelected && { indeterminate: true })}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
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
              ) : mode === "onprogress" ? (
                <>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Advantech Certificate</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Action</TableHead>
                </>
              ) : mode === "completed" ? (
                <>
                  <TableHead>Advantech Certificate</TableHead>
                  <TableHead>Certificate</TableHead>
                  <TableHead>Status</TableHead>
                </>
              ) : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow
                key={item.registration_id + (item.registration_participant_id || "")}
              >
                {/* Checkbox cell - show when selection is enabled */}
                {selectionEnabled && (
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.includes(item.registration_id)}
                      onCheckedChange={(checked) => onSelectRow(item.registration_id, checked)}
                    />
                  </TableCell>
                )}

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
                  {new Date(item.registration_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(item.training_date).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
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
                ) : mode === "onprogress" ? (
                  <>
                    <TableCell>{renderAttendanceColumn(item)}</TableCell>
                    <TableCell>{renderAdvantechCertificateColumn(item)}</TableCell>
                    <TableCell>{renderCertificateUploadColumn(item)}</TableCell>
                    <TableCell>{renderNoCertificateColumn(item)}</TableCell>
                  </>
                ) : mode === "completed" ? (
                  <>
                    <TableCell>{renderAdvantechCertificateColumn(item)}</TableCell>
                    <TableCell>
                      {item.has_certificate ? (
                        <Button
                          variant="outline"
                          className="text-green-600 border-green-500 hover:bg-green-100"
                          onClick={() => handleOpenCertificateDetail(item.certificate_id)}
                        >
                          View Certificate
                        </Button>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{renderCompletedStatus(item)}</TableCell>
                  </>
                ) : null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {!disablePagination && (
        <div className="flex justify-center mt-8">
          <Pagination className="flex justify-center mt-4">
            <PaginationContent className="gap-2">
              {/* Previous button */}
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

              {/* Page numbers with maxVisible */}
              {(() => {
                const maxVisible = 5;
                let startPage = Math.max(
                  1,
                  Math.min(page - Math.floor(maxVisible / 2), totalPages - maxVisible + 1)
                );
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);

                return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                  const pageNum = startPage + i;
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href="#"
                        isActive={page === pageNum}
                        onClick={(e) => {
                          e.preventDefault();
                          setPage(pageNum);
                        }}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
              })()}

              {/* Next button */}
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
      {showCertificateDialog && selectedCertificate && (
        <CertificateDetailDialog
          data={selectedCertificate}
          open={showCertificateDialog}
          onClose={() => setShowCertificateDialog(false)}
        />
      )}
      <AdvantechCertificateDetailDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
      />
    </div>
  );
};