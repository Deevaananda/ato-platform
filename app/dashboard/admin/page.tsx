import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ApprovalWorkflow } from "@/components/workflow/approval-workflow"

export default function AdminPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administrative Dashboard</h1>
          <p className="text-muted-foreground">Review and approve timetables, manage workflow processes</p>
        </div>

        <ApprovalWorkflow />
      </div>
    </DashboardLayout>
  )
}
