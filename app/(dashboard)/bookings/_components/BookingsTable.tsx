"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { CheckCircle2, ChevronDown, Trash2, XCircle } from "lucide-react";

import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Pagination } from "@/components/common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookingsTableSkeleton } from "./BookingsTableSkeleton";

type BookingStatus =
  | "pending"
  | "scheduled"
  | "completed"
  | "rejected"
  | "canceled"
  | string;

type BookingAction = "accept" | "reject" | "complete";

type Booking = {
  userId: string | null;
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  projectLocation: string;
  message: string;
  scheduleId: string;
  slotId: string;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  __v?: number;
};

type BookingMeta = {
  page: number;
  limit: number;
  total: number;
};

type ApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  meta?: BookingMeta;
  data?: T;
};

const pageSize = 10;
const bookingsQueryKey = "admin-bookings";

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

async function fetchBookings({
  page,
  accessToken,
}: {
  page: number;
  accessToken?: string;
}) {
  const url = new URL(`${getApiBaseUrl()}/booking`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(pageSize));

  const response = await fetch(url.toString(), {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await parseResponse<Booking[]>(
    response,
    "Failed to fetch bookings.",
  );

  return {
    bookings: data.data ?? [],
    meta: data.meta ?? {
      page,
      limit: pageSize,
      total: data.data?.length ?? 0,
    },
  };
}

async function updateBookingStatus({
  id,
  action,
  accessToken,
}: {
  id: string;
  action: BookingAction;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/booking/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ action }),
  });

  return parseResponse<Booking>(response, "Failed to update booking status.");
}

async function deleteBooking({
  id,
  accessToken,
}: {
  id: string;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/booking/${id}`, {
    method: "DELETE",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return parseResponse<Booking>(response, "Failed to delete booking.");
}

function formatStatus(status: BookingStatus) {
  if (!status) return "-";

  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function formatDate(date?: string) {
  if (!date) return "-";

  const parsedDate = new Date(`${date}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

function formatTimeRange(startTime?: string, endTime?: string) {
  if (!startTime && !endTime) return "-";
  if (!endTime) return startTime ?? "-";
  if (!startTime) return endTime;

  return `${startTime} - ${endTime}`;
}

function getStatusClassName(status: BookingStatus) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "completed") {
    return "border-[#00a64f] text-[#00a64f]";
  }

  if (normalizedStatus === "rejected" || normalizedStatus === "canceled") {
    return "border-[#d71f1f] text-[#d71f1f]";
  }

  if (normalizedStatus === "pending") {
    return "border-[#e6a62e] text-[#e6a62e]";
  }

  return "border-[#be7a12] text-[#be7a12]";
}

function StatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span
      className={`inline-flex h-7 min-w-[86px] items-center justify-center rounded-full border px-3 text-[12px] leading-none ${getStatusClassName(
        status,
      )}`}
    >
      {formatStatus(status)}
    </span>
  );
}

function getAvailableActions(status: BookingStatus): BookingAction[] {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "pending") {
    return ["reject", "accept"];
  }

  if (normalizedStatus === "scheduled") {
    return ["reject"];
  }

  return [];
}

function StatusSelect({
  booking,
  disabled,
  onComplete,
}: {
  booking: Booking;
  disabled: boolean;
  onComplete: (booking: Booking) => void;
}) {
  const normalizedStatus = booking.status.toLowerCase();

  if (normalizedStatus !== "scheduled") {
    return <StatusBadge status={booking.status} />;
  }

  return (
    <div className="relative mx-auto w-[118px]">
      <select
        value={normalizedStatus}
        disabled={disabled}
        onChange={(event) => {
          if (event.target.value === "completed") {
            onComplete(booking);
          }
        }}
        className="h-8 w-full appearance-none rounded-full border border-[#be7a12] bg-[#101010] px-3 pr-7 text-center text-[12px] leading-none text-[#be7a12] outline-none transition-colors focus:border-[#d89524] disabled:cursor-not-allowed disabled:opacity-50"
        aria-label={`Update status for ${booking.name}`}
      >
        <option value="scheduled">Scheduled</option>
        <option value="completed">Completed</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#be7a12]" />
    </div>
  );
}

