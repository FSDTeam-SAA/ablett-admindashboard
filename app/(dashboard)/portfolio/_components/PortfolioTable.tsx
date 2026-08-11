"use client";

import { useEffect, useState, type ComponentProps } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilLine, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

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
import { ProjectForm } from "./ProjectForm";
import {
  EditProjectForm,
  type EditableProject,
} from "./EditProjectForm";
import { PortfolioTableSkeleton } from "./PortfolioTableSkeleton";

type Project = EditableProject & {
  projectExperience: string | null;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
};

type ProjectMeta = {
  page: number;
  limit: number;
  total: number;
};

type ProjectApiResponse<T> = {
  statusCode?: number;
  success?: boolean;
  status?: boolean;
  message?: string;
  error?: string;
  meta?: ProjectMeta;
  data?: T;
};

type ProjectFormPayload = Parameters<
  ComponentProps<typeof ProjectForm>["onSave"]
>[0];

const pageSize = 10;
const projectsQueryKey = "admin-projects";

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
  const data: ProjectApiResponse<T> | null = await response
    .json()
    .catch(() => null);

  if (!response.ok || data?.success === false || data?.status === false) {
    throw new Error(data?.message || data?.error || fallback);
  }

  if (!data) {
    throw new Error(fallback);
  }

  return data;
}

async function fetchProjects({
  page,
  accessToken,
}: {
  page: number;
  accessToken?: string;
}) {
  const url = new URL(`${getApiBaseUrl()}/project`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(pageSize));
  url.searchParams.set("sortBy", "createdAt");
  url.searchParams.set("sortOrder", "desc");

  const response = await fetch(url.toString(), {
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });
  const data = await parseResponse<Project[]>(
    response,
    "Failed to fetch projects.",
  );

  return {
    projects: data.data ?? [],
    meta: data.meta ?? {
      page,
      limit: pageSize,
      total: data.data?.length ?? 0,
    },
  };
}

async function createProject({
  payload,
  accessToken,
}: {
  payload: ProjectFormPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/project`, {
    method: "POST",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: buildProjectFormData(payload),
  });

  return parseResponse<unknown>(response, "Failed to create project.");
}

async function updateProject({
  id,
  payload,
  accessToken,
}: {
  id: string;
  payload: ProjectFormPayload;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/project/${id}`, {
    method: "PUT",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: buildProjectFormData(payload),
  });

  return parseResponse<Project>(response, "Failed to update project.");
}

async function deleteProject({
  id,
  accessToken,
}: {
  id: string;
  accessToken?: string;
}) {
  const response = await fetch(`${getApiBaseUrl()}/project/${id}`, {
    method: "DELETE",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
  });

  return parseResponse<Project>(response, "Failed to delete project.");
}

function buildProjectFormData(payload: ProjectFormPayload) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (typeof value === "string" && value.trim()) {
      formData.append(key, value);
    }
  });

  return formData;
}

function formatDate(dateValue?: string) {
  if (!dateValue) return "-";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateValue));
}

function getShortText(value: string | null | undefined, fallback = "-") {
  if (!value) return fallback;

  return value.replace(/<[^>]*>/g, "").trim() || fallback;
}

