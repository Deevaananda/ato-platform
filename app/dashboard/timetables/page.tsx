import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { TimetableManager } from "@/components/timetables/timetable-manager"

export default function TimetablesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Timetable Management</h1>
          <p className="text-muted-foreground">Generate, optimize, and manage academic timetables</p>
        </div>

        <TimetableManager />
      </div>
    </DashboardLayout>
  )
}