export function BookingsTable() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Booking | null>(null);
  const accessToken = session?.accessToken;

  const bookingsQuery = useQuery({
    queryKey: [bookingsQueryKey, currentPage, accessToken],
    queryFn: () => fetchBookings({ page: currentPage, accessToken }),
    enabled: Boolean(accessToken),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, action }: { id: string; action: BookingAction }) =>
      updateBookingStatus({ id, action, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Booking status updated successfully.");
      await queryClient.invalidateQueries({ queryKey: [bookingsQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update booking status."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking({ id, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Booking deleted successfully.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: [bookingsQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete booking."));
    },
  });

  const bookings = bookingsQuery.data?.bookings ?? [];
  const meta = bookingsQuery.data?.meta;
  const totalItems = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (!bookingsQuery.isSuccess || currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [bookingsQuery.isSuccess, currentPage, totalPages]);

  const handleStatusUpdate = (booking: Booking, action: BookingAction) => {
    statusMutation.mutate({ id: booking._id, action });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id);
  };

  if (sessionStatus === "loading" || bookingsQuery.isLoading) {
    return <BookingsTableSkeleton />;
  }

  if (!accessToken) {
    return (
      <div className="rounded-lg border border-[#5f5f5f] bg-[#181818] px-5 py-10 text-center text-sm text-[#f5b5b5]">
        Login token was not found. Please login again.
      </div>
    );
  }

  return (
    <main className="space-y-4">
      {bookingsQuery.isError ? (
        <div className="rounded-lg border border-[#5f5f5f] bg-[#181818] px-5 py-10 text-center text-sm text-[#f5b5b5]">
          {getErrorMessage(bookingsQuery.error, "Failed to fetch bookings.")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#5f5f5f] bg-[#101010]">
          <div className="overflow-x-auto">
            <Table className="min-w-[1120px]">
              <TableHeader className="bg-[#E6E6E61A]">
                <TableRow className="border-[#3a3a3a] hover:bg-transparent">
                  <TableHead className="w-[170px] text-center text-[14px] text-white">
                    Name
                  </TableHead>
                  <TableHead className="w-[210px] text-center text-[14px] text-white">
                    Project Location
                  </TableHead>
                  <TableHead className="w-[180px] text-center text-[14px] text-white">
                    Phone Number
                  </TableHead>
                  <TableHead className="w-[220px] text-center text-[14px] text-white">
                    Email
                  </TableHead>
                  <TableHead className="w-[160px] text-center text-[14px] text-white">
                    Date & Time
                  </TableHead>
                  <TableHead className="w-[140px] text-center text-[14px] text-white">
                    Status
                  </TableHead>
                  <TableHead className="w-[120px] text-center text-[14px] text-white">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.length === 0 ? (
                  <TableRow className="border-[#5b5b5b] hover:bg-transparent">
                    <TableCell
                      colSpan={7}
                      className="py-10 text-center text-sm text-[#bdbdbd]"
                    >
                      No bookings found.
                    </TableCell>
                  </TableRow>
                ) : (
                  bookings.map((booking) => {
                    const actions = getAvailableActions(booking.status);
                    const isStatusUpdating =
                      statusMutation.isPending &&
                      statusMutation.variables?.id === booking._id;

                    return (
                      <TableRow
                        key={booking._id}
                        className="border-[#5b5b5b] hover:bg-[#181818]"
                      >
                        <TableCell className="w-[170px] py-5 text-center align-middle text-[13px] text-[#D7D7D7]">
                          {booking.name}
                        </TableCell>
                        <TableCell className="w-[210px] py-5 text-center align-middle text-[13px] text-[#D7D7D7]">
                          <div className="mx-auto max-w-[180px]">
                            {booking.projectLocation}
                          </div>
                        </TableCell>
                        <TableCell className="w-[180px] py-5 text-center align-middle text-[13px] text-[#D7D7D7]">
                          {booking.phoneNumber}
                        </TableCell>
                        <TableCell className="w-[220px] py-5 text-center align-middle text-[13px] text-[#D7D7D7]">
                          <div className="mx-auto max-w-[190px] truncate">
                            {booking.email}
                          </div>
                        </TableCell>
                        <TableCell className="w-[160px] py-5 text-center align-middle text-[13px] leading-4 text-[#D7D7D7]">
                          <span>{formatDate(booking.date)}</span>
                          <br />
                          <span>
                            {formatTimeRange(booking.startTime, booking.endTime)}
                          </span>
                        </TableCell>
                        <TableCell className="w-[140px] py-5 text-center align-middle">
                          <StatusSelect
                            booking={booking}
                            disabled={isStatusUpdating}
                            onComplete={(selectedBooking) =>
                              handleStatusUpdate(selectedBooking, "complete")
                            }
                          />
                        </TableCell>
                        <TableCell className="w-[120px] py-5 text-center align-middle">
                          <div className="flex items-center justify-center gap-4">
                            {actions.includes("reject") ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(booking, "reject")
                                }
                                disabled={isStatusUpdating}
                                className="text-[#d71f1f] transition-colors hover:text-[#ff4d4d] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Reject ${booking.name}`}
                              >
                                <XCircle className="size-4" strokeWidth={1.8} />
                              </button>
                            ) : null}
                            {actions.includes("accept") ? (
                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusUpdate(booking, "accept")
                                }
                                disabled={isStatusUpdating}
                                className="text-[#00a64f] transition-colors hover:text-[#2fd877] disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`Accept ${booking.name}`}
                              >
                                <CheckCircle2
                                  className="size-4"
                                  strokeWidth={1.8}
                                />
                              </button>
                            ) : null}
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(booking)}
                              disabled={isStatusUpdating}
                              className="text-white transition-colors hover:text-[#ff4d62] disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label={`Delete ${booking.name}`}
                            >
                              <Trash2 className="size-5" strokeWidth={1.8} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

      <DeleteConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        isConfirming={deleteMutation.isPending}
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this booking?"
        }
      />
    </main>
  );
}
