'use client';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const ConfirmDialog = ({ open, onCancel, onConfirm, onDiscard }) => {
    return (
        <Dialog open={open} onOpenChange={onCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Unsaved Changes</DialogTitle>
                </DialogHeader>
                <p>You have unsaved changes. What would you like to do?</p>
                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button variant="secondary" onClick={onDiscard}>Discard Changes</Button>
                    <Button onClick={onConfirm}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ConfirmDialog;
