'use client'

import React from 'react';
import alarmIcon from '@/assets/images/alarm.png';
import Image from 'next/image';
import { useDialogStore } from '@/stores/MultiDialogStore';
import { Label } from '../ui/label';

interface DeleteConfirmationProps {
    itemName: string;
    itemType?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ itemName }) => {

    const { handleConfirm } = useDialogStore();

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        handleConfirm();
    }

    return (
        <form id="delete-form" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-200">
                    <Image
                        src={alarmIcon}
                        alt="Delete confirmation"
                        width={54}
                        height={54}
                    />
                </div>

                <div className="flex flex-col items-center justify-center">
                    <Label className="text-md text-muted-foreground mb-2">
                        Are you sure you want to delete <strong>{itemName}</strong>?
                    </Label>
                    <Label className="text-md text-muted-foreground">
                        This action cannot be undone.
                    </Label>
                </div>
            </div>
        </form>
    );
};

export default DeleteConfirmation;