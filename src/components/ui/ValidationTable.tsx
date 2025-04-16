import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BsCheckCircleFill, BsFillXCircleFill } from "react-icons/bs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type ValidationCourseData = {
  id: string;
  fullName: string;
  registrationDate: string;
  courseName: string;
  session: string;
  notes: string;
  validation?: "pending" | "waiting for payment" | "validated";
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
  onStatusChange?: (id: string, newStatus: "pending" | "waiting for payment" | "validated") => void;
};

export const ValidationTable: React.FC<Props> = ({
  data,
  dataType,
  statusType,
  onAccept,
  onReject,
  onStatusChange,
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
          <TableHead>{dataType === "course" ? "Status" : "Validation"}</TableHead>
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
              {dataType === "course" && statusType === "needToProcess" ? (
                <Select
                onValueChange={(value) =>
                  onStatusChange?.(item.id, value as "pending" | "waiting for payment" | "validated")
                }
                defaultValue={item.validation}
              >
                <SelectTrigger
                  className={cn(
                    "w-[180px] rounded-2xl mx-auto border-2",
                    item.validation === "pending"
                      ? "border-neutral-400"
                      : "border-mainOrange"
                  )}
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="waiting for payment">Waiting for Payment</SelectItem>
                  <SelectItem value="validated">Validated</SelectItem>
                </SelectContent>
              </Select>
              ) : statusType === "needToProcess" && !(item as ValidationCertificateData).validation ? (
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
                    (dataType === "course" && (item as ValidationCourseData).validation === "validated") ||
                    (dataType === "certificate" && (item as ValidationCertificateData).validation === "accepted")
                      ? "bg-green-600"
                      : "bg-red-600"
                  }`}
                >
                  {dataType === "course"
                    ? (item as ValidationCourseData).validation
                    : (item as ValidationCertificateData).validation}
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