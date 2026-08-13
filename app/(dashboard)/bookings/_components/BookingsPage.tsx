"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { BookingsTable } from "./BookingsTable";
import { SetAvailabilityModal } from "./SetAvailabilityModal";

export function BookingsPage() {
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  return (
    <main className="space-y-5">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsAvailabilityModalOpen(true)}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#c98518] px-6 text-[14px] font-medium text-white shadow-[0_10px_24px_rgba(201,133,24,0.18)] transition-colors hover:bg-[#d89524]"
        >
          <Plus className="size-5" strokeWidth={1.8} />
          <span>Set Availability</span>
        </button>
      </div>

      <BookingsTable />

      <SetAvailabilityModal
        open={isAvailabilityModalOpen}
        onOpenChange={setIsAvailabilityModalOpen}
      />
    </main>
  );
}
