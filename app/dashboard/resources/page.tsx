import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ResourceTabs } from "@/components/resources/resource-tabs"

export default function ResourcesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resource Management</h1>
          <p className="text-muted-foreground">Manage classrooms, laboratories, and faculty resources</p>
        </div>

        <ResourceTabs />
      </div>
    </DashboardLayout>
  )
}
