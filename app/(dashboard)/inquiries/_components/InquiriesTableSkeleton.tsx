"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const skeletonRows = Array.from({ length: 5 }, (_, index) => index);

function SkeletonBlock({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded bg-[#2f2f2f] ${className}`}
      aria-hidden="true"
    />
  );
}

export function InquiriesTableSkeleton() {
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
            {skeletonRows.map((row) => (
              <TableRow
                key={row}
                className="border-[#5b5b5b] hover:bg-transparent"
              >
                <TableCell className="w-[210px] py-6">
                  <SkeletonBlock className="mx-auto h-5 w-[150px]" />
                </TableCell>
                <TableCell className="w-[190px] py-6">
                  <SkeletonBlock className="mx-auto h-5 w-[130px]" />
                </TableCell>
                <TableCell className="w-[260px] py-6">
                  <SkeletonBlock className="mx-auto h-5 w-[200px]" />
                </TableCell>
                <TableCell className="w-[300px] py-6">
                  <SkeletonBlock className="mx-auto h-5 w-[230px]" />
                </TableCell>
                <TableCell className="w-[150px] py-6">
                  <SkeletonBlock className="mx-auto h-5 w-[80px]" />
                </TableCell>
                <TableCell className="w-[140px] py-6">
                  <div className="flex justify-center gap-3">
                    <SkeletonBlock className="size-5 rounded-full" />
                    <SkeletonBlock className="size-5 rounded-full" />
                    <SkeletonBlock className="size-5 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <SkeletonBlock className="h-5 w-[180px]" />
        <div className="flex gap-2">
          <SkeletonBlock className="size-8" />
          <SkeletonBlock className="size-8" />
          <SkeletonBlock className="size-8" />
        </div>
      </div>
    </main>
  );
}
