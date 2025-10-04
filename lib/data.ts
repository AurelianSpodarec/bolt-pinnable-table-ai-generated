import type { Task } from "@/components/columns"

// Generate random data for the table
export function generateData(count: number): Task[] {
  const statuses = ["todo", "in-progress", "done", "canceled"]
  const priorities = ["low", "medium", "high"]
  const assignees = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Charlie Brown"]
  const tagOptions = ["bug", "feature", "enhancement", "documentation", "design", "testing", "backend", "frontend"]

  return Array.from({ length: count }).map((_, i) => {
    const id = `TASK-${(i + 1).toString().padStart(4, "0")}`
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()

    // 30% chance of having no due date
    const dueDate =
      Math.random() > 0.3
        ? new Date(Date.now() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000).toISOString()
        : null

    // Generate 1-3 random tags
    const tagCount = Math.floor(Math.random() * 3) + 1
    const tags = Array.from({ length: tagCount }).map(() => tagOptions[Math.floor(Math.random() * tagOptions.length)])

    return {
      id,
      title: `Task ${i + 1} - ${Math.random().toString(36).substring(2, 8)}`,
      status: statuses[Math.floor(Math.random() * statuses.length)] as Task["status"],
      priority: priorities[Math.floor(Math.random() * priorities.length)] as Task["priority"],
      createdAt,
      dueDate,
      assignee: assignees[Math.floor(Math.random() * assignees.length)],
      tags: [...new Set(tags)], // Remove duplicates
      description: `This is a description for task ${i + 1}. It contains some details about what needs to be done.`,
    }
  })
}

