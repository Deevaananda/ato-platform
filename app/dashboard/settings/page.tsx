import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ConstraintConfiguration } from "@/components/constraints/constraint-configuration"

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Constraint Configuration</h1>
          <p className="text-muted-foreground">Configure scheduling constraints and optimization parameters</p>
        </div>

        <ConstraintConfiguration />
      </div>
    </DashboardLayout>
  )
}
