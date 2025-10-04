export type Task = {
  id: string
  title: string
  status: "todo" | "in-progress" | "done" | "canceled"
  priority: "low" | "medium" | "high"
  createdAt: string
  dueDate: string | null
  assignee: string
  tags: string[]
  description: string
}

