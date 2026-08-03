"use client";

import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

type Faq = {
  question: string;
  answer: string;
};

type FaqDetailsModalProps = {
  faq: Faq | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function FaqDetailsModal({
  faq,
  open,
  onOpenChange,
}: FaqDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/75 backdrop-blur-none"
        className="w-[526px] max-w-[calc(100%-2rem)] gap-0 rounded-md border-0 bg-[#1f1f1f] px-6 pb-12 pt-12 text-white shadow-2xl ring-0 sm:max-w-[526px]"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-sm rounded-tr-md bg-[#c98313] text-white transition-colors hover:bg-[#b6750f]"
          aria-label="Close FAQ details"
        >
          <X className="size-5" />
        </button>

        <DialogTitle className="mb-6 text-xl font-semibold leading-6 text-white">
          FAQ Details
        </DialogTitle>

        <div className="space-y-5">
          <div>
            <p className="mb-2 text-sm font-medium text-[#8f8f8f]">Question</p>
            <DialogDescription className="text-sm leading-5 text-white">
              {faq?.question}
            </DialogDescription>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-[#8f8f8f]">Answer</p>
            <p className="text-sm leading-5 text-white">{faq?.answer}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
