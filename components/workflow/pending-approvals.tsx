"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, CheckCircle, XCircle, MessageSquare, Calendar, User, Building } from "lucide-react"

interface PendingApproval {
  id: string
  timetableName: string
  department: string
  semester: string
  submittedBy: string
  submittedDate: string
  priority: "high" | "medium" | "low"
  status: "pending" | "under-review"
  score: number
  conflicts: number
  utilization: number
}

export function PendingApprovals() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedApproval, setSelectedApproval] = useState<PendingApproval | null>(null)
  const [reviewComments, setReviewComments] = useState("")
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)

  useEffect(() => {
    const fetchPendingApprovals = async () => {
      console.log("[v0] Fetching pending approvals from API...")
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, this would be an API call
      // const response = await fetch('/api/approvals/pending')
      // const data = await response.json()
      // setApprovals(data)

      console.log("[v0] No pending approvals found - starting with empty state")
      setApprovals([])
      setIsLoading(false)
    }

    fetchPendingApprovals()
  }, [])

  const handleApprove = (id: string) => {
    console.log("[v0] Approving timetable:", id)
    const approval = approvals.find((a) => a.id === id)
    if (approval) {
      console.log("[v0] Approved timetable:", approval.timetableName)
      setApprovals(approvals.filter((approval) => approval.id !== id))
      alert(`Timetable "${approval.timetableName}" has been approved successfully!`)
    }
  }

  const handleReject = (id: string, comments: string) => {
    console.log("[v0] Rejecting timetable:", id, "with comments:", comments)
    const approval = approvals.find((a) => a.id === id)
    if (approval) {
      console.log("[v0] Rejected timetable:", approval.timetableName)
      setApprovals(approvals.filter((approval) => approval.id !== id))
      setIsReviewDialogOpen(false)
      setReviewComments("")
      alert(`Timetable "${approval.timetableName}" has been rejected.\nFeedback sent to submitter.`)
    }
  }

  const handleViewDetails = (approval: PendingApproval) => {
    console.log("[v0] Viewing approval details:", approval.id)
    alert(
      `Timetable Details:\n\nName: ${approval.timetableName}\nDepartment: ${approval.department}\nSubmitted by: ${approval.submittedBy}\nScore: ${approval.score}%\nConflicts: ${approval.conflicts}\nUtilization: ${approval.utilization}%`,
    )
  }

  const handleBulkApprove = () => {
    console.log("[v0] Bulk approving high priority items")
    const highPriorityApprovals = approvals.filter((a) => a.priority === "high")
    console.log("[v0] High priority approvals:", highPriorityApprovals.length)

    if (highPriorityApprovals.length > 0) {
      setApprovals(approvals.filter((a) => a.priority !== "high"))
      alert(`Approved ${highPriorityApprovals.length} high priority timetables!`)
    } else {
      alert("No high priority timetables to approve.")
    }
  }

  const handleBulkReview = () => {
    console.log("[v0] Opening bulk review interface")
    alert("Opening bulk review interface...\nThis would allow reviewing multiple timetables simultaneously.")
  }

  const handleDepartmentSummary = () => {
    console.log("[v0] Generating department summary")
    const deptCounts = approvals.reduce(
      (acc, approval) => {
        acc[approval.department] = (acc[approval.department] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    console.log("[v0] Department summary:", deptCounts)
    const summary = Object.entries(deptCounts)
      .map(([dept, count]) => `${dept}: ${count} pending`)
      .join("\n")

    alert(`Department Summary:\n\n${summary}`)
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "under-review":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading pending approvals...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center text-foreground">
            <Calendar className="mr-2 h-5 w-5" />
            Pending Timetable Approvals
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Review and approve submitted timetables from department coordinators
          </CardDescription>
        </CardHeader>
        <CardContent>
          {approvals.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Pending Approvals</h3>
              <p className="text-muted-foreground text-center">
                All timetables have been reviewed. New submissions will appear here.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-foreground">Timetable</TableHead>
                  <TableHead className="text-foreground">Department</TableHead>
                  <TableHead className="text-foreground">Submitted By</TableHead>
                  <TableHead className="text-foreground">Date</TableHead>
                  <TableHead className="text-foreground">Priority</TableHead>
                  <TableHead className="text-foreground">Status</TableHead>
                  <TableHead className="text-foreground">Score</TableHead>
                  <TableHead className="text-foreground">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      <div>
                        <div>{approval.timetableName}</div>
                        <div className="text-xs text-muted-foreground">Semester {approval.semester}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{approval.department}</TableCell>
                    <TableCell className="text-foreground">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{approval.submittedBy}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-foreground">{approval.submittedDate}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(approval.priority)}>{approval.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(approval.status)}>{approval.status}</Badge>
                    </TableCell>
                    <TableCell className="text-foreground">
                      <div className="text-center">
                        <div className="font-semibold">{approval.score}%</div>
                        <div className="text-xs text-muted-foreground">{approval.conflicts} conflicts</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => handleViewDetails(approval)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-400 hover:text-green-300"
                          onClick={() => handleApprove(approval.id)}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300"
                              onClick={() => setSelectedApproval(approval)}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">Reject Timetable</DialogTitle>
                              <DialogDescription className="text-muted-foreground">
                                Provide feedback for rejection or request revisions
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="comments" className="text-foreground">
                                  Comments/Feedback
                                </Label>
                                <Textarea
                                  id="comments"
                                  value={reviewComments}
                                  onChange={(e) => setReviewComments(e.target.value)}
                                  placeholder="Explain the reason for rejection or required changes..."
                                  className="bg-input border-border text-foreground"
                                  rows={4}
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
                                  onClick={() => setIsReviewDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="flex-1 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  onClick={() => selectedApproval && handleReject(selectedApproval.id, reviewComments)}
                                >
                                  Reject & Send Feedback
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {approvals.length > 0 && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-foreground">
              <MessageSquare className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button className="bg-green-600 text-white hover:bg-green-700" onClick={handleBulkApprove}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve All High Priority
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-accent bg-transparent"
                onClick={handleBulkReview}
              >
                <Eye className="mr-2 h-4 w-4" />
                Bulk Review
              </Button>
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-accent bg-transparent"
                onClick={handleDepartmentSummary}
              >
                <Building className="mr-2 h-4 w-4" />
                Department Summary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
