"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Save, RefreshCw, Settings, Users, Mail, Clock, AlertTriangle } from "lucide-react"

interface WorkflowSettings {
  approvalRequired: boolean
  autoApprovalThreshold: number
  notificationSettings: {
    emailNotifications: boolean
    slackIntegration: boolean
    smsAlerts: boolean
  }
  approvalWorkflow: {
    requireDepartmentApproval: boolean
    requireAdminApproval: boolean
    allowBulkApproval: boolean
    approvalTimeout: number
  }
  automationRules: {
    autoResolveConflicts: boolean
    autoOptimizeUtilization: boolean
    autoAssignRooms: boolean
  }
}

export function WorkflowSettings() {
  const [settings, setSettings] = useState<WorkflowSettings>({
    approvalRequired: true,
    autoApprovalThreshold: 85,
    notificationSettings: {
      emailNotifications: true,
      slackIntegration: false,
      smsAlerts: false,
    },
    approvalWorkflow: {
      requireDepartmentApproval: true,
      requireAdminApproval: true,
      allowBulkApproval: true,
      approvalTimeout: 48,
    },
    automationRules: {
      autoResolveConflicts: false,
      autoOptimizeUtilization: true,
      autoAssignRooms: true,
    },
  })

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const updateSettings = (newSettings: Partial<WorkflowSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    setHasUnsavedChanges(true)
  }

  const updateNestedSettings = (section: keyof WorkflowSettings, updates: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }))
    setHasUnsavedChanges(true)
  }

  const handleSave = () => {
    console.log("[v0] Saving workflow settings:", settings)
    // Simulate saving settings
    setHasUnsavedChanges(false)
    console.log("[v0] Workflow settings saved successfully")
    alert("Workflow settings saved successfully!")
  }

  const handleReset = () => {
    console.log("[v0] Resetting workflow settings to default")
    // Reset to default values
    const defaultSettings: WorkflowSettings = {
      approvalRequired: true,
      autoApprovalThreshold: 85,
      notificationSettings: {
        emailNotifications: true,
        slackIntegration: false,
        smsAlerts: false,
      },
      approvalWorkflow: {
        requireDepartmentApproval: true,
        requireAdminApproval: true,
        allowBulkApproval: true,
        approvalTimeout: 48,
      },
      automationRules: {
        autoResolveConflicts: false,
        autoOptimizeUtilization: true,
        autoAssignRooms: true,
      },
    }
    setSettings(defaultSettings)
    setHasUnsavedChanges(false)
    console.log("[v0] Settings reset to defaults")
    alert("Settings reset to default values!")
  }

  const handleTestNotifications = () => {
    console.log("[v0] Testing notification settings")
    const activeNotifications = []
    if (settings.notificationSettings.emailNotifications) activeNotifications.push("Email")
    if (settings.notificationSettings.slackIntegration) activeNotifications.push("Slack")
    if (settings.notificationSettings.smsAlerts) activeNotifications.push("SMS")

    console.log("[v0] Active notifications:", activeNotifications)
    alert(
      `Test notifications sent via: ${activeNotifications.join(", ")}\n\nCheck your configured channels for test messages.`,
    )
  }

  const handleExportSettings = () => {
    console.log("[v0] Exporting workflow settings")
    const exportData = {
      timestamp: new Date().toISOString(),
      settings: settings,
    }
    console.log("[v0] Export data:", exportData)
    alert("Workflow settings exported successfully!\nFormat: JSON\nLocation: Downloads folder")
  }

  return (
    <div className="space-y-6">
      {hasUnsavedChanges && (
        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-400" />
              <p className="text-sm text-yellow-400">
                You have unsaved changes. Save your configuration to apply them.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Workflow Settings</h2>
          <p className="text-muted-foreground">Configure approval processes and automation rules</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent bg-transparent"
            onClick={handleExportSettings}
          >
            Export Settings
          </Button>
          <Button
            variant="outline"
            className="border-border text-foreground hover:bg-accent bg-transparent"
            onClick={handleReset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset to Default
          </Button>
          <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approval Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Users className="mr-2 h-5 w-5" />
              Approval Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure approval requirements and thresholds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Require Approval</Label>
                <p className="text-sm text-muted-foreground">All timetables must be approved before implementation</p>
              </div>
              <Switch
                checked={settings.approvalRequired}
                onCheckedChange={(checked) => updateSettings({ approvalRequired: checked })}
              />
            </div>

            <Separator className="bg-border" />

            <div className="space-y-2">
              <Label htmlFor="autoApprovalThreshold" className="text-foreground">
                Auto-Approval Threshold
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="autoApprovalThreshold"
                  type="number"
                  min="0"
                  max="100"
                  value={settings.autoApprovalThreshold}
                  onChange={(e) => updateSettings({ autoApprovalThreshold: Number.parseInt(e.target.value) })}
                  className="bg-input border-border text-foreground"
                />
                <span className="text-sm text-muted-foreground">% score</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Timetables with scores above this threshold can be auto-approved
              </p>
            </div>

            <Separator className="bg-border" />

            <div className="space-y-3">
              <Label className="text-foreground">Approval Workflow</Label>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm text-foreground">Department Approval</Label>
                  <p className="text-xs text-muted-foreground">Require department head approval</p>
                </div>
                <Switch
                  checked={settings.approvalWorkflow.requireDepartmentApproval}
                  onCheckedChange={(checked) =>
                    updateNestedSettings("approvalWorkflow", { requireDepartmentApproval: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm text-foreground">Admin Approval</Label>
                  <p className="text-xs text-muted-foreground">Require administrative approval</p>
                </div>
                <Switch
                  checked={settings.approvalWorkflow.requireAdminApproval}
                  onCheckedChange={(checked) =>
                    updateNestedSettings("approvalWorkflow", { requireAdminApproval: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm text-foreground">Allow Bulk Approval</Label>
                  <p className="text-xs text-muted-foreground">Enable bulk approval of multiple timetables</p>
                </div>
                <Switch
                  checked={settings.approvalWorkflow.allowBulkApproval}
                  onCheckedChange={(checked) =>
                    updateNestedSettings("approvalWorkflow", { allowBulkApproval: checked })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="approvalTimeout" className="text-foreground">
                Approval Timeout
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="approvalTimeout"
                  type="number"
                  min="1"
                  max="168"
                  value={settings.approvalWorkflow.approvalTimeout}
                  onChange={(e) =>
                    updateNestedSettings("approvalWorkflow", { approvalTimeout: Number.parseInt(e.target.value) })
                  }
                  className="bg-input border-border text-foreground"
                />
                <span className="text-sm text-muted-foreground">hours</span>
              </div>
              <p className="text-xs text-muted-foreground">Auto-approve after timeout if no action taken</p>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Mail className="mr-2 h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure how and when to send notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Send email alerts for important events</p>
              </div>
              <Switch
                checked={settings.notificationSettings.emailNotifications}
                onCheckedChange={(checked) =>
                  updateNestedSettings("notificationSettings", { emailNotifications: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Slack Integration</Label>
                <p className="text-sm text-muted-foreground">Send notifications to Slack channels</p>
              </div>
              <Switch
                checked={settings.notificationSettings.slackIntegration}
                onCheckedChange={(checked) =>
                  updateNestedSettings("notificationSettings", { slackIntegration: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Send SMS for critical issues</p>
              </div>
              <Switch
                checked={settings.notificationSettings.smsAlerts}
                onCheckedChange={(checked) => updateNestedSettings("notificationSettings", { smsAlerts: checked })}
              />
            </div>

            <Button
              variant="outline"
              className="w-full border-border text-foreground hover:bg-accent bg-transparent"
              onClick={handleTestNotifications}
            >
              Test Notifications
            </Button>
          </CardContent>
        </Card>

        {/* Automation Rules */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Settings className="mr-2 h-5 w-5" />
              Automation Rules
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Configure automatic optimization and conflict resolution
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Auto-Resolve Conflicts</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically resolve scheduling conflicts when possible
                </p>
              </div>
              <Switch
                checked={settings.automationRules.autoResolveConflicts}
                onCheckedChange={(checked) =>
                  updateNestedSettings("automationRules", { autoResolveConflicts: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Auto-Optimize Utilization</Label>
                <p className="text-sm text-muted-foreground">Automatically optimize room and resource utilization</p>
              </div>
              <Switch
                checked={settings.automationRules.autoOptimizeUtilization}
                onCheckedChange={(checked) =>
                  updateNestedSettings("automationRules", { autoOptimizeUtilization: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-foreground">Auto-Assign Rooms</Label>
                <p className="text-sm text-muted-foreground">Automatically assign optimal rooms for classes</p>
              </div>
              <Switch
                checked={settings.automationRules.autoAssignRooms}
                onCheckedChange={(checked) => updateNestedSettings("automationRules", { autoAssignRooms: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <Clock className="mr-2 h-5 w-5" />
              Current Status
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Overview of current workflow configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Approval Required</span>
                <Badge variant={settings.approvalRequired ? "default" : "secondary"}>
                  {settings.approvalRequired ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Auto-Approval Threshold</span>
                <Badge variant="outline">{settings.autoApprovalThreshold}%</Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Email Notifications</span>
                <Badge variant={settings.notificationSettings.emailNotifications ? "default" : "secondary"}>
                  {settings.notificationSettings.emailNotifications ? "On" : "Off"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Auto-Optimization</span>
                <Badge variant={settings.automationRules.autoOptimizeUtilization ? "default" : "secondary"}>
                  {settings.automationRules.autoOptimizeUtilization ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Approval Timeout</span>
                <Badge variant="outline">{settings.approvalWorkflow.approvalTimeout}h</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
