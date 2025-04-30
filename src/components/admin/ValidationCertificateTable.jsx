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

export const ValidationCertificateTable = ({
  data,
  onAccept,
  onReject,
}) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Issued Date</TableHead>
            <TableHead>Course Name</TableHead>
            <TableHead>Expired Date</TableHead>
            <TableHead>Validation</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.issuedDate}</TableCell>
              <TableCell>{item.courseName}</TableCell>
              <TableCell>{item.expiredDate}</TableCell>

              <TableCell>
                {/* Conditional content di kolom Validation */}
                {item.status ? (
                  <span
                    className={`px-3 py-1 rounded-full text-white text-xs font-medium ${
                      item.status === "accepted" ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {item.status}
                  </span>
                ) : (
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
                )}
              </TableCell>

              <TableCell>{item.notes}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
