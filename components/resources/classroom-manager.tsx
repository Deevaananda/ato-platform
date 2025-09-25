"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Building, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Room, RoomFormData } from "@/lib/types/timetabling"

export function ClassroomManager() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState<string>("all")
  const { toast } = useToast()

  const [roomForm, setRoomForm] = useState<RoomFormData>({
    number: "",
    name: "",
    building: "",
    capacity: 60,
    type: "classroom",
    facilities: [],
  })

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("[v0] Fetching rooms from API...")
      setIsLoading(true)

      try {
        const response = await fetch("/api/rooms")
        const data = await response.json()

        if (data.success) {
          setRooms(data.data)
        }

        console.log("[v0] Rooms loaded successfully")
      } catch (error) {
        console.error("[v0] Error loading rooms:", error)
        toast({
          title: "Error",
          description: "Failed to load rooms. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchRooms()
  }, [toast])

  const handleAddRoom = async () => {
    console.log("[v0] Adding new room:", roomForm)

    if (!roomForm.number || !roomForm.name || !roomForm.building) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Number, Name, Building).",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomForm),
      })

      const data = await response.json()

      if (data.success) {
        setRooms((prev) => [...prev, data.data])
        setRoomForm({
          number: "",
          name: "",
          building: "",
          capacity: 60,
          type: "classroom",
          facilities: [],
        })
        setIsAddDialogOpen(false)
        toast({
          title: "Room Added",
          description: `${data.data.name} has been added successfully.`,
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Error adding room:", error)
      toast({
        title: "Error",
        description: "Failed to add room. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.building.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || room.type === selectedType
    return matchesSearch && matchesType
  })

  const handleEditRoom = (room: Room) => {
    console.log("[v0] Editing room:", room.id)
    setSelectedRoom(room)
    setRoomForm({
      number: room.number,
      name: room.name,
      building: room.building,
      capacity: room.capacity,
      type: room.type,
      facilities: room.facilities,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateRoom = () => {
    console.log("[v0] Updating room:", selectedRoom?.id)

    if (!selectedRoom || !roomForm.number || !roomForm.name || !roomForm.building) {
      console.log("[v0] Missing required fields for update")
      return
    }

    const updatedRoom: Room = {
      ...selectedRoom,
      number: roomForm.number,
      name: roomForm.name,
      building: roomForm.building,
      capacity: roomForm.capacity,
      type: roomForm.type,
      facilities: roomForm.facilities,
      updatedAt: new Date(),
    }

    setRooms(rooms.map((r) => (r.id === selectedRoom.id ? updatedRoom : r)))
    setRoomForm({
      number: "",
      name: "",
      building: "",
      capacity: 60,
      type: "classroom",
      facilities: [],
    })
    setIsEditDialogOpen(false)
    setSelectedRoom(null)
    console.log("[v0] Room updated successfully")
  }

  const handleDeleteRoom = (id: string) => {
    console.log("[v0] Deleting room:", id)
    setRooms(rooms.filter((r) => r.id !== id))
    console.log("[v0] Room deleted successfully")
  }

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-500/20 text-green-400 border-green-500/30"
      : "bg-red-500/20 text-red-400 border-red-500/30"
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading rooms...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Room Management</h2>
          <p className="text-muted-foreground">Manage classroom resources and capacity</p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">Add New Room</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter the details for the new room
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-foreground">
                    Room Number
                  </Label>
                  <Input
                    id="number"
                    value={roomForm.number}
                    onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                    placeholder="e.g., CR-101"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Room Name
                  </Label>
                  <Input
                    id="name"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    placeholder="e.g., Classroom 101"
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="building" className="text-foreground">
                    Building
                  </Label>
                  <Input
                    id="building"
                    value={roomForm.building}
                    onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
                    placeholder="Academic Block A"
                    className="bg-input border-border text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity" className="text-foreground">
                    Capacity
                  </Label>
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({ ...roomForm, capacity: Number.parseInt(e.target.value) })}
                    className="bg-input border-border text-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">
                  Room Type
                </Label>
                <Select value={roomForm.type} onValueChange={(value: any) => setRoomForm({ ...roomForm, type: value })}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="classroom">Classroom</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="auditorium">Auditorium</SelectItem>
                    <SelectItem value="seminar_hall">Seminar Hall</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="facilities" className="text-foreground">
                  Facilities (comma-separated)
                </Label>
                <Input
                  id="facilities"
                  value={roomForm.facilities.join(", ")}
                  onChange={(e) =>
                    setRoomForm({
                      ...roomForm,
                      facilities: e.target.value
                        .split(",")
                        .map((f) => f.trim())
                        .filter((f) => f),
                    })
                  }
                  placeholder="Projector, Whiteboard, AC, WiFi"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <Button onClick={handleAddRoom} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Add Room
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="classroom">Classroom</SelectItem>
            <SelectItem value="lab">Laboratory</SelectItem>
            <SelectItem value="auditorium">Auditorium</SelectItem>
            <SelectItem value="seminar_hall">Seminar Hall</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground">Edit Room</DialogTitle>
            <DialogDescription className="text-muted-foreground">Update the room details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-number" className="text-foreground">
                  Room Number
                </Label>
                <Input
                  id="edit-number"
                  value={roomForm.number}
                  onChange={(e) => setRoomForm({ ...roomForm, number: e.target.value })}
                  placeholder="e.g., CR-101"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-foreground">
                  Room Name
                </Label>
                <Input
                  id="edit-name"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                  placeholder="e.g., Classroom 101"
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-building" className="text-foreground">
                  Building
                </Label>
                <Input
                  id="edit-building"
                  value={roomForm.building}
                  onChange={(e) => setRoomForm({ ...roomForm, building: e.target.value })}
                  placeholder="Academic Block A"
                  className="bg-input border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-capacity" className="text-foreground">
                  Capacity
                </Label>
                <Input
                  id="edit-capacity"
                  type="number"
                  min="1"
                  value={roomForm.capacity}
                  onChange={(e) => setRoomForm({ ...roomForm, capacity: Number.parseInt(e.target.value) })}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-type" className="text-foreground">
                Room Type
              </Label>
              <Select value={roomForm.type} onValueChange={(value: any) => setRoomForm({ ...roomForm, type: value })}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="classroom">Classroom</SelectItem>
                  <SelectItem value="lab">Laboratory</SelectItem>
                  <SelectItem value="auditorium">Auditorium</SelectItem>
                  <SelectItem value="seminar_hall">Seminar Hall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-facilities" className="text-foreground">
                Facilities (comma-separated)
              </Label>
              <Input
                id="edit-facilities"
                value={roomForm.facilities.join(", ")}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    facilities: e.target.value
                      .split(",")
                      .map((f) => f.trim())
                      .filter((f) => f),
                  })
                }
                placeholder="Projector, Whiteboard, AC, WiFi"
                className="bg-input border-border text-foreground"
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="flex-1 border-border text-foreground hover:bg-accent bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateRoom}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Update Room
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {rooms.length === 0 ? (
        <Card className="border-border">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Rooms Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by adding your first room to the system.
            </p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add First Room
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Total Rooms</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{rooms.length}</div>
                <p className="text-xs text-muted-foreground">Across all buildings</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">Available</CardTitle>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{rooms.filter((r) => r.isAvailable).length}</div>
                <p className="text-xs text-muted-foreground">Ready for scheduling</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Total Capacity</CardTitle>
                <CardDescription className="text-muted-foreground">Students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {rooms.reduce((sum, r) => sum + r.capacity, 0)}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Room List</CardTitle>
              <CardDescription className="text-muted-foreground">Manage all room resources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-foreground">Room</TableHead>
                    <TableHead className="text-foreground">Number</TableHead>
                    <TableHead className="text-foreground">Type</TableHead>
                    <TableHead className="text-foreground">Capacity</TableHead>
                    <TableHead className="text-foreground">Building</TableHead>
                    <TableHead className="text-foreground">Status</TableHead>
                    <TableHead className="text-foreground">Facilities</TableHead>
                    <TableHead className="text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRooms.map((room) => (
                    <TableRow key={room.id} className="border-border">
                      <TableCell className="font-medium text-foreground">{room.name}</TableCell>
                      <TableCell className="text-foreground">{room.number}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border text-muted-foreground">
                          {room.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{room.capacity}</TableCell>
                      <TableCell className="text-foreground">{room.building}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(room.isAvailable)}>
                          {room.isAvailable ? "Available" : "Unavailable"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {room.facilities.slice(0, 2).map((facility, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs border-border text-muted-foreground"
                            >
                              {facility}
                            </Badge>
                          ))}
                          {room.facilities.length > 2 && (
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                              +{room.facilities.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() => handleEditRoom(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteRoom(room.id)}
                          >
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
        </>
      )}
    </div>
  )
}
