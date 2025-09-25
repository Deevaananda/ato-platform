"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PendingApprovals } from "./pending-approvals"
import { ApprovalHistory } from "./approval-history"
import { WorkflowSettings } from "./workflow-settings"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle, Settings } from "lucide-react"

export function ApprovalWorkflow() {
  const [pendingCount] = useState(5)
  const [approvedCount] = useState(23)
  const [rejectedCount] = useState(2)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Approved This Month</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground">Rejected/Revised</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Needs revision</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="pending" className="data-[state=active]:bg-background">
            Pending Approvals
            {pendingCount > 0 && (
              <Badge className="ml-2 bg-primary text-primary-foreground" variant="secondary">
                {pendingCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-background">
            Approval History
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-background">
            Workflow Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <PendingApprovals />
        </TabsContent>

        <TabsContent value="history">
          <ApprovalHistory />
        </TabsContent>

        <TabsContent value="settings">
          <WorkflowSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
