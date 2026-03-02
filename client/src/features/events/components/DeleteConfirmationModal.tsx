import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Button from '../../../components/common/Button';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
    title?: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
    title = 'Delete Event'
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-x-hidden overflow-y-auto outline-none">
            <div
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="absolute top-6 right-6">
                    <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 sm:p-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 flex-shrink-0">
                            <AlertCircle size={20} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            {title}
                        </h3>
                    </div>

                    <p className="text-slate-500 font-medium text-base leading-relaxed mb-10">
                        Are you sure you want to delete this event? This action cannot be undone.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            className="!rounded-2xl flex-1 !py-4 font-bold border-slate-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            isLoading={isLoading}
                            className="!rounded-2xl flex-1 !py-4 font-bold !bg-red-500 hover:!bg-red-600 !border-none !text-white shadow-lg shadow-red-100"
                        >
                            Delete Event
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
