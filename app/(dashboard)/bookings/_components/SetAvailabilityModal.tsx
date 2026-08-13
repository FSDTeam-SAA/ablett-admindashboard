"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type SetAvailabilityModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type AvailabilityPayload = {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  appointmentDuration: number;
  breakStartTime: string;
  breakEndTime: string;
};

type ApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  data?: T;
};

const durations = [30, 45, 60];

const initialFormState: AvailabilityPayload = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  appointmentDuration: 30,
  breakStartTime: "",
  breakEndTime: "",
};

function getApiBaseUrl() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!apiBaseUrl) {
    throw new Error("API base URL is not configured.");
  }

  return apiBaseUrl.replace(/\/+$/, "");
}

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

async function parseResponse<T>(response: Response, fallback: string) {
  const data: ApiResponse<T> | null = await response.json().catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || fallback);
  }

  if (!data) {
    throw new Error(fallback);
  }

  return data;
}

async function createAvailabilitySchedule({
  payload,
  accessToken,
}: {
  payload: AvailabilityPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/booking/schedule`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<unknown>(
    response,
    "Failed to save availability schedule.",
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[13px] font-medium leading-none text-white">
      {children}
    </label>
  );
}

function SelectField({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-11 w-full appearance-none rounded-[4px] border border-[#565656] bg-[#1f1f1f] px-4 pr-10 text-[13px] text-[#d7d7d7] outline-none transition-colors focus:border-[#c98518]"
      >
        {durations.map((duration) => (
          <option key={duration} value={duration}>
            {duration} Minutes
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#565656]" />
    </div>
  );
}

function AvailabilityInput({
  type,
  placeholder,
  value,
  onChange,
}: {
  type: "date" | "time";
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <Input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 rounded-[4px] border-[#565656] bg-[#1f1f1f] px-4 text-[13px] text-[#d7d7d7] outline-none [color-scheme:dark] placeholder:text-[#858585] focus-visible:border-[#c98518] focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-40"
    />
  );
}

export function SetAvailabilityModal({
  open,
  onOpenChange,
}: SetAvailabilityModalProps) {
  const { data: session } = useSession();
  const [formState, setFormState] =
    useState<AvailabilityPayload>(initialFormState);
  const accessToken = session?.accessToken;

  const createScheduleMutation = useMutation({
    mutationFn: (payload: AvailabilityPayload) =>
      createAvailabilitySchedule({ payload, accessToken }),
    onSuccess: (data) => {
      toast.success(data.message || "Availability schedule saved successfully.");
      setFormState(initialFormState);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to save availability schedule."),
      );
    },
  });

  const updateField = <Key extends keyof AvailabilityPayload>(
    key: Key,
    value: AvailabilityPayload[Key],
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!accessToken) {
      toast.error("Please login to save availability.");
      return;
    }

    const hasEmptyField = Object.entries(formState).some(
      ([key, value]) => key !== "appointmentDuration" && !value,
    );

    if (hasEmptyField) {
      toast.error("Please fill in all availability fields.");
      return;
    }

    createScheduleMutation.mutate(formState);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        overlayClassName="bg-black/70 backdrop-blur-[1px]"
        className="w-[calc(100%-2rem)] !max-w-[930px] gap-0 rounded-[8px] border border-[#2e2e2e] bg-[#1f1f1f] p-0 text-white shadow-2xl"
      >
        <Button
          type="button"
          onClick={() => onOpenChange(false)}
          size="icon"
          className="absolute right-0 top-0 flex size-12 translate-x-0 translate-y-0 items-center justify-center rounded-bl-[8px] rounded-tr-[8px] bg-[#c98518] text-white transition-colors hover:bg-[#d89524]"
          aria-label="Close availability modal"
        >
          <X className="size-7" strokeWidth={1.6} />
        </Button>

        <div className="px-6 pb-6 pt-7 sm:px-8">
          <DialogTitle className="text-[22px] font-semibold leading-7 text-white">
            Set Availability
          </DialogTitle>

          <form className="mt-5 space-y-5" onSubmit={handleSubmit}>
            {/* <label className="flex w-fit items-center gap-2 text-[13px] leading-none text-white">
              <input
                type="radio"
                name="availabilityType"
                className="size-3.5 accent-[#c98518]"
              />
              <span>Default Schedule</span>
            </label> */}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <FieldLabel>Start Date</FieldLabel>
                <AvailabilityInput
                  type="date"
                  placeholder="Select date"
                  value={formState.startDate}
                  onChange={(value) => updateField("startDate", value)}
                />
              </div>

              <div className="space-y-3">
                <FieldLabel>End Date</FieldLabel>
                <AvailabilityInput
                  type="date"
                  placeholder="Select date"
                  value={formState.endDate}
                  onChange={(value) => updateField("endDate", value)}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <FieldLabel>Start Time</FieldLabel>
                <AvailabilityInput
                  type="time"
                  placeholder="Select time"
                  value={formState.startTime}
                  onChange={(value) => updateField("startTime", value)}
                />
              </div>

              <div className="space-y-3">
                <FieldLabel>End Time</FieldLabel>
                <AvailabilityInput
                  type="time"
                  placeholder="Select time"
                  value={formState.endTime}
                  onChange={(value) => updateField("endTime", value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <FieldLabel>Appointment Duration</FieldLabel>
              <SelectField
                value={formState.appointmentDuration}
                onChange={(value) => updateField("appointmentDuration", value)}
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-3">
                <FieldLabel>Break Time Start</FieldLabel>
                <AvailabilityInput
                  type="time"
                  placeholder="Select time"
                  value={formState.breakStartTime}
                  onChange={(value) => updateField("breakStartTime", value)}
                />
              </div>

              <div className="space-y-3">
                <FieldLabel>Break Time End</FieldLabel>
                <AvailabilityInput
                  type="time"
                  placeholder="Select time"
                  value={formState.breakEndTime}
                  onChange={(value) => updateField("breakEndTime", value)}
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                disabled={createScheduleMutation.isPending}
                size="lg"
                className="inline-flex h-11 min-w-[120px] items-center justify-center rounded-full bg-[#c98518] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#d89524] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {createScheduleMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
