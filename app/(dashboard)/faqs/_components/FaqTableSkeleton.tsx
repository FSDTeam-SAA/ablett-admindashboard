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

export function FaqTableSkeleton() {
  return (
    <main className="space-y-4">
      <div className="flex justify-end">
        <SkeletonBlock className="h-10 w-[112px] rounded-full" />
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
            {skeletonRows.map((row) => (
              <TableRow
                key={row}
                className="border-[#5b5b5b] hover:bg-transparent"
              >
                <TableCell className="w-[300px] py-4">
                  <SkeletonBlock className="mx-auto h-5 w-[220px]" />
                </TableCell>
                <TableCell className="py-4">
                  <div className="mx-auto max-w-[520px] space-y-2">
                    <SkeletonBlock className="h-4 w-full" />
                    <SkeletonBlock className="h-4 w-4/5" />
                  </div>
                </TableCell>
                <TableCell className="w-[140px] py-4">
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
