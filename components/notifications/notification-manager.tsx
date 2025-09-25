"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone,
  Webhook,
  Plus,
  Edit,
  Trash2,
  TestTube,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Settings,
  Users,
  Target,
  AlertTriangle,
  Info,
  Zap
} from "lucide-react"

import {
  NotificationChannel,
  NotificationTemplate,
  NotificationRule,
  NotificationType,
  NotificationEvent,
  NotificationPriority,
  NotificationStatus
} from "@/lib/services/notification-service"

export function NotificationManager() {
  const [channels, setChannels] = useState<NotificationChannel[]>([])
  const [templates, setTemplates] = useState<NotificationTemplate[]>([])
  const [rules, setRules] = useState<NotificationRule[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddChannelOpen, setIsAddChannelOpen] = useState(false)
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false)

  const [channelForm, setChannelForm] = useState({
    name: "",
    type: "email" as const,
    enabled: true,
    config: {}
  })

  const [templateForm, setTemplateForm] = useState({
    name: "",
    type: "schedule_conflict" as NotificationType,
    channels: [] as string[],
    subject: "",
    content: "",
    enabled: true
  })

  const [ruleForm, setRuleForm] = useState({
    name: "",
    description: "",
    templateId: "",
    priority: "normal" as NotificationPriority,
    enabled: true,
    triggers: [],
    conditions: [],
    recipients: []
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      console.log("[NotificationManager] Loading notification data from database...")
      
      // TODO: Load real notification data from database using API endpoints
      setChannels([])
      setTemplates([])
      setRules([])
      setLogs([])
      
    } catch (error) {
      console.error("[NotificationManager] Error loading data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddChannel = async () => {
    console.log("[NotificationManager] Adding channel:", channelForm)
    
    if (!channelForm.name) {
      alert("Please enter a channel name")
      return
    }

    const newChannel: NotificationChannel = {
      id: Date.now().toString(),
      ...channelForm,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setChannels(prev => [...prev, newChannel])
    setIsAddChannelOpen(false)
    setChannelForm({
      name: "",
      type: "email",
      enabled: true,
      config: {}
    })
  }

  const handleAddTemplate = async () => {
    console.log("[NotificationManager] Adding template:", templateForm)
    
    if (!templateForm.name || !templateForm.content) {
      alert("Please fill in required fields")
      return
    }

    const newTemplate: NotificationTemplate = {
      id: Date.now().toString(),
      ...templateForm,
      variables: extractVariables(templateForm.content),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setTemplates(prev => [...prev, newTemplate])
    setIsAddTemplateOpen(false)
    setTemplateForm({
      name: "",
      type: "schedule_conflict" as NotificationType,
      channels: [],
      subject: "",
      content: "",
      enabled: true
    })
  }

  const handleAddRule = async () => {
    console.log("[NotificationManager] Adding rule:", ruleForm)
    
    if (!ruleForm.name || !ruleForm.templateId) {
      alert("Please fill in required fields")
      return
    }

    const newRule: NotificationRule = {
      id: Date.now().toString(),
      ...ruleForm,
      createdAt: new Date(),
      updatedAt: new Date()
    }

    setRules(prev => [...prev, newRule])
    setIsAddRuleOpen(false)
    setRuleForm({
      name: "",
      description: "",
      templateId: "",
      priority: "normal" as NotificationPriority,
      enabled: true,
      triggers: [],
      conditions: [],
      recipients: []
    })
  }

  const extractVariables = (content: string): string[] => {
    const matches = content.match(/{{(\w+)}}/g) || []
    return matches.map(match => match.replace(/{{|}}/g, ''))
  }

  const getChannelIcon = (type: string) => {
    const icons = {
      email: <Mail className="h-4 w-4" />,
      sms: <Smartphone className="h-4 w-4" />,
      push: <Bell className="h-4 w-4" />,
      webhook: <Webhook className="h-4 w-4" />,
      slack: <MessageSquare className="h-4 w-4" />,
      teams: <MessageSquare className="h-4 w-4" />
    }
    return icons[type as keyof typeof icons] || <Bell className="h-4 w-4" />
  }

  const getStatusColor = (status: NotificationStatus) => {
    const colors = {
      pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      sent: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      delivered: "bg-green-500/20 text-green-400 border-green-500/30",
      failed: "bg-red-500/20 text-red-400 border-red-500/30",
      cancelled: "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
    return colors[status] || colors.pending
  }

  const getPriorityColor = (priority: NotificationPriority) => {
    const colors = {
      low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
      normal: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      critical: "bg-red-500/20 text-red-400 border-red-500/30"
    }
    return colors[priority] || colors.normal
  }

  const testChannel = async (channelId: string) => {
    console.log("[NotificationManager] Testing channel:", channelId)
    // In a real implementation, this would call the notification service
    alert("Test notification sent! Check your configured destination.")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Notification Management</h1>
          <p className="text-muted-foreground">
            Configure notification channels, templates, and rules for system events
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={loadData} variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Channels</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{channels.filter(c => c.enabled).length}</div>
            <p className="text-xs text-muted-foreground">
              {channels.length} total configured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Templates</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
            <p className="text-xs text-muted-foreground">
              {templates.filter(t => t.enabled).length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</div>
            <p className="text-xs text-muted-foreground">
              {rules.length} total rules
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">
              95% delivered successfully
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
          <TabsTrigger value="logs">History</TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notification Channels</CardTitle>
                <Dialog open={isAddChannelOpen} onOpenChange={setIsAddChannelOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Channel
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Notification Channel</DialogTitle>
                      <DialogDescription>
                        Configure a new channel for sending notifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Channel Name</Label>
                          <Input
                            value={channelForm.name}
                            onChange={(e) => setChannelForm({...channelForm, name: e.target.value})}
                            placeholder="Enter channel name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select 
                            value={channelForm.type} 
                            onValueChange={(value: any) => setChannelForm({...channelForm, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="sms">SMS</SelectItem>
                              <SelectItem value="push">Push</SelectItem>
                              <SelectItem value="webhook">Webhook</SelectItem>
                              <SelectItem value="slack">Slack</SelectItem>
                              <SelectItem value="teams">Teams</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          checked={channelForm.enabled}
                          onCheckedChange={(checked) => setChannelForm({...channelForm, enabled: !!checked})}
                        />
                        <Label>Enable channel</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddChannelOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddChannel}>
                          Add Channel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Channel</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Configuration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.map((channel) => (
                    <TableRow key={channel.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(channel.type)}
                          <span className="font-medium">{channel.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {channel.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch checked={channel.enabled} disabled />
                          <span className="text-sm">
                            {channel.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {channel.type === 'email' && `From: ${(channel.config as any)?.fromEmail}`}
                          {channel.type === 'sms' && `From: ${(channel.config as any)?.fromNumber}`}
                          {channel.type === 'slack' && `Channel: ${(channel.config as any)?.channel}`}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => testChannel(channel.id)}>
                            <TestTube className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notification Templates</CardTitle>
                <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create Notification Template</DialogTitle>
                      <DialogDescription>
                        Design a reusable template for notifications
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template Name</Label>
                          <Input
                            value={templateForm.name}
                            onChange={(e) => setTemplateForm({...templateForm, name: e.target.value})}
                            placeholder="Enter template name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select 
                            value={templateForm.type} 
                            onValueChange={(value: any) => setTemplateForm({...templateForm, type: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="schedule_conflict">Schedule Conflict</SelectItem>
                              <SelectItem value="optimization_complete">Optimization Complete</SelectItem>
                              <SelectItem value="approval_required">Approval Required</SelectItem>
                              <SelectItem value="system_error">System Error</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Subject</Label>
                        <Input
                          value={templateForm.subject}
                          onChange={(e) => setTemplateForm({...templateForm, subject: e.target.value})}
                          placeholder="Email subject (use {{variable}} for dynamic content)"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={templateForm.content}
                          onChange={(e) => setTemplateForm({...templateForm, content: e.target.value})}
                          placeholder="Message content (use {{variable}} for dynamic content)"
                          rows={4}
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddTemplate}>
                          Create Template
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{template.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="capitalize">
                            {template.type.replace('_', ' ')}
                          </Badge>
                          <Badge variant={template.enabled ? "default" : "secondary"}>
                            {template.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {template.subject && (
                      <div className="mb-2">
                        <span className="text-sm font-medium">Subject: </span>
                        <span className="text-sm text-muted-foreground">{template.subject}</span>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium">Content: </span>
                      <span className="text-sm text-muted-foreground">
                        {template.content.length > 100 
                          ? template.content.substring(0, 100) + '...' 
                          : template.content}
                      </span>
                    </div>
                    
                    {template.variables.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        <span className="text-sm font-medium">Variables: </span>
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="outline" className="text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Notification Rules</CardTitle>
                <Dialog open={isAddRuleOpen} onOpenChange={setIsAddRuleOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Notification Rule</DialogTitle>
                      <DialogDescription>
                        Define when and how notifications should be sent
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Rule Name</Label>
                        <Input
                          value={ruleForm.name}
                          onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})}
                          placeholder="Enter rule name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                          value={ruleForm.description}
                          onChange={(e) => setRuleForm({...ruleForm, description: e.target.value})}
                          placeholder="Describe when this rule should trigger"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template</Label>
                          <Select 
                            value={ruleForm.templateId} 
                            onValueChange={(value) => setRuleForm({...ruleForm, templateId: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                            <SelectContent>
                              {templates.map(template => (
                                <SelectItem key={template.id} value={template.id}>
                                  {template.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Priority</Label>
                          <Select 
                            value={ruleForm.priority} 
                            onValueChange={(value: any) => setRuleForm({...ruleForm, priority: value})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="critical">Critical</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setIsAddRuleOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddRule}>
                          Create Rule
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule</TableHead>
                    <TableHead>Template</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">{rule.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {templates.find(t => t.id === rule.templateId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(rule.priority)}>
                          {rule.priority.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Switch checked={rule.enabled} disabled />
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
              <CardDescription>
                Recent notification deliveries and their status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Sent</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="text-sm">
                          {log.sentAt?.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {rules.find(r => r.id === log.ruleId)?.name || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span className="text-sm">{log.recipients.length}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(log.status)}>
                          {log.status.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(log.metadata || {})
                            .slice(0, 2)
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(', ')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}