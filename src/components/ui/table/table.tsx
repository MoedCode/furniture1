"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./pagination";
import { DataTableViewOptions } from "./column-toggle";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalPages: number;
  onDelete?: (id: string) => void; // Optional delete callback
  onRefresh?: () => void; // Optional refresh callback
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalPages,
  onDelete,
  onRefresh,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [{ pageIndex, pageSize }, setPagination] = useState(() => {
    const page = Number.parseInt(searchParams.get("page") || "1", 10);
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10);
    return {
      pageIndex: page - 1,
      pageSize: limit,
    };
  });

  const deleteColumn: ColumnDef<TData, any> = {
    id: "actions",
    header: "delete",
    cell: ({ row }) => (
      <Button
        variant="destructive"
        onClick={() => {
          if (onDelete) {
            // @ts-expect-error ignore type error FIXME later
            onDelete(row.original._id);
          }
        }}
      >
        Delete
      </Button>
    ),
  };

  const columnsWithDelete = onDelete ? [...columns, deleteColumn] : columns;

  const table = useReactTable({
    data,
    columns: columnsWithDelete,
    manualPagination: true,
    pageCount: totalPages,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", `${pageIndex + 1}`);
    params.set("limit", `${pageSize}`);
    router.replace(`${pathname}?${params.toString()}`);
  }, [pageIndex, pageSize, pathname, router, searchParams]);

  return (
    <div className="flex h-full flex-col justify-between gap-2">
      <div className="inline-flex items-center gap-4">
        <DataTableViewOptions table={table} />
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            className="h-8 flex gap-2"
          >
            <RefreshCcw />
            Refresh
          </Button>
        )}
      </div>
      <div className="h-full">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
