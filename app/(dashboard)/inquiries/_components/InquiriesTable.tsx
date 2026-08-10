"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Eye, Mail, Trash2 } from "lucide-react";

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
import { InquiryDetailsModal } from "./InquiryDetailsModal";
import { InquiriesTableSkeleton } from "./InquiriesTableSkeleton";

export type QuoteRequest = {
  userId: string | null;
  _id: string;
  name: string;
  phoneNumber: string;
  email: string;
  location: string;
  projectName: string;
  projectBudget: string;
  projectStatus: string;
  message: string;
  photo: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type QuoteMeta = {
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
  meta?: QuoteMeta;
  data?: T;
};

const pageSize = 10;
const quotesQueryKey = "admin-quotes";
const quoteDetailsQueryKey = "admin-quote-details";

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

async function fetchQuotes({
  page,
  accessToken,
}: {
  page: number;
  accessToken?: string;
}) {
  const url = new URL(`${getApiBaseUrl()}/quote`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(pageSize));

  const response = await fetch(url.toString(), {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await parseResponse<QuoteRequest[]>(
    response,
    "Failed to fetch inquiries.",
  );

  return {
    inquiries: data.data ?? [],
    meta: data.meta ?? {
      page,
      limit: pageSize,
      total: data.data?.length ?? 0,
    },
  };
}

async function fetchQuoteDetails({
  id,
  accessToken,
}: {
  id: string;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/quote/${id}`, {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await parseResponse<QuoteRequest>(
    response,
    "Failed to fetch inquiry details.",
  );

  if (!data.data) {
    throw new Error("Inquiry details were not found.");
  }

  return data.data;
}

async function deleteQuote({
  id,
  accessToken,
}: {
  id: string;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/quote/${id}`, {
    method: "DELETE",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return parseResponse<QuoteRequest>(response, "Failed to delete inquiry.");
}

function formatStatus(status: string) {
  if (!status) return "-";
  if (status.toLowerCase() === "emergency") return "Urgent";

  return status
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function openEmailComposer(inquiry: QuoteRequest) {
  const subject = encodeURIComponent(
    `Quote request: ${inquiry.projectName || "Project inquiry"}`,
  );
  const body = encodeURIComponent(`Hi ${inquiry.name},\n\n`);

  window.location.href = `mailto:${inquiry.email}?subject=${subject}&body=${body}`;
}

export function InquiriesTable() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<QuoteRequest | null>(null);
  const [detailsTargetId, setDetailsTargetId] = useState<string | null>(null);
  const accessToken = session?.accessToken;

  const inquiriesQuery = useQuery({
    queryKey: [quotesQueryKey, currentPage, accessToken],
    queryFn: () => fetchQuotes({ page: currentPage, accessToken }),
    enabled: Boolean(accessToken),
  });

  const detailsQuery = useQuery({
    queryKey: [quoteDetailsQueryKey, detailsTargetId, accessToken],
    queryFn: () =>
      fetchQuoteDetails({
        id: detailsTargetId as string,
        accessToken,
      }),
    enabled: Boolean(detailsTargetId && accessToken),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteQuote({ id, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Inquiry deleted successfully.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: [quotesQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete inquiry."));
    },
  });

  const inquiries = inquiriesQuery.data?.inquiries ?? [];
  const meta = inquiriesQuery.data?.meta;
  const totalItems = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const selectedFallbackInquiry =
    inquiries.find((inquiry) => inquiry._id === detailsTargetId) ?? null;

  useEffect(() => {
    if (!inquiriesQuery.isSuccess || currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, inquiriesQuery.isSuccess, totalPages]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id);
  };

  if (sessionStatus === "loading" || inquiriesQuery.isLoading) {
    return <InquiriesTableSkeleton />;
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
      {inquiriesQuery.isError ? (
        <div className="rounded-lg border border-[#5f5f5f] bg-[#181818] px-5 py-10 text-center text-sm text-[#f5b5b5]">
          {getErrorMessage(inquiriesQuery.error, "Failed to fetch inquiries.")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#5f5f5f]">
          <Table>
            <TableHeader className="bg-[#E6E6E61A]">
              <TableRow className="border-[#3a3a3a] hover:bg-transparent">
                <TableHead className="w-[210px] text-center text-[14px] text-white">
                  Name
                </TableHead>
                <TableHead className="w-[190px] text-center text-[14px] text-white">
                  Phone Number
                </TableHead>
                <TableHead className="w-[260px] text-center text-[14px] text-white">
                  Email
                </TableHead>
                <TableHead className="w-[300px] text-center text-[14px] text-white">
                  Location
                </TableHead>
                <TableHead className="w-[150px] text-center text-[14px] text-white">
                  Status
                </TableHead>
                <TableHead className="w-[140px] text-center text-[14px] text-white">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {inquiries.length === 0 ? (
                <TableRow className="border-[#5b5b5b] hover:bg-transparent">
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-[#bdbdbd]"
                  >
                    No inquiries found.
                  </TableCell>
                </TableRow>
              ) : (
                inquiries.map((inquiry) => (
                  <TableRow
                    key={inquiry._id}
                    className="border-[#5b5b5b] hover:bg-[#181818]"
                  >
                    <TableCell className="w-[210px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                      {inquiry.name}
                    </TableCell>
                    <TableCell className="w-[190px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                      {inquiry.phoneNumber}
                    </TableCell>
                    <TableCell className="w-[260px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                      <div className="mx-auto max-w-[230px] truncate">
                        {inquiry.email}
                      </div>
                    </TableCell>
                    <TableCell className="w-[300px] py-6 text-center align-middle text-[14px] leading-5 text-[#E6E6E6]">
                      <div className="mx-auto max-w-[260px]">
                        {inquiry.location}
                      </div>
                    </TableCell>
                    <TableCell className="w-[150px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                      {formatStatus(inquiry.projectStatus)}
                    </TableCell>
                    <TableCell className="w-[140px] py-6 text-center align-middle">
                      <div className="flex items-center justify-center gap-3 text-white">
                        <button
                          type="button"
                          onClick={() => setDetailsTargetId(inquiry._id)}
                          className="transition-colors hover:text-[#c9850d]"
                          aria-label={`View ${inquiry.name}`}
                        >
                          <Eye className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEmailComposer(inquiry)}
                          className="transition-colors hover:text-[#c9850d]"
                          aria-label={`Email ${inquiry.name}`}
                        >
                          <Mail className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(inquiry)}
                          className="transition-colors hover:text-[#ff4d62]"
                          aria-label={`Delete ${inquiry.name}`}
                        >
                          <Trash2 className="size-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
            : "Are you sure you want to delete this inquiry?"
        }
      />
      <InquiryDetailsModal
        inquiry={detailsQuery.data ?? selectedFallbackInquiry}
        open={Boolean(detailsTargetId)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsTargetId(null);
          }
        }}
        isLoading={detailsQuery.isLoading}
        errorMessage={
          detailsQuery.isError
            ? getErrorMessage(
                detailsQuery.error,
                "Failed to fetch inquiry details.",
              )
            : undefined
        }
      />
    </main>
  );
}
