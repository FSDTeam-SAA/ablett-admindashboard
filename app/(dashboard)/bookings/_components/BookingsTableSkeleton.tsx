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

export function BookingsTableSkeleton() {
  return (
    <main className="space-y-4">
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
              {skeletonRows.map((row) => (
                <TableRow
                  key={row}
                  className="border-[#5b5b5b] hover:bg-transparent"
                >
                  <TableCell className="w-[170px] py-5">
                    <SkeletonBlock className="mx-auto h-5 w-[120px]" />
                  </TableCell>
                  <TableCell className="w-[210px] py-5">
                    <SkeletonBlock className="mx-auto h-5 w-[160px]" />
                  </TableCell>
                  <TableCell className="w-[180px] py-5">
                    <SkeletonBlock className="mx-auto h-5 w-[130px]" />
                  </TableCell>
                  <TableCell className="w-[220px] py-5">
                    <SkeletonBlock className="mx-auto h-5 w-[170px]" />
                  </TableCell>
                  <TableCell className="w-[160px] py-5">
                    <div className="space-y-2">
                      <SkeletonBlock className="mx-auto h-4 w-[95px]" />
                      <SkeletonBlock className="mx-auto h-4 w-[110px]" />
                    </div>
                  </TableCell>
                  <TableCell className="w-[140px] py-5">
                    <SkeletonBlock className="mx-auto h-7 w-[86px] rounded-full" />
                  </TableCell>
                  <TableCell className="w-[120px] py-5">
                    <div className="flex justify-center gap-4">
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
