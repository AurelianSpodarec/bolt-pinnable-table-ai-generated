import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns"
import { generateData } from "@/lib/data"

export default function Page() {
  // Generate sample data
  const data = generateData(100)

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}

