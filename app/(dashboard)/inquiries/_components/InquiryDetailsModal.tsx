"use client";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type InquiryDetails = {
  name: string;
  phone: string;
  email: string;
  location: string;
  projectName: string;
  projectBudget: string;
  message: string;
};

type InquiryDetailsModalProps = {
  inquiry: InquiryDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InquiryDetailsModal({
  inquiry,
  open,
  onOpenChange,
}: InquiryDetailsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/75 backdrop-blur-none"
        className="w-[668px] max-w-[calc(100%-2rem)] gap-0 rounded-md border-0 bg-[#1f1f1f] px-5 pb-16 pt-5 text-white shadow-2xl ring-0 sm:max-w-[668px]"
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-0 top-0 flex size-9 items-center justify-center rounded-bl-sm rounded-tr-md bg-[#c98313] text-white transition-colors hover:bg-[#b6750f]"
          aria-label="Close inquiry details"
        >
          <X className="size-6" />
        </button>

        <DialogTitle className="mb-5 text-xl font-semibold leading-6 text-white">
          Inquiries Details
        </DialogTitle>

        <div className="space-y-5 text-sm">
          <DetailItem label="Name" value={inquiry?.name} />
          <DetailItem label="Phone Number" value={inquiry?.phone} />
          <DetailItem label="Email" value={inquiry?.email} />
          <DetailItem label="Location" value={inquiry?.location} />
          <DetailItem label="Project Name" value={inquiry?.projectName} />
          <DetailItem label="Project Budget" value={inquiry?.projectBudget} />

          <div>
            <p className="mb-2 font-medium text-[#8f8f8f]">Message</p>
            <p className="max-w-[610px] leading-5 text-white">
              {inquiry?.message}
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-[#8f8f8f]">Images</p>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="size-[72px] rounded bg-[#d9d9d9]"
                  aria-label={`Inquiry image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="mb-2 font-medium text-[#8f8f8f]">{label}</p>
      <p className="leading-5 text-white">{value}</p>
    </div>
  );
}
