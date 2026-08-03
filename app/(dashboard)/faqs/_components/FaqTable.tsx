"use client";

import { useMemo, useState } from "react";
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
import { FaqForm } from "./FaqForm";

type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

const initialFaqs: FaqItem[] = [
  {
    id: 1,
    question: "What construction services do you provide?",
    answer:
      "We offer complete residential and commercial construction services, including site preparation, foundation work, welding & fabrication, structur...",
  },
  {
    id: 2,
    question: "Do you work on both residential and commercial projects?",
    answer:
      "Large-scale commercial and industrial projects delivered with precision and accountability. From permitting through final turnover, A7 manages the en...",
  },
  {
    id: 3,
    question: "Can I request a free project estimate?",
    answer:
      "Expert earthworks and foundation solutions built for North Texas soil conditions - including helical piles for expansive clay where traditional foo...",
  },
  {
    id: 4,
    question: "What is your construction process?",
    answer:
      "Custom structural and agricultural metalwork - from commercial steel fabrication to ranch gates, cattle guards, bridges, and on-site field welding.",
  },
  {
    id: 5,
    question: "Do you provide site preparation and foundation services?",
    answer:
      "Professional fencing installation across residential, commercial, and agricultural properties - from perimeter security to decorative ranch fenci...",
  },
  {
    id: 6,
    question: "How long does a typical project take?",
    answer:
      "Project timelines depend on scope, land conditions, permitting, materials, and weather. We provide a clear schedule before work begins.",
  },
  {
    id: 7,
    question: "Do you handle permits and planning?",
    answer:
      "Our team helps coordinate planning, project requirements, inspections, and permit-related steps based on the work being performed.",
  },
  {
    id: 8,
    question: "Can you work on rural or acreage properties?",
    answer:
      "Yes. We specialize in rural, acreage, ranch, and commercial properties that need practical construction planning and heavy equipment support.",
  },
  {
    id: 9,
    question: "Do you offer welding and fabrication?",
    answer:
      "We provide structural steel fabrication, custom gates, field welding, cattle guards, bridges, and other custom metalwork services.",
  },
  {
    id: 10,
    question: "Can you help with drainage issues?",
    answer:
      "Yes. We plan and install drainage solutions including grading, culverts, swales, erosion control, and water-routing improvements.",
  },
  {
    id: 11,
    question: "Do you build fences and gates?",
    answer:
      "We install ranch fencing, privacy fencing, perimeter fencing, custom entrances, and automatic gate systems for different property types.",
  },
  {
    id: 12,
    question: "How do I start a project?",
    answer:
      "Contact our team with your project goals, location, timeline, and budget. We will review the details and outline the next steps.",
  },
];

const pageSize = 5;

export function FaqTable() {
  const [faqList, setFaqList] = useState(initialFaqs);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<FaqItem | null>(null);
  const [editTarget, setEditTarget] = useState<FaqItem | null>(null);
  const [isFaqFormOpen, setIsFaqFormOpen] = useState(false);

  const paginatedFaqs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return faqList.slice(startIndex, startIndex + pageSize);
  }, [currentPage, faqList]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedFaqs = faqList.filter((faq) => faq.id !== deleteTarget.id);
    const maxPage = Math.max(1, Math.ceil(updatedFaqs.length / pageSize));

    setFaqList(updatedFaqs);
    setCurrentPage((page) => Math.min(page, maxPage));
    setDeleteTarget(null);
  };

  if (isFaqFormOpen) {
    return (
      <FaqForm
        onDiscard={() => setIsFaqFormOpen(false)}
        onSave={() => setIsFaqFormOpen(false)}
      />
    );
  }

  if (editTarget) {
    return (
      <EditFaqForm
        faq={editTarget}
        onDiscard={() => setEditTarget(null)}
        onSave={(updatedFaq) => {
          setFaqList((currentFaqs) =>
            currentFaqs.map((faq) =>
              faq.id === updatedFaq.id ? updatedFaq : faq,
            ),
          );
          setEditTarget(null);
        }}
      />
    );
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
            {paginatedFaqs.map((faq) => (
              <TableRow
                key={faq.id}
                className="border-[#5b5b5b] hover:bg-[#181818]"
              >
                <TableCell className="w-[300px] py-4 text-center align-middle text-[14px] leading-5 text-[#E6E6E6]">
                  <div className="mx-auto max-w-[240px]">{faq.question}</div>
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={faqList.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
      />

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
            ? `Are you sure you want to delete this FAQ?`
            : "Are you sure you want to delete this FAQ?"
        }
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
