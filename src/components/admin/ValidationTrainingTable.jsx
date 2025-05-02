import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { TbCloudUpload } from "react-icons/tb";

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
  onAttendanceChange,
  onUploadClick,
}) => {
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
          onAttendanceChange(id, true)
        )}
        {renderButton("Absent", <BsFillXCircleFill className="w-10 h-10" />, isAbsent || isNull, () =>
          onAttendanceChange(id, false)
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
    </div>
  );
};
