// 📁 table.jsx
// Path: src/app/(admin)/manage-admin/table.jsx

import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getAdminColumns = (handleEdit) => [
    {
        id: "select",
        header: ({ table }) => (
            <input
                type="checkbox"
                checked={table.getIsAllPageRowsSelected()}
                onChange={table.getToggleAllPageRowsSelectedHandler()}
            />
        ),
        cell: ({ row }) => (
            <input
                type="checkbox"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
            />
        ),
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "fullname",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Name <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        )
    },
    {
        accessorKey: "email",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Email <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        )
    },
    {
        accessorKey: "last_updated",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Last Updated <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        )
    },
    {
        accessorKey: "last_login",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Last Login <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        )
    },
    {
        accessorKey: "role_name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Role <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        filterFn: (row, columnId, filterValue) => {
            return row.getValue(columnId) === filterValue;
        }
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>Status <ArrowUpDown className="ml-2 h-4 w-4" /></Button>
        ),
        cell: ({ row }) => (
            <span className={`text-sm font-medium ${row.original.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                {row.original.status}
            </span>
        ),
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            const isInactive = row.original.status !== "Active";
            return (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => !isInactive && handleEdit(row.original)}
                    disabled={isInactive}
                >
                    Edit
                </Button>
            );
        }
    },
];
