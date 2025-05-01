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
import { TbCloudUpload } from "react-icons/tb";

// Status labels mapped to numerical status codes
const STATUS_LABELS = {
  1: "Pending",
  2: "Waiting for Payment",
  3: "Validated",
  4: "Completed",
  5: "Cancelled",
};

// Dropdown component for selecting status
const StatusDropdown = ({ value, onChange }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    className="border rounded p-1 text-sm"
  >
    {Object.entries(STATUS_LABELS).map(([key, label]) => (
      <option key={key} value={key}>
        {label}
      </option>
    ))}
  </select>
);

export const ValidationTrainingTable = ({
  data,
  mode,
  onStatusChange,
  onShowParticipants,
}) => {
  const [attendanceStatus, setAttendanceStatus] = useState({});

  // Update local attendance status for a participant
  const handleAttendanceClick = (id, status) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const processedData = data;

  // Render column for attendance control or status label
  const renderAttendanceColumn = (item) => {
    const status = item.attendance_status;

    const renderButton = (label, icon, color, onClick, disabled = false) => (
      <Button
        variant="ghost"
        className={`${color} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        onClick={onClick}
        disabled={disabled}
      >
        {icon}
        {label}
      </Button>
    );

    return (
      <div className="flex gap-2 justify-center">
        {renderButton(
          "Present",
          <BsCheckCircleFill className="w-5 h-5 mr-1" />,
          "text-green-600 hover:bg-green-100",
          () => handleAttendanceClick(item.registration_participant_id, true),
          status === false // disable if marked as Absent
        )}
        {renderButton(
          "Absent",
          <BsFillXCircleFill className="w-5 h-5 mr-1" />,
          "text-red-600 hover:bg-red-100",
          () => handleAttendanceClick(item.registration_participant_id, false),
          status === true // disable if marked as Present
        )}
      </div>
    );
  };

  // Render column for certificate upload button or status
  const renderCertificateUploadColumn = (item) => {
    const status = item.attendance_status;

    if (item.has_certificate) {
      return <span className="text-green-600">Uploaded</span>;
    }

    const canUpload = status === true;

    return (
      <Button
        variant="orange"
        onClick={() => console.log("Upload Certificate")}
        disabled={!canUpload}
      >
        Upload
        <TbCloudUpload className="ml-2" />
      </Button>
    );
  };

  return (
    <div>
      {data.length === 0 ? (
        <p className="text-center text-gray-500 py-4">No data available</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Registration ID</TableHead>
              {mode === "needToProcess" && (
                <TableHead>Registrant Name</TableHead>
              )}
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
                  <TableHead>Absensi</TableHead>
                  <TableHead>Upload Sertifikat</TableHead>
                </>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {processedData.map((item) => (
              <TableRow
                key={
                  item.registration_id +
                  (item.registration_participant_id || "")
                }
              >
                <TableCell>{item.registration_id}</TableCell>

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
                      <Button
                        onClick={() => onShowParticipants(item.participants)}
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
                    <TableCell>{item.fullname}</TableCell>
                    <TableCell>{renderAttendanceColumn(item)}</TableCell>
                    <TableCell>
                      {renderCertificateUploadColumn(item)}
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};
