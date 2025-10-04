"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Task } from "@/types/task"

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: "id",
    header: "ID",
    size: 80, // Set initial width to 80px
  },
  {
    accessorKey: "title",
    header: "Title",
    size: 200, // Set initial width to 200px
  },
  {
    accessorKey: "status",
    header: "Status",
    size: 120, // Set initial width to 120px
  },
  {
    accessorKey: "priority",
    header: "Priority",
    size: 100,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 150,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return <div>{date.toLocaleDateString()}</div>
    },
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    size: 150,
    cell: ({ row }) => {
      const date = row.getValue("dueDate")
      return date ? <div>{new Date(date as string).toLocaleDateString()}</div> : <div>-</div>
    },
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    size: 150,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    size: 200,
    cell: ({ row }) => {
      const tags = row.getValue("tags") as string[]
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <span key={tag} className="rounded bg-primary/10 px-2 py-0.5 text-xs text-primary">
              {tag}
            </span>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 300,
  },
]

