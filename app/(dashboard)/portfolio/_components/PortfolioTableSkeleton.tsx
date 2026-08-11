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

export function PortfolioTableSkeleton() {
  return (
    <main className="space-y-5">
      <div className="flex justify-end">
        <SkeletonBlock className="h-10 w-[136px] rounded-full" />
      </div>

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
            {skeletonRows.map((row) => (
              <TableRow
                key={row}
                className="border-[#5b5b5b] hover:bg-transparent"
              >
                <TableCell className="w-[360px] py-3 pl-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-10 w-12 shrink-0" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <SkeletonBlock className="h-5 w-[190px]" />
                      <SkeletonBlock className="h-4 w-[250px]" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="w-[310px] py-4">
                  <SkeletonBlock className="mx-auto h-5 w-[250px]" />
                </TableCell>
                <TableCell className="w-[160px] py-4">
                  <SkeletonBlock className="mx-auto h-5 w-[90px]" />
                </TableCell>
                <TableCell className="w-[170px] py-4">
                  <SkeletonBlock className="mx-auto h-5 w-[110px]" />
                </TableCell>
                <TableCell className="w-[110px] py-4">
                  <div className="flex justify-center gap-4">
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
