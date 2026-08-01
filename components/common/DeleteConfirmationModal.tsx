"use client";

import { TriangleAlert } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteConfirmationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  cancelLabel?: string;
  confirmLabel?: string;
};

export function DeleteConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Are You Sure?",
  description = "Are you sure you want to delete this item?",
  cancelLabel = "Cancel",
  confirmLabel = "Delete",
}: DeleteConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/75 backdrop-blur-none"
        className="w-[354px] max-w-[calc(100%-2rem)] gap-0 rounded-lg border-0 bg-[#202020] p-4 text-white shadow-2xl ring-0"
      >
        <div className="mb-4 flex size-10 items-center justify-center rounded-full bg-[#4b4b4b]">
          <div className="flex size-7 items-center justify-center rounded-full border border-[#9a9a9a] text-[#d0d0d0]">
            <TriangleAlert className="size-4" strokeWidth={1.8} />
          </div>
        </div>

        <DialogTitle className="text-base font-semibold leading-5 text-white">
          {title}
        </DialogTitle>
        <DialogDescription className="mt-2 text-sm leading-5 text-[#9a9a9a]">
          {description}
        </DialogDescription>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="h-10 rounded-full bg-[#5a5a5a] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#686868]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-full bg-[#c98313] px-6 text-xs font-semibold text-white transition-colors hover:bg-[#b6750f]"
          >
            {confirmLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
