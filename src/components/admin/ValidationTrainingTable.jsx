import React, { useState } from "react";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { TbCloudUpload } from "react-icons/tb";
import { UploadCertificateDialog } from "./UploadCertificateDialog";
import { toast } from "react-hot-toast";

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
  onShowParticipants,
  onAttendanceClick,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);

  // Render attendance buttons or status
  const renderAttendanceColumn = (item) => {
    const id = item.registration_participant_id;
    const status = item.attendance_status;
    const isPresent = status === true;
    const isAbsent = status === false;
    const isNull = status === null || status === undefined;

    const renderButton = (label, icon, active, onClick) => (
      <Button
        variant="ghost"
        className={`flex flex-col items-center justify-center gap-1 p-2 h-auto w-auto px-4 ${active ? "opacity-100" : "opacity-30"
          } ${label === "Present" ? "text-green-600 hover:bg-green-100" : "text-red-600 hover:bg-red-100"}`}
        onClick={onClick}
      >
        {icon}
        <span className="text-xs">{label}</span>
      </Button>
    );

    return (
      <div className="flex gap-2 justify-center">
        {renderButton("Present", <BsCheckCircleFill className="w-10 h-10" />, isPresent || isNull, () =>
          onAttendanceClick(id, true)
        )}
        {renderButton("Absent", <BsFillXCircleFill className="w-10 h-10" />, isAbsent || isNull, () =>
          onAttendanceClick(id, false)
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
        onClick={() => {
          setSelectedParticipant(item);
          setDialogOpen(true);
        }}
        disabled={!canUpload}
      >
        Upload
        <TbCloudUpload className="ml-2" />
      </Button>
    );
  };

  // Function to save certificate data to the backend
  const saveCertificate = async (data) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          issued_date: data.issued_date,
          expired_date: data.expired_date,
          certificate_number: data.certificate_number,
          cert_file: data.cert_file_url, // sesuai field dari API
          registration_participant_id: data.registration_participant_id,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "API error");
      }

      console.log("Certificate saved successfully");
    } catch (err) {
      console.error("Failed to save certificate:", err);
      throw err;
    }
  };

  return (
    <div>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No data available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              {mode === "needToProcess" && <TableHead>Registrant Name</TableHead>}
              <TableHead>Registration Date</TableHead>
              <TableHead>Training Date</TableHead>
              <TableHead>Training Name</TableHead>
              {mode === "needToProcess" ? (
                <>
                  <TableHead>Participant Count</TableHead>
                  <TableHead>Status</TableHead>
                </>
              ) : (
                <>
                  <TableHead>Participant Name</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Certificate</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow
                key={item.registration_id + (item.registration_participant_id || "")}
              >
                <TableCell>
                  {mode === "needToProcess"
                    ? item.registration_id
                    : item.registration_participant_id}
                </TableCell>

                {mode === "needToProcess" && (
                  <TableCell>{item.registrant_name}</TableCell>
                )}

                <TableCell>
                  {new Date(item.registration_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {new Date(item.training_date).toLocaleDateString()}
                </TableCell>
                <TableCell>{item.training_name}</TableCell>

                {mode === "needToProcess" ? (
                  <>
                    <TableCell>
                      <Button onClick={() => onShowParticipants(item.participants)}>
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
                    <TableCell>{item.fullname}</TableCell>
                    <TableCell>{renderAttendanceColumn(item)}</TableCell>
                    <TableCell>{renderCertificateUploadColumn(item)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Certificate upload dialog */}
      {selectedParticipant && (
        <UploadCertificateDialog
          open={dialogOpen}
          setOpen={setDialogOpen}
          participant={selectedParticipant}
          // Uploads the file to remote API using env variable
          onUploadFile={async (file) => {
            const allowedTypes = [
              "image/jpeg", "image/png", "image/webp", "image/jpg", "image/heic",
              "application/pdf",
            ];

            if (!allowedTypes.includes(file.type)) {
              throw new Error("Only image or PDF files are allowed.");
            }

            const formData = new FormData();
            formData.append("files", file);

            try {
              const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/certificate/upload-certificate`,
                {
                  method: "POST",
                  body: formData,
                }
              );

              const data = await res.json();

              if (!res.ok) {
                throw new Error(data.message || "File upload failed");
              }

              if (data.status === "success") {
                return data.data.fileUrl;
              } else {
                throw new Error(data.message || "File upload failed");
              }
            } catch (error) {
              console.error("Upload failed:", error);
              throw error;
            }
          }}

          // Save certificate metadata to backend
          onSave={saveCertificate}
          // Success handler 
          onShowSuccess={() => {
            toast.success("Certificate uploaded successfully!");
          }}
        />
      )}
    </div>
  );
};
