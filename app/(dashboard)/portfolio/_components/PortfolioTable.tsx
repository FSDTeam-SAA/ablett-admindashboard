"use client";

import { useState } from "react";
import { PencilLine, Plus, Trash2 } from "lucide-react";

import { DeleteConfirmationModal } from "@/components/common/DeleteConfirmationModal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ProjectForm } from "./ProjectForm";

type Project = {
  id: number;
  name: string;
  summary: string;
  client: string;
  location: string;
  category: string;
  completion: string;
  thumbnailClassName: string;
};

const initialProjects: Project[] = [
  {
    id: 1,
    name: "Custom Residential Home",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Jerome Bell",
    location: "8080 Railroad St.",
    category: "Commercial Construction",
    completion: "17 Oct, 2020",
    thumbnailClassName: "from-[#d9e6ef] via-[#798d8c] to-[#30424c]",
  },
  {
    id: 2,
    name: "Site Preparation & Foundations",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Kristin Watson",
    location: "8558 Green Rd.",
    category: "Residential Construction",
    completion: "17 Oct, 2020",
    thumbnailClassName: "from-[#f1c35c] via-[#84a7a5] to-[#426e3c]",
  },
  {
    id: 3,
    name: "Commercial Facility Development",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Ralph Edwards",
    location: "3890 Poplar Dr.",
    category: "Commercial Construction",
    completion: "8 Sep, 2020",
    thumbnailClassName: "from-[#b8d5e6] via-[#68796a] to-[#28425d]",
  },
  {
    id: 4,
    name: "Concrete Infrastructure",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Devon Lane",
    location: "3890 Poplar Dr.",
    category: "Commercial Construction",
    completion: "8 Sep, 2020",
    thumbnailClassName: "from-[#c0b9a8] via-[#735f49] to-[#2a2a2a]",
  },
  {
    id: 5,
    name: "Foundation Construction",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Darrell Steward",
    location: "775 Rolling Green Rd.",
    category: "Site Preparation & Foundations",
    completion: "1 Feb, 2020",
    thumbnailClassName: "from-[#e2e5e0] via-[#a0704b] to-[#4c5358]",
  },
  {
    id: 6,
    name: "Industrial Construction",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Eleanor Pena",
    location: "3605 Parker Rd.",
    category: "Residential Construction",
    completion: "8 Sep, 2020",
    thumbnailClassName: "from-[#dbe9ef] via-[#a8b7b0] to-[#3f6070]",
  },
  {
    id: 7,
    name: "Warehouse Development",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Jane Cooper",
    location: "3605 Parker Rd.",
    category: "Welding & Fabrication",
    completion: "24 May, 2020",
    thumbnailClassName: "from-[#dceaf1] via-[#889c85] to-[#293f3a]",
  },
  {
    id: 8,
    name: "Structural Steel Fabrication",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Annette Black",
    location: "7529 E. Pecan St.",
    category: "Site Preparation & Foundations",
    completion: "22 Oct, 2020",
    thumbnailClassName: "from-[#1b293e] via-[#926222] to-[#111111]",
  },
  {
    id: 9,
    name: "Residential Renovation",
    summary: "Built with precision, quality craftsmanship, and a...",
    client: "Esther Howard",
    location: "8558 Green Rd.",
    category: "Welding & Fabrication",
    completion: "21 Sep, 2020",
    thumbnailClassName: "from-[#d7e5e7] via-[#8c8c84] to-[#2b2b2b]",
  },
];

export function PortfolioTable() {
  const [projectList, setProjectList] = useState(initialProjects);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setProjectList((currentProjects) =>
      currentProjects.filter((project) => project.id !== deleteTarget.id),
    );
    setDeleteTarget(null);
  };

  if (isProjectFormOpen) {
    return (
      <ProjectForm
        onDiscard={() => setIsProjectFormOpen(false)}
        onSave={() => setIsProjectFormOpen(false)}
      />
    );
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

      <div className="overflow-hidden rounded-lg border border-[#5f5f5f]">
        <Table>
          <TableHeader className="bg-[#E6E6E61A]">
            <TableRow className="border-[#3a3a3a] hover:bg-transparent">
              <TableHead className="w-[330px] pl-5 text-left text-[14px] text-white">
                Projects
              </TableHead>
              <TableHead className="w-[170px] text-center text-[14px] text-white">
                Client
              </TableHead>
              <TableHead className="w-[190px] text-center text-[14px] text-white">
                Location
              </TableHead>
              <TableHead className="w-[230px] text-center text-[14px] text-white">
                Category
              </TableHead>
              <TableHead className="w-[170px] text-center text-[14px] text-white">
                Completion
              </TableHead>
              <TableHead className="w-[110px] text-center text-[14px] text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projectList.map((project) => (
              <TableRow
                key={project.id}
                className="border-[#5b5b5b] hover:bg-[#181818]"
              >
                <TableCell className="w-[330px] py-2 pl-5 align-middle">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "h-8 w-10 shrink-0 rounded bg-gradient-to-br",
                        project.thumbnailClassName,
                      )}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium leading-5 text-white">
                        {project.name}
                      </p>
                      <p className="truncate text-xs leading-4 text-[#b8b8b8]">
                        {project.summary}
                      </p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="w-[170px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                  {project.client}
                </TableCell>
                <TableCell className="w-[190px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                  {project.location}
                </TableCell>
                <TableCell className="w-[230px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                  {project.category}
                </TableCell>
                <TableCell className="w-[170px] py-4 text-center align-middle text-[14px] text-[#d0d0d0]">
                  {project.completion}
                </TableCell>

                <TableCell className="w-[110px] py-4 text-center align-middle">
                  <div className="flex items-center justify-center gap-4 text-white">
                    <button
                      type="button"
                      className="transition-colors hover:text-[#c9850d]"
                      aria-label={`Edit ${project.name}`}
                    >
                      <PencilLine className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(project)}
                      className="transition-colors hover:text-[#ff4d62]"
                      aria-label={`Delete ${project.name}`}
                    >
                      <Trash2 className="size-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <DeleteConfirmationModal
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleConfirmDelete}
        description={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this project?"
        }
      />
    </main>
  );
}
