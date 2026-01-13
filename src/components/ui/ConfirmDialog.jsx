'use client';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDialog = ({ open, data, id, title, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-mainOrange">
                        ⚠️ Delete Confirmation
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this{' '}
                    <span className="font-medium text-mainBlue">{data}</span> data?
                </p>

                <table className="text-sm w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">ID</td>
                            <td className="text-black font-medium">: {id}</td>
                        </tr>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">Title</td>
                            <td className="text-black font-medium">: {title}</td>
                        </tr>
                    </tbody>
                </table>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-mainOrange hover:bg-orange-600 text-white"
                        onClick={onConfirm}
                    >
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ConfirmDialogAdmin = ({ open, data, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-mainOrange">
                        ⚠️ Delete Confirmation
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete this{' '}
                    <span className="font-medium text-mainBlue">{data}</span> data?
                </p>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-mainOrange hover:bg-orange-600 text-white"
                        onClick={onConfirm}
                    >
                        Yes, Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

const ArchiveDialog = ({ open, data, id, title, onCancel, onConfirm }) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-yellow-600">
                        🗃️ Archive Confirmation
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to archive this{' '}
                    <span className="font-medium text-mainBlue">{data}</span> data?
                </p>

                <table className="text-sm w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">ID</td>
                            <td className="text-black font-medium">: {id}</td>
                        </tr>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">Title</td>
                            <td className="text-black font-medium">: {title}</td>
                        </tr>
                    </tbody>
                </table>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={onConfirm}
                    >
                        Yes, Archive
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeleteTrainingDialog = ({ open, onCancel, onConfirm, relationStatus, message, data, id, title, summary }) => {
    const renderSummaryTable = () => {
        if (!summary) return null;

        return (
            <div className="mt-4 border rounded-lg p-3 bg-gray-50">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Related Data Summary:</h3>
                <table className="text-sm w-full">
                    <tbody>
                        <tr>
                            <td className="text-gray-600 w-40">Registrations</td>
                            <td className="font-medium text-black">{summary.total_registration}</td>
                        </tr>
                        <tr>
                            <td className="text-gray-600">Participants</td>
                            <td className="font-medium text-black">{summary.total_participant}</td>
                        </tr>
                        <tr>
                            <td className="text-gray-600">Reviews</td>
                            <td className="font-medium text-black">{summary.total_review}</td>
                        </tr>
                        <tr>
                            <td className="text-gray-600">Certificates</td>
                            <td className="font-medium text-black">{summary.total_certificate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    };

    const renderContent = () => {
        switch (relationStatus) {
            case 1:
                return (
                    <p className="text-sm text-muted-foreground">
                        {message} This action will permanently delete{' '}
                        <span className="font-medium text-mainBlue">{data}</span>{' '}
                        <span className="font-semibold">{title}</span>.
                        Are you sure you want to continue?
                    </p>
                );

            case 2:
                return (
                    <div className="text-sm text-muted-foreground space-y-3">
                        <p>
                            This training has existing registrations but none have certificates yet.
                            Deleting will also remove all related registrations, participants, and reviews (if any).
                        </p>
                        {renderSummaryTable()}
                        <p>
                            <span className="font-semibold text-mainBlue">{message}</span><br />
                            Are you sure you want to proceed?
                        </p>
                    </div>
                );

            case 3:
                return (
                    <div className="text-sm text-muted-foreground space-y-3">
                        <p>⚠️ {message}</p>
                        {renderSummaryTable()}
                        <p>This training cannot be deleted because at least one participant already has a certificate.</p>
                    </div>
                );

            default:
                return <p className="text-sm text-muted-foreground">Loading status...</p>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-red-700">
                        🗑️ Delete Training Confirmation
                    </DialogTitle>
                </DialogHeader>

                {renderContent()}

                <table className="text-sm w-full table-auto mt-3">
                    <tbody>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">ID</td>
                            <td className="text-black font-medium">: {id}</td>
                        </tr>
                        <tr>
                            <td className="text-lightBlue w-20 align-top">Title</td>
                            <td className="text-black font-medium">: {title}</td>
                        </tr>
                    </tbody>
                </table>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={onCancel}>
                        {relationStatus === 3 ? "OK" : "Cancel"}
                    </Button>

                    {relationStatus !== 3 && (
                        <Button
                            className="bg-red-700 hover:bg-red-800 text-white"
                            onClick={onConfirm}
                        >
                            Yes, Delete
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ConfirmUncertifiedDialog = ({
    open,
    participant,
    onCancel,
    onConfirm,
}) => {
    if (!participant) return null;

    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent className="space-y-4">
                <DialogHeader>
                    <DialogTitle className="text-lg font-semibold text-yellow-600">
                        ⚠️ Mark No Certificate
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to mark this participant as{" "}
                    <span className="font-semibold text-yellow-700">
                        No Certificate
                    </span>
                    ?
                </p>

                <p className="text-sm text-muted-foreground">
                    This action will move the participant to the{" "}
                    <span className="font-medium text-mainBlue">Completed</span>{" "}
                    tab and cannot be undone.
                </p>

                <table className="text-sm w-full table-auto">
                    <tbody>
                        <tr>
                            <td className="text-lightBlue w-28">Participant</td>
                            <td className="text-black font-medium">
                                : {participant.fullname}
                            </td>
                        </tr>
                        <tr>
                            <td className="text-lightBlue">Training</td>
                            <td className="text-black font-medium">
                                : {participant.training_name}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <DialogFooter className="flex justify-end gap-2 pt-4">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        onClick={onConfirm}
                    >
                        Yes, Mark No Certificate
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export { ConfirmDialog, ConfirmDialogAdmin, ArchiveDialog, DeleteTrainingDialog, ConfirmUncertifiedDialog };
