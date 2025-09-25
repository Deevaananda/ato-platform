import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { FacultyManager } from "@/components/resources/faculty-manager"

export default function FacultyPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Management</h1>
          <p className="text-muted-foreground">Manage faculty members, workloads, and preferences</p>
        </div>
        <FacultyManager />
      </div>
    </DashboardLayout>
  )
}
