import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { UserCertificateDetailDialog } from "./UserCertificateDetailDialog";
import { ConfirmCertificateDialog } from "./ConfirmCertificateDialog";

const PAGE_SIZE = 10;

// Status labels mapped to status codes
const STATUS_LABELS = {
  1: "Pending",
  2: "Accepted",
  3: "Rejected",
};

const formatDate = (isoString) => {
  const date = new Date(isoString);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};

const formatDate2 = (isoString) => {
  const date = new Date(isoString);
  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return date.toLocaleString("en-US", options).replace(",", "");
};

export const ValidationCertificateTable = ({
  data,
  mode,
  adminId,
  onStatusChange,
  disablePagination = false,
}) => {

  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(data.length / PAGE_SIZE);
  const paginatedData = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedCertificateId, setSelectedCertificateId] = useState(null);
  const [notes, setNotes] = useState("");

  // Render status buttons or badge
  const renderStatusColumn = (item) => {
    const id = item.user_certificate_id;
    const status = item.status;
    const isAccepted = status === 2;
    const isRejected = status === 3;
    const isNull = status === 1 || status === undefined;

    const statusLocked = isAccepted;

    // Badge design if status is locked
    if (statusLocked) {
      return (
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-1 border border-green-400 text-green-600 bg-white rounded-full px-3 py-1 text-sm font-medium">
            <BsCheckCircleFill className="w-4 h-4" />
            Accepted
          </div>
        </div>
      );
    }

    const renderButton = (label, icon, active, onClick, disabled, tooltip) => {
      const isAcceptedButton = label === "Accept";
      const textColor = isAcceptedButton ? "text-green-600" : "text-red-600";
      const hoverColor = isAcceptedButton ? "hover:bg-green-100" : "hover:bg-red-100";

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
          "Accept",
          <BsCheckCircleFill className="w-7 h-7" />,
          isAccepted || isNull,
          () => handleOpenConfirm(item, 2),
          false,
          ""
        )}
        {renderButton(
          "Reject",
          <BsFillXCircleFill className="w-7 h-7" />,
          isRejected || isNull,
          () => handleOpenConfirm(item, 3),
          false,
          ""
        )}
      </div>
    );
  };

  const handleShowDetail = (item) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleOpenConfirm = (item, status) => {
    setSelectedItem(item);
    setSelectedStatus(status);
    setConfirmDialogOpen(true);
  };

  const handleConfirm = (certificateId, status, notes) => {
    onStatusChange(certificateId, status, notes);
  };

  return (
    <div>
      {paginatedData.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No data available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Certificate ID</TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Certificate Type</TableHead>
              <TableHead>Issued by</TableHead>
              <TableHead>Issued Date</TableHead>
              <TableHead>Expired Date</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.user_certificate_id}>
                <TableCell>{item.user_certificate_id}</TableCell>
                <TableCell>{item.fullname}</TableCell>
                <TableCell>{item.cert_type}</TableCell>
                <TableCell>{item.issuer}</TableCell>
                <TableCell>{formatDate2(item.issued_date)}</TableCell>
                <TableCell>{formatDate2(item.expired_date)}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleShowDetail(item)}
                    className="bg-white text-black hover:bg-lightBlue hover:text-white transition duration-300 ease-in-out py-2 px-4 rounded-md"
                  >
                    Detail
                  </Button>
                </TableCell>
                <TableCell>{formatDate(item.created_at)}</TableCell>
                <TableCell>{renderStatusColumn(item)}</TableCell>
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

      <UserCertificateDetailDialog
        open={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        item={selectedItem}
        mode={mode}
      />

      <ConfirmCertificateDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        certificateId={selectedItem?.user_certificate_id}
        fullname={selectedItem?.fullname}
        userId={selectedItem?.user_id}
        certName={selectedItem?.cert_type}
        status={selectedStatus}
        onConfirm={handleConfirm}
      />

    </div>
  );
};
