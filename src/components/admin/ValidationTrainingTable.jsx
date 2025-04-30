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

  // Flatten participant data if in "processed" mode
  const processedData =
    mode === "processed"
      ? data.flatMap((registration) =>
        (registration.participants || []).map((participant) => ({
          ...registration,
          ...participant,
        }))
      )
      : data;

  // Render column for attendance control or status label
  const renderAttendanceColumn = (item) => {
    const isPresent = attendanceStatus[item.registration_participant_id];

    if (isPresent !== undefined) {
      return (
        <span
          className={`px-3 py-1 rounded-full text-white text-xs font-medium ${isPresent ? "bg-green-600" : "bg-red-600"
            }`}
        >
          {isPresent ? "Present" : "Absent"}
        </span>
      );
    }

    return (
      <div className="flex gap-2 justify-center">
        <Button
          variant="ghost"
          className="text-green-600 hover:bg-green-100"
          onClick={() =>
            handleAttendanceClick(item.registration_participant_id, true)
          }
        >
          <BsCheckCircleFill className="w-5 h-5 mr-1" />
          Present
        </Button>
        <Button
          variant="ghost"
          className="text-red-600 hover:bg-red-100"
          onClick={() =>
            handleAttendanceClick(item.registration_participant_id, false)
          }
        >
          <BsFillXCircleFill className="w-5 h-5 mr-1" />
          Absent
        </Button>
      </div>
    );
  };

  // Render column for certificate upload button or status
  const renderCertificateUploadColumn = (item) => {
    const isPresent =
      attendanceStatus[item.registration_participant_id] === "present";

    return item.has_certificate ? (
      <span className="text-green-600">Uploaded</span>
    ) : (
      <Button
        variant="orange"
        onClick={() => console.log("Upload Certificate")}
        disabled={!isPresent}
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
                    <TableCell>{item.participant_name}</TableCell>
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
