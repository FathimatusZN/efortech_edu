import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const getAdminColumns = (handleEdit, handleDetail) => [
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
        accessorKey: "phone_number",
        header: "Number",
        cell: ({ row }) => {
            const value = row.getValue("phone_number");
            return value && value.trim() !== "" ? value : "-";
        },
    },
    {
        accessorKey: "last_login",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Last Login <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
        ),
        sortingFn: (rowA, rowB, columnId) => {
            const dateA = parseCustomDate(rowA.getValue(columnId));
            const dateB = parseCustomDate(rowB.getValue(columnId));
            // Prioritaskan non-null (null dianggap paling akhir)
            if (!dateA && !dateB) return 0;
            if (!dateA) return 1;
            if (!dateB) return -1;
            return dateA - dateB;
        }
    },
    {
        accessorKey: "role_name",
        header: "Role",
        enableSorting: false,
        filterFn: (row, columnId, filterValue) => {
            return row.getValue(columnId) === filterValue;
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
        cell: ({ row }) => (
            <span className={`text-sm font-medium ${row.original.status === "Active" ? "text-green-600" : "text-red-500"}`}>
                {row.original.status}
            </span>
        ),
    },
    {
        id: "detail",
        header: "Detail",
        cell: ({ row }) => {
            return (
                <Button
                    variant="lightBlue"
                    size="sm"
                    onClick={() => handleDetail(row.original)}
                >
                    Detail
                </Button>
            );
        }
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            const isInactive = row.original.status !== "Active";
            return (
                <Button
                    variant="mainBlue"
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

function parseCustomDate(dateStr) {
    if (!dateStr) return null;
    // Format: "dd/MM/yy, hh.mm.ss AM/PM"
    const [datePart, timePartWithMeridiem] = dateStr.split(", ");
    if (!datePart || !timePartWithMeridiem) return null;

    const [day, month, yearShort] = datePart.split("/");
    const [timePart, meridiem] = timePartWithMeridiem.split(" ");
    const [hoursStr, minutesStr, secondsStr] = timePart.split(".");

    let hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    const seconds = parseInt(secondsStr, 10);
    const year = parseInt("20" + yearShort, 10);

    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;

    return new Date(year, month - 1, day, hours, minutes, seconds);
}
