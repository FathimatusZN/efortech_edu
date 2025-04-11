import React from "react";
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

export type ValidationCourseData = {
  id: string;
  fullName: string;
  registrationDate: string;
  courseName: string;
  session: string;
  notes: string;
  validation?: "accepted" | "rejected";
};

export type ValidationCertificateData = {
  id: string;
  fullName: string;
  issuedDate: string;
  courseName: string;
  expiredDate: string;
  notes: string;
  validation?: "accepted" | "rejected";
};

type Props = {
  data: (ValidationCourseData | ValidationCertificateData)[];
  dataType: "course" | "certificate";
  statusType: "needToProcess" | "processed";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
};

export const ValidationTable: React.FC<Props> = ({
  data,
  dataType,
  statusType,
  onAccept,
  onReject,
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Full Name</TableHead>
          <TableHead>ID</TableHead>
          {dataType === "course" ? (
            <>
              <TableHead>Registration Date</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Session</TableHead>
            </>
          ) : (
            <>
              <TableHead>Issued Date</TableHead>
              <TableHead>Course Name</TableHead>
              <TableHead>Expired Date</TableHead>
            </>
          )}
          <TableHead>Validation</TableHead>
          <TableHead>Notes</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {data.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.fullName}</TableCell>
            <TableCell>{item.id}</TableCell>

            {dataType === "course" ? (
              <>
                <TableCell>{(item as ValidationCourseData).registrationDate}</TableCell>
                <TableCell>{item.courseName}</TableCell>
                <TableCell>{(item as ValidationCourseData).session}</TableCell>
              </>
            ) : (
              <>
                <TableCell>{(item as ValidationCertificateData).issuedDate}</TableCell>
                <TableCell>{item.courseName}</TableCell>
                <TableCell>{(item as ValidationCertificateData).expiredDate}</TableCell>
              </>
            )}

            <TableCell>
              {statusType === "needToProcess" && !item.validation ? (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start sm:justify-center gap-2">
                  <Button
                    variant="ghost"
                    className="text-green-600 hover:bg-green-100"
                    onClick={() => onAccept?.(item.id)}
                  >
                    <BsCheckCircleFill className="w-5 h-5 mr-1 text-green-600" />
                    Accept
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-red-600 hover:bg-red-100"
                    onClick={() => onReject?.(item.id)}
                  >
                    <BsFillXCircleFill className="w-5 h-5 mr-1 text-red-600" />
                    Reject
                  </Button>
                </div>
              ) : (
                <span
                  className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                    item.validation === "accepted" ? "bg-green-600" : "bg-red-600"
                  }`}
                >
                  {item.validation}
                </span>
              )}
            </TableCell>

            <TableCell>{item.notes}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};