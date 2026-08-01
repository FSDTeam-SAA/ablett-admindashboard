"use client";

import { useMemo, useState } from "react";
import { Eye, Plus, Trash2 } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { ServiceForm } from "./ServiceForm";

type Service = {
  id: number;
  name: string;
  coreFeatures: string;
  description: string;
  status: "Active" | "Inactive";
  thumbnailClassName: string;
};

const initialServices: Service[] = [
  {
    id: 1,
    name: "Residential Construction",
    coreFeatures:
      "Custom Home Builds on Acreage, New construction on rural lots, Full Foundatio...",
    description:
      "Custom homes from raw land to final handover - built to your vision with full in-house crew and equipment. We specialize in rural and acreage build...",
    status: "Active",
    thumbnailClassName: "from-[#b88a45] via-[#66513a] to-[#273d23]",
  },
  {
    id: 2,
    name: "Commercial Construction",
    coreFeatures:
      "Office & Retail Facilities, Warehousing & Logistics, Agricultural & Industrial Build...",
    description:
      "Large-scale commercial and industrial projects delivered with precision and accountability. From permitting through final turnover, A7 manages the en...",
    status: "Active",
    thumbnailClassName: "from-[#b7c9d3] via-[#6f5a42] to-[#2d2d2d]",
  },
  {
    id: 3,
    name: "Site Preparation & Foundations",
    coreFeatures:
      "Land Clearing & Grubbing, Bulk Excavation & Grading, Helical Pile Found...",
    description:
      "Expert earthworks and foundation solutions built for North Texas soil conditions - including helical piles for expansive clay where traditional foo...",
    status: "Active",
    thumbnailClassName: "from-[#8a5d42] via-[#5b6c5e] to-[#1d1d1d]",
  },
  {
    id: 4,
    name: "Welding & Fabrication",
    coreFeatures:
      "Structural Steel Fabrication, Custom Gates & Entryways, Bridge & Culvert Fa...",
    description:
      "Custom structural and agricultural metalwork - from commercial steel fabrication to ranch gates, cattle guards, bridges, and on-site field welding.",
    status: "Active",
    thumbnailClassName: "from-[#f0a94b] via-[#2c2c2c] to-[#0f0f0f]",
  },
  {
    id: 5,
    name: "Equipment & Fleet",
    coreFeatures:
      "Ranch & Livestock Fencing, Privacy & Perimeter Fencing, Commercial Securit...",
    description:
      "Professional fencing installation across residential, commercial, and agricultural properties - from perimeter security to decorative ranch fenci...",
    status: "Active",
    thumbnailClassName: "from-[#c7834b] via-[#7d6f61] to-[#202020]",
  },
  {
    id: 6,
    name: "Ranch Improvements",
    coreFeatures:
      "Roadwork, drainage, pasture access, livestock-ready upgrades, and gate systems...",
    description:
      "Practical ranch upgrades planned around daily access, equipment movement, drainage, safety, and long-term durability.",
    status: "Active",
    thumbnailClassName: "from-[#4d6b39] via-[#876333] to-[#151515]",
  },
  {
    id: 7,
    name: "Concrete Flatwork",
    coreFeatures:
      "Driveways, pads, walkways, shop floors, drainage slopes, and finish options...",
    description:
      "Reliable concrete work for homes, shops, barns, and outdoor work areas with clean prep and durable finishing.",
    status: "Active",
    thumbnailClassName: "from-[#bbbbbb] via-[#6e6e6e] to-[#242424]",
  },
  {
    id: 8,
    name: "Land Development",
    coreFeatures:
      "Utility planning, grading, pad preparation, access roads, and early-stage site work...",
    description:
      "From empty acreage to build-ready land, our team handles the heavy preparation steps needed before construction starts.",
    status: "Active",
    thumbnailClassName: "from-[#385d32] via-[#8e743b] to-[#1f1f1f]",
  },
  {
    id: 9,
    name: "Barns & Metal Buildings",
    coreFeatures:
      "Workshops, storage barns, equipment covers, metal frames, and slab coordination...",
    description:
      "Durable utility buildings for rural properties, agriculture operations, and commercial storage needs.",
    status: "Active",
    thumbnailClassName: "from-[#9b9b9b] via-[#5b4a3c] to-[#171717]",
  },
  {
    id: 10,
    name: "Drainage Solutions",
    coreFeatures:
      "Culverts, swales, grading, erosion control, driveway drainage, and water routing...",
    description:
      "Drainage planning and installation designed to move water away from structures, roads, and high-traffic areas.",
    status: "Active",
    thumbnailClassName: "from-[#446070] via-[#505d47] to-[#111111]",
  },
  {
    id: 11,
    name: "Fencing & Gates",
    coreFeatures:
      "Pipe fence, privacy fence, livestock fence, automatic gates, and custom entrances...",
    description:
      "Clean, strong fencing and gate systems that fit the property, use case, and surrounding construction.",
    status: "Active",
    thumbnailClassName: "from-[#8a6b46] via-[#343434] to-[#101010]",
  },
  {
    id: 12,
    name: "Demolition",
    coreFeatures:
      "Selective demo, site cleanup, hauling, slab removal, and structure teardown...",
    description:
      "Controlled demolition and cleanup services to clear the way for new construction or property improvements.",
    status: "Active",
    thumbnailClassName: "from-[#6d5545] via-[#2f2f2f] to-[#090909]",
  },
];

const pageSize = 5;

export function ServicesTable() {
  const [serviceList, setServiceList] = useState(initialServices);
  const [currentPage, setCurrentPage] = useState(1);
  const [isServiceFormOpen, setIsServiceFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);

  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return serviceList.slice(startIndex, startIndex + pageSize);
  }, [currentPage, serviceList]);

  const handleConfirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    const updatedServices = serviceList.filter(
      (service) => service.id !== deleteTarget.id,
    );
    const maxPage = Math.max(1, Math.ceil(updatedServices.length / pageSize));

    setServiceList(updatedServices);
    setCurrentPage((page) => Math.min(page, maxPage));
    setDeleteTarget(null);
  };

  if (isServiceFormOpen) {
    return (
      <ServiceForm
        onDiscard={() => setIsServiceFormOpen(false)}
        onSave={() => setIsServiceFormOpen(false)}
      />
    );
  }

  return (
    <main className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => setIsServiceFormOpen(true)}
          className="h-10 rounded-full bg-[#c98313] px-5 text-sm font-medium text-white hover:bg-[#b6750f]"
        >
          <Plus className="size-4" />
          New Service
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#5f5f5f] ">
        <Table>
          <TableHeader className="bg-[#E6E6E61A]">
            <TableRow className="border-[#3a3a3a] hover:bg-transparent">
              <TableHead className="w-[255px] text-center text-[14px] text-white">
                Service
              </TableHead>
              <TableHead className="w-[245px] text-center text-[14px] text-white">
                Core Features
              </TableHead>
              <TableHead className="w-[418px] text-center text-[14px] text-white">
                Description
              </TableHead>
              <TableHead className="w-[150px] text-center text-[14px] text-white">
                Status
              </TableHead>
              <TableHead className="w-[120px] text-center text-[14px] text-white">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedServices.map((service) => (
              <TableRow
                key={service.id}
                className="border-[#5b5b5b] hover:bg-[#181818]"
              >
                <TableCell className="w-[255px] py-2 pl-5 ">
                  <div className="flex items-center justify-start gap-3">
                    <div
                      className={cn(
                        "size-10 shrink-0 rounded bg-gradient-to-br",
                        service.thumbnailClassName,
                      )}
                    />
                    <span className="min-w-0 w-full text-left text-lg font-medium leading-6 text-white">
                      {service.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="w-[245px] py-2 text-center align-middle text-[14px] leading-4 text-[#E6E6E6]">
                  <div className="mx-auto w-[245px]">
                    {service.coreFeatures}
                  </div>
                </TableCell>

                <TableCell className="w-[418px] py-2 text-center align-middle text-[14px] leading-4 text-[#E6E6E6]">
                  <div className="mx-auto w-[418px]">
                    {service.description}
                  </div>
                </TableCell>

                <TableCell className="w-[150px] py-2 text-center align-middle">
                  <span className="inline-flex h-8 min-w-[92px] items-center justify-center rounded-full border border-[#b87500] px-5 text-sm font-semibold text-[#c9850d]">
                    {service.status}
                  </span>
                </TableCell>

                <TableCell className="w-[120px] py-2 text-center align-middle">
                  <div className="flex items-center justify-center gap-3 text-white">
                    <button
                      type="button"
                      className="transition-colors hover:text-[#c9850d]"
                      aria-label={`View ${service.name}`}
                    >
                      <Eye className="size-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(service)}
                      className="transition-colors hover:text-[#ff4d62]"
                      aria-label={`Delete ${service.name}`}
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
        totalItems={serviceList.length}
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
            : "Are you sure you want to delete this service?"
        }
      />
    </main>
  );
}
