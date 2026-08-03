"use client";

import { useMemo, useState } from "react";
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

type Inquiry = {
  id: number;
  name: string;
  phone: string;
  email: string;
  location: string;
  status: "Normal" | "Urgent";
  projectName: string;
  projectBudget: string;
  message: string;
};

const initialInquiries: Inquiry[] = [
  {
    id: 1,
    name: "Marvin McKinney",
    phone: "(207) 555-0119",
    email: "willie.jennings@example.com",
    location: "2972 Westheimer Rd. Santa Ana",
    status: "Normal",
    projectName: "Hill Way project",
    projectBudget: "$4000-$5000",
    message:
      "Hi, I'm looking to purchase a property and would like to know about your current residential projects. Please share available units, floor plans, pricing, and any ongoing offers. Looking forward to your response.",
  },
  {
    id: 2,
    name: "Bessie Cooper",
    phone: "(603) 555-0123",
    email: "curtis.weaver@example.com",
    location: "3891 Ranchview Dr. Richardson",
    status: "Urgent",
    projectName: "Ranchview renovation",
    projectBudget: "$5000-$7000",
    message:
      "I need details about a commercial construction project and would like to understand timeline, budget, and available service options.",
  },
  {
    id: 3,
    name: "Floyd Miles",
    phone: "(505) 555-0125",
    email: "nathan.roberts@example.com",
    location: "2118 Thornridge Cir. Syracuse",
    status: "Urgent",
    projectName: "Thornridge facility",
    projectBudget: "$8000-$10000",
    message:
      "Please send information about site preparation and foundation services for a new construction project.",
  },
  {
    id: 4,
    name: "Darrell Steward",
    phone: "(205) 555-0100",
    email: "kenzi.lawson@example.com",
    location: "6391 Elgin St. Celina, Delaware 10299",
    status: "Normal",
    projectName: "Elgin foundation",
    projectBudget: "$3500-$4500",
    message:
      "I would like to discuss foundation work and scheduling availability for an upcoming project.",
  },
  {
    id: 5,
    name: "Robert Fox",
    phone: "(907) 555-0101",
    email: "nevaeh.simmons@example.com",
    location: "2464 Royal Ln. Mesa, New Jersey 45463",
    status: "Urgent",
    projectName: "Royal lane build",
    projectBudget: "$6000-$9000",
    message:
      "Please contact me with information about residential construction packages and estimated completion timelines.",
  },
  {
    id: 6,
    name: "Jenny Wilson",
    phone: "(225) 555-0118",
    email: "jenny.wilson@example.com",
    location: "1901 Thornridge Cir. Shiloh",
    status: "Normal",
    projectName: "Shiloh project",
    projectBudget: "$3000-$5000",
    message:
      "I want to learn more about your project process and available consultation times.",
  },
  {
    id: 7,
    name: "Cameron Williamson",
    phone: "(319) 555-0115",
    email: "cameron.w@example.com",
    location: "4517 Washington Ave. Manchester",
    status: "Urgent",
    projectName: "Washington commercial",
    projectBudget: "$9000-$12000",
    message:
      "We are planning a commercial development and need service details, budget guidance, and scheduling information.",
  },
  {
    id: 8,
    name: "Courtney Henry",
    phone: "(316) 555-0116",
    email: "courtney.henry@example.com",
    location: "4140 Parker Rd. Allentown",
    status: "Normal",
    projectName: "Parker remodel",
    projectBudget: "$2500-$4000",
    message:
      "I am interested in renovation services and would like to receive a quote.",
  },
  {
    id: 9,
    name: "Annette Black",
    phone: "(229) 555-0109",
    email: "annette.black@example.com",
    location: "2715 Ash Dr. San Jose",
    status: "Urgent",
    projectName: "Ash steel project",
    projectBudget: "$7000-$9500",
    message:
      "Please share details about welding and fabrication options for a custom project.",
  },
  {
    id: 10,
    name: "Jerome Bell",
    phone: "(406) 555-0120",
    email: "jerome.bell@example.com",
    location: "8502 Preston Rd. Inglewood",
    status: "Normal",
    projectName: "Preston build",
    projectBudget: "$4500-$6500",
    message:
      "I would like to know more about custom residential home construction services.",
  },
  {
    id: 11,
    name: "Savannah Nguyen",
    phone: "(480) 555-0103",
    email: "savannah.n@example.com",
    location: "3517 W. Gray St. Utica",
    status: "Urgent",
    projectName: "Gray drainage",
    projectBudget: "$2000-$3500",
    message:
      "We need help with drainage improvements and would like a service estimate.",
  },
  {
    id: 12,
    name: "Leslie Alexander",
    phone: "(702) 555-0122",
    email: "leslie.alexander@example.com",
    location: "6391 Elgin St. Delaware",
    status: "Normal",
    projectName: "Elgin gates",
    projectBudget: "$1500-$3000",
    message:
      "Please provide information about fencing and gate installation options.",
  },
];

const pageSize = 5;

export function InquiriesTable() {
  const [inquiryList, setInquiryList] = useState(initialInquiries);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Inquiry | null>(null);
  const [detailsTarget, setDetailsTarget] = useState<Inquiry | null>(null);

  const paginatedInquiries = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return inquiryList.slice(startIndex, startIndex + pageSize);
  }, [currentPage, inquiryList]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedInquiries = inquiryList.filter(
      (inquiry) => inquiry.id !== deleteTarget.id,
    );
    const maxPage = Math.max(1, Math.ceil(updatedInquiries.length / pageSize));

    setInquiryList(updatedInquiries);
    setCurrentPage((page) => Math.min(page, maxPage));
    setDeleteTarget(null);
  };

  return (
    <main className="space-y-4">
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
            {paginatedInquiries.map((inquiry) => (
              <TableRow
                key={inquiry.id}
                className="border-[#5b5b5b] hover:bg-[#181818]"
              >
                <TableCell className="w-[210px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                  {inquiry.name}
                </TableCell>
                <TableCell className="w-[190px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                  {inquiry.phone}
                </TableCell>
                <TableCell className="w-[260px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                  {inquiry.email}
                </TableCell>
                <TableCell className="w-[300px] py-6 text-center align-middle text-[14px] leading-5 text-[#E6E6E6]">
                  <div className="mx-auto max-w-[260px]">{inquiry.location}</div>
                </TableCell>
                <TableCell className="w-[150px] py-6 text-center align-middle text-[14px] text-[#E6E6E6]">
                  {inquiry.status}
                </TableCell>
                <TableCell className="w-[140px] py-6 text-center align-middle">
                  <div className="flex items-center justify-center gap-3 text-white">
                    <button
                      type="button"
                      onClick={() => setDetailsTarget(inquiry)}
                      className="transition-colors hover:text-[#c9850d]"
                      aria-label={`View ${inquiry.name}`}
                    >
                      <Eye className="size-5" />
                    </button>
                    <button
                      type="button"
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
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={inquiryList.length}
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
            ? `Are you sure you want to delete ${deleteTarget.name}?`
            : "Are you sure you want to delete this inquiry?"
        }
      />
      <InquiryDetailsModal
        inquiry={detailsTarget}
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