export function PortfolioTable() {
  const { data: session, status: sessionStatus } = useSession();
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [editTarget, setEditTarget] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);
  const accessToken = session?.accessToken;

  const projectsQuery = useQuery({
    queryKey: [projectsQueryKey, currentPage, accessToken],
    queryFn: () => fetchProjects({ page: currentPage, accessToken }),
    enabled: sessionStatus !== "loading",
  });

  const createMutation = useMutation({
    mutationFn: (payload: ProjectFormPayload) =>
      createProject({ payload, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Project created successfully.");
      setIsProjectFormOpen(false);
      setCurrentPage(1);
      await queryClient.invalidateQueries({ queryKey: [projectsQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to create project."));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProject({ id, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Project deleted successfully.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({ queryKey: [projectsQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete project."));
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ProjectFormPayload;
    }) => updateProject({ id, payload, accessToken }),
    onSuccess: async (data) => {
      toast.success(data.message || "Project updated successfully.");
      setEditTarget(null);
      await queryClient.invalidateQueries({ queryKey: [projectsQueryKey] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to update project."));
    },
  });

  const projects = projectsQuery.data?.projects ?? [];
  const meta = projectsQuery.data?.meta;
  const totalItems = meta?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  useEffect(() => {
    if (!projectsQuery.isSuccess || currentPage <= totalPages) return;
    setCurrentPage(totalPages);
  }, [currentPage, projectsQuery.isSuccess, totalPages]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget._id);
  };

  if (isProjectFormOpen) {
    return (
      <ProjectForm
        onDiscard={() => setIsProjectFormOpen(false)}
        onSave={(payload) => createMutation.mutate(payload)}
        isSaving={createMutation.isPending}
      />
    );
  }

  if (editTarget) {
    return (
      <EditProjectForm
        project={editTarget}
        onDiscard={() => setEditTarget(null)}
        onSave={(payload) =>
          updateMutation.mutate({ id: editTarget._id, payload })
        }
        isSaving={updateMutation.isPending}
      />
    );
  }

  if (sessionStatus === "loading" || projectsQuery.isLoading) {
    return <PortfolioTableSkeleton />;
  }

  return (
    <main className="space-y-5">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsProjectFormOpen(true)}
          className="h-10 rounded-full bg-[#c98313] px-5 text-sm font-medium text-white hover:bg-[#b6750f]"
        >
          <Plus className="size-4" />
          Add Projects
        </Button>
      </div>

      {projectsQuery.isError ? (
        <div className="rounded-lg border border-[#5f5f5f] bg-[#181818] px-5 py-10 text-center text-sm text-[#f5b5b5]">
          {getErrorMessage(projectsQuery.error, "Failed to fetch projects.")}
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-[#5f5f5f]">
          <Table>
            <TableHeader className="bg-[#E6E6E61A]">
              <TableRow className="border-[#3a3a3a] hover:bg-transparent">
                <TableHead className="w-[360px] pl-5 text-left text-[14px] text-white">
                  Projects
                </TableHead>
                <TableHead className="w-[310px] text-center text-[14px] text-white">
                  Scope
                </TableHead>
                <TableHead className="w-[160px] text-center text-[14px] text-white">
                  Timeline
                </TableHead>
                <TableHead className="w-[170px] text-center text-[14px] text-white">
                  Created
                </TableHead>
                <TableHead className="w-[110px] text-center text-[14px] text-white">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects.length === 0 ? (
                <TableRow className="border-[#5b5b5b] hover:bg-transparent">
                  <TableCell
                    colSpan={5}
                    className="py-10 text-center text-sm text-[#bdbdbd]"
                  >
                    No projects found.
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow
                    key={project._id}
                    className="border-[#5b5b5b] hover:bg-[#181818]"
                  >
                    <TableCell className="w-[360px] py-2 pl-5 align-middle">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-[#2f2f2f]">
                          {project.coverImage ? (
                            <Image
                              src={project.coverImage}
                              alt={project.title ?? "Project cover"}
                              width={48}
                              height={40}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#8a8a8a]">
                              No Image
                            </span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-base font-medium leading-5 text-white">
                            {project.title ?? "Untitled project"}
                          </p>
                          <p className="truncate text-xs leading-4 text-[#b8b8b8]">
                            {getShortText(project.description, "No description")}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="w-[310px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                      <div className="mx-auto max-w-[280px] truncate">
                        {getShortText(project.scope)}
                      </div>
                    </TableCell>
                    <TableCell className="w-[160px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                      {getShortText(project.timeline)}
                    </TableCell>
                    <TableCell className="w-[170px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                      {formatDate(project.createdAt)}
                    </TableCell>

                    <TableCell className="w-[110px] py-4 text-center align-middle">
                      <div className="flex items-center justify-center gap-4 text-white">
                        <button
                          type="button"
                          onClick={() => setEditTarget(project)}
                          className="transition-colors hover:text-[#c9850d]"
                          aria-label={`Edit ${
                            project.title ?? "project"
                          }`}
                        >
                          <PencilLine className="size-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(project)}
                          className="transition-colors hover:text-[#ff4d62]"
                          aria-label={`Delete ${
                            project.title ?? "project"
                          }`}
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
            ? `Are you sure you want to delete ${
                deleteTarget.title ?? "this project"
              }?`
            : "Are you sure you want to delete this project?"
        }
      />
    </main>
  );
}
