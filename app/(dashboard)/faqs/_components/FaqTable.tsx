"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Pagination } from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditFaqForm } from "./EditFaqForm";
import { FaqDetailsModal } from "./FaqDetailsModal";
import { FaqForm, type FaqPayload } from "./FaqForm";
import { FaqTableSkeleton } from "./FaqTableSkeleton";

type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type FaqMeta = {
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
  meta?: FaqMeta;
  data?: T;
};

const pageSize = 10;
const faqQueryKey = "admin-faqs";

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

async function fetchFaqs(page: number) {
  const url = new URL(`${getApiBaseUrl()}/faq`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(pageSize));
  url.searchParams.set("sortBy", "createdAt");
  url.searchParams.set("sortOrder", "desc");

  const response = await fetch(url.toString());
  const data = await parseResponse<FaqItem[]>(
    response,
    "Failed to fetch FAQs.",
  );

  return {
    faqs: data.data ?? [],
    meta: data.meta ?? { page, limit: pageSize, total: data.data?.length ?? 0 },
  };
}

async function createFaq({
  payload,
  accessToken,
}: {
  payload: FaqPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/faq`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<FaqItem>(response, "Failed to create FAQ.");
}

async function updateFaq({
  id,
  payload,
  accessToken,
}: {
  id: string;
  payload: FaqPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/faq/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  return parseResponse<FaqItem>(response, "Failed to update FAQ.");
}

async function deleteFaq({
  id,
  accessToken,
}: {
  id: string;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/faq/${id}`, {
    method: "DELETE",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return parseResponse<FaqItem>(response, "Failed to delete FAQ.");
}

export function FaqTable() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<FaqItem | null>(null);
  const [editTarget, setEditTarget] = useState<FaqItem | null>(null);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);
  const accessToken = session?.accessToken;

  const faqsQuery = useQuery({
    queryKey: [faqQueryKey, currentPage],
    queryFn: () => fetchFaqs(currentPage),
  });

  const createMutation = useMutation({
    mutationFn: (payload: FaqPayload) => createFaq({ payload, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "FAQ created successfully.");
      setIsFaqFormOpen(false);
      setCurrentPage(1);
      await queryClient.invalidateQueries({ queryKey: [faqQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create FAQ."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: FaqPayload;
    }) => updateFaq({ id, payload, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "FAQ updated successfully.");
      setEditTarget(null);
      await queryClient.invalidateQueries({ queryKey: [faqQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update FAQ."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFaq({ id, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "FAQ deleted successfully.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: [faqQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete FAQ."));
    },
  });

  const faqs = faqsQuery.data?.faqs ?? [];
  const meta = faqsQuery.data?.meta;
  const totalItems = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (!faqsQuery.isSuccess || currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, faqsQuery.isSuccess, totalPages]);

  const handleCreateFaq = (payload: FaqPayload) => {
    if (!payload.question || !payload.answer) {
      toast.error("Please enter both question and answer.");
      return;
    }

    createMutation.mutate(payload);
  };

  const handleUpdateFaq = (payload: FaqPayload) => {
    if (!editTarget) return;

    if (!payload.question || !payload.answer) {
      toast.error("Please enter both question and answer.");
      return;
    }

    updateMutation.mutate({ id: editTarget._id, payload });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id);
  };

  if (isFaqFormOpen) {
    return (
      <FaqForm
        onDiscard={() => setIsFaqFormOpen(false)}
        onSave={handleCreateFaq}
        isSaving={createMutation.isPending}
      />
    );
  }

  if (editTarget) {
    return (
      <EditFaqForm
        faq={editTarget}
        onDiscard={() => setEditTarget(null)}
        onSave={handleUpdateFaq}
        isSaving={updateMutation.isPending}
      />
    );
  }

  if (faqsQuery.isLoading) {
    return <FaqTableSkeleton />;
  }

  return (
    <main className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsFaqFormOpen(true)}
          className="h-10 rounded-full bg-[#c98313] px-5 text-sm font-medium text-white hover:bg-[#b6750f]"
        >
          <Plus className="size-4" />
          Add FAQ
        </Button>
      </div>

      {faqsQuery.isError ? (
        <div className="rounded-lg border border-[#5f5f5f] bg-[#181818] px-5 py-10 text-center text-sm text-[#f5b5b5]">
          {getErrorMessage(faqsQuery.error, "Failed to fetch FAQs.")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#5f5f5f]">
          <Table>
            <TableHeader className="bg-[#E6E6E61A]">
              <TableRow className="border-[#3a3a3a] hover:bg-transparent">
                <TableHead className="w-[300px] text-center text-[14px] text-white">
                  Question
                </TableHead>
                <TableHead className="text-center text-[14px] text-white">
                  Answer
                </TableHead>
                <TableHead className="w-[140px] text-center text-[14px] text-white">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {faqs.length === 0 ? (
                <TableRow className="border-[#5b5b5b] hover:bg-transparent">
                  <TableCell
                    colSpan={3}
                    className="py-10 text-center text-sm text-[#bdbdbd]"
                  >
                    No FAQs found.
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <TableRow
                    key={faq._id}
                    className="border-[#5b5b5b] hover:bg-[#181818]"
                  >
                    <TableCell className="w-[300px] py-4 text-center align-middle text-[14px] leading-5 text-[#E6E6E6]">
                      <div className="mx-auto max-w-[240px]">
                        {faq.question}
                      </div>
                    </TableCell>

                    <TableCell className="py-4 text-center align-middle text-[14px] leading-5 text-[#E6E6E6]">
                      <div className="mx-auto max-w-[520px]">{faq.answer}</div>
                    </TableCell>

                    <TableCell className="w-[140px] py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-3 text-white">
                        <button
                          type="button"
                          onClick={() => setDetailsTarget(faq)}
                          className="transition-colors hover:text-[#c9850d]"
                          aria-label={`View ${faq.question}`}
                        >
                          <Eye className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditTarget(faq)}
                          className="transition-colors hover:text-[#c9850d]"
                          aria-label={`Edit ${faq.question}`}
                        >
                          <Pencil className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(faq)}
                          className="transition-colors hover:text-[#ff4d62]"
                          aria-label={`Delete ${faq.question}`}
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
        description="Are you sure you want to delete this FAQ?"
      />
      <FaqDetailsModal
        faq={detailsTarget}
        open={Boolean(detailsTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDetailsTarget(null);
          }
        }}
      />
    </main>
  );
}
