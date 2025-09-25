import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SubjectManager } from "@/components/resources/subject-manager"

export default function SubjectsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject Management</h1>
          <p className="text-muted-foreground">Manage subjects, batches, and curriculum requirements</p>
        </div>
        <SubjectManager />
      </div>
    </DashboardLayout>
  )
}
