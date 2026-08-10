"use client";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { QuoteRequest } from "./InquiriesTable";

type InquiryDetailsModalProps = {
  inquiry: QuoteRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isLoading?: boolean;
  errorMessage?: string;
};

export function InquiryDetailsModal({
  inquiry,
  open,
  onOpenChange,
  isLoading = false,
  errorMessage,
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

        {isLoading ? (
          <InquiryDetailsSkeleton />
        ) : errorMessage ? (
          <p className="rounded-md bg-[#3a2020] px-4 py-3 text-sm text-[#ffc4c4]">
            {errorMessage}
          </p>
        ) : (
          <div className="space-y-5 text-sm">
            <DetailItem label="Name" value={inquiry?.name} />
            <DetailItem label="Phone Number" value={inquiry?.phoneNumber} />
            <DetailItem label="Email" value={inquiry?.email} />
            <DetailItem label="Location" value={inquiry?.location} />
            <DetailItem label="Project Name" value={inquiry?.projectName} />
            <DetailItem label="Project Budget" value={inquiry?.projectBudget} />
            <DetailItem
              label="Project Status"
              value={formatStatus(inquiry?.projectStatus)}
            />

            <div>
              <p className="mb-2 font-medium text-[#8f8f8f]">Message</p>
              <p className="max-w-[610px] leading-5 text-white">
                {inquiry?.message || "-"}
              </p>
            </div>

            <div>
              <p className="mb-2 font-medium text-[#8f8f8f]">Images</p>
              {inquiry?.photo ? (
                <a
                  href={inquiry.photo}
                  target="_blank"
                  rel="noreferrer"
                  className="block size-[96px] rounded bg-cover bg-center ring-1 ring-white/10 transition-opacity hover:opacity-85"
                  style={{ backgroundImage: `url(${inquiry.photo})` }}
                  aria-label="Open inquiry uploaded image"
                />
              ) : (
                <p className="text-sm text-[#c8c8c8]">No image uploaded.</p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="mb-2 font-medium text-[#8f8f8f]">{label}</p>
      <p className="leading-5 text-white">{value || "-"}</p>
    </div>
  );
}

function InquiryDetailsSkeleton() {
  return (
    <div className="space-y-5">
      {Array.from({ length: 7 }, (_, index) => (
        <div key={index}>
          <div className="mb-2 h-4 w-[120px] animate-pulse rounded bg-[#353535]" />
          <div className="h-5 w-full max-w-[360px] animate-pulse rounded bg-[#2f2f2f]" />
        </div>
      ))}
      <div>
        <div className="mb-2 h-4 w-[80px] animate-pulse rounded bg-[#353535]" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-[#2f2f2f]" />
          <div className="h-4 w-4/5 animate-pulse rounded bg-[#2f2f2f]" />
        </div>
      </div>
    </div>
  );
}

function formatStatus(status?: string) {
  if (!status) return "-";
  if (status.toLowerCase() === "emergency") return "Urgent";

  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
