"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnPinningState,
  type ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Pin, PinOff } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
    left: ["id", "title"],
    right: [],
  })

  const [columnResizeMode] = React.useState<ColumnResizeMode>("onChange")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      columnPinning,
    },
    onColumnPinningChange: setColumnPinning,
    columnResizeMode,
    enableColumnResizing: true,
    defaultColumn: {
      minSize: 50,
      maxSize: 500,
    },
  })

  const getPinnedLeftOffset = (columnId: string) => {
    let offset = 0
    for (const column of table.getLeftLeafColumns()) {
      if (column.id === columnId) break
      offset += column.getSize()
    }
    return offset
  }

  return (
    <div className="rounded-md border">
      <div className="flex items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Pinnable and Resizable Columns</h2>
        <div className="ml-auto flex items-center gap-2 flex-wrap">
          {table.getAllLeafColumns().map((column) => (
            <Button
              key={column.id}
              variant={column.getIsPinned() ? "default" : "outline"}
              size="sm"
              onClick={() => {
                column.getIsPinned() ? column.pin(false) : column.pin("left")
              }}
              className="flex items-center gap-1"
            >
              {column.getIsPinned() ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
              {column.id}
            </Button>
          ))}
        </div>
      </div>

      <div className="relative overflow-auto" style={{ maxHeight: "calc(100vh - 300px)" }}>
        <table className="w-full border-collapse" style={{ width: table.getTotalSize() }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isPinned = header.column.getIsPinned() === "left"
                  return (
                    <th
                      key={header.id}
                      className="relative border border-gray-300 bg-gray-100 p-2 text-left align-middle font-medium text-muted-foreground"
                      style={{
                        position: isPinned ? "sticky" : "static",
                        left: isPinned ? `${getPinnedLeftOffset(header.column.id)}px` : "auto",
                        zIndex: isPinned ? 20 : 10,
                        width: header.getSize(),
                        boxShadow: isPinned ? "4px 0 4px -2px rgba(0, 0, 0, 0.15)" : "none",
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${header.column.getIsResizing() ? "isResizing" : ""}`}
                      />
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={row.getIsSelected() ? "bg-muted/50" : ""}>
                  {row.getVisibleCells().map((cell) => {
                    const isPinned = cell.column.getIsPinned() === "left"
                    return (
                      <td
                        key={cell.id}
                        className="border border-gray-300 p-2 align-middle"
                        style={{
                          position: isPinned ? "sticky" : "static",
                          left: isPinned ? `${getPinnedLeftOffset(cell.column.id)}px` : "auto",
                          zIndex: isPinned ? 20 : 10,
                          backgroundColor: "var(--background)",
                          width: cell.column.getSize(),
                          boxShadow: isPinned ? "4px 0 4px -2px rgba(0, 0, 0, 0.15)" : "none",
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="h-24 text-center border border-gray-300">
                  No results.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-end space-x-2 p-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}

