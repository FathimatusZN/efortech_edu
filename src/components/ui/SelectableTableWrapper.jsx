// efortech_edu\src\components\ui\SelectableTableWrapper.jsx
"use client";

import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FaTrash } from "react-icons/fa";

/**
 * Reusable wrapper component for tables with checkbox selection functionality
 * 
 * @param {React.ReactNode} children - Table content (usually ValidationTrainingTable or similar)
 * @param {Array} data - Full dataset
 * @param {string} idKey - Key name for unique identifier (e.g., "registration_id", "certificate_id")
 * @param {Function} onDeleteSelected - Callback when delete selected is clicked
 * @param {Function} onDeleteAll - Callback when delete all is clicked (optional)
 * @param {string} itemType - Type of items for display (e.g., "registration", "certificate")
 * @param {boolean} showDeleteAll - Whether to show delete all button
 * @param {boolean} enabled - Enable/disable selection (default: true)
 */
export const SelectableTableWrapper = ({
    children,
    data = [],
    idKey = "id",
    onDeleteSelected,
    onDeleteAll,
    itemType = "item",
    showDeleteAll = false,
    enabled = true,
}) => {
    const [selectedRows, setSelectedRows] = useState([]);

    // Handle individual row selection
    const handleSelectRow = (itemId, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, itemId]);
        } else {
            setSelectedRows(selectedRows.filter((id) => id !== itemId));
        }
    };

    // Handle select all on current page
    const handleSelectAll = (checked, currentPageIds) => {
        if (checked) {
            // Add all IDs from current page that aren't already selected
            const newSelections = currentPageIds.filter(
                (id) => !selectedRows.includes(id)
            );
            setSelectedRows([...selectedRows, ...newSelections]);
        } else {
            // Remove all IDs from current page
            setSelectedRows(
                selectedRows.filter((id) => !currentPageIds.includes(id))
            );
        }
    };

    // Clear all selections
    const clearSelections = () => {
        setSelectedRows([]);
    };

    // Inject selection props into children
    const childrenWithProps = React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                selectedRows,
                onSelectRow: handleSelectRow,
                onSelectAll: handleSelectAll,
                selectionEnabled: enabled,
            });
        }
        return child;
    });

    if (!enabled) {
        return <>{children}</>;
    }

    return (
        <div>
            {/* Action buttons */}
            <div className="flex justify-between items-center mb-4 pt-2">
                <div className="text-sm text-gray-600">
                    {selectedRows.length > 0 && (
                        <span className="font-medium">
                            {selectedRows.length} {itemType}(s) selected
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                    {selectedRows.length > 0 && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                onDeleteSelected(selectedRows);
                                clearSelections();
                            }}
                            className="flex items-center gap-2"
                        >
                            <FaTrash />
                            Delete Selected
                        </Button>
                    )}
                    {showDeleteAll && data.length > 0 && onDeleteAll && (
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                                onDeleteAll();
                                clearSelections();
                            }}
                            className="flex items-center gap-2 bg-red-700 hover:bg-red-800"
                        >
                            <FaTrash />
                            Delete All {itemType}s
                        </Button>
                    )}
                </div>
            </div>

            {/* Table content */}
            {childrenWithProps}
        </div>
    );
};

/**
 * Hook for managing checkbox state in tables
 * Can be used as alternative to SelectableTableWrapper for more control
 */
export const useTableSelection = (idKey = "id") => {
    const [selectedRows, setSelectedRows] = useState([]);

    const handleSelectRow = (itemId, checked) => {
        if (checked) {
            setSelectedRows([...selectedRows, itemId]);
        } else {
            setSelectedRows(selectedRows.filter((id) => id !== itemId));
        }
    };

    const handleSelectAll = (checked, currentPageIds) => {
        if (checked) {
            const newSelections = currentPageIds.filter(
                (id) => !selectedRows.includes(id)
            );
            setSelectedRows([...selectedRows, ...newSelections]);
        } else {
            setSelectedRows(
                selectedRows.filter((id) => !currentPageIds.includes(id))
            );
        }
    };

    const clearSelections = () => {
        setSelectedRows([]);
    };

    const isSelected = (itemId) => {
        return selectedRows.includes(itemId);
    };

    const isAllSelected = (items) => {
        return items.length > 0 && items.every((item) =>
            selectedRows.includes(item[idKey])
        );
    };

    const isSomeSelected = (items) => {
        return items.some((item) => selectedRows.includes(item[idKey])) &&
            !isAllSelected(items);
    };

    return {
        selectedRows,
        handleSelectRow,
        handleSelectAll,
        clearSelections,
        isSelected,
        isAllSelected,
        isSomeSelected,
    };
};