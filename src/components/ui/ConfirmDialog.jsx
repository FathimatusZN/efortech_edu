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

export default ConfirmDialog;
