"use client"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Sidebar from '@/components/ui/sidebar'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown, ChevronUp, Filter, Plus, Search, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'

type WorkOrder = {
  id: string
  title: string
  status: 'Open' | 'In Progress' | 'On Hold' | 'Completed'
  priority: 'Low' | 'Medium' | 'High'
  assignedTo: string
  dueDate: Date
}

const sampleWorkOrders: WorkOrder[] = [
  { id: 'WO-001', title: 'Repair conveyor belt', status: 'Open', priority: 'High', assignedTo: 'John Doe', dueDate: new Date(2023, 5, 15) },
  { id: 'WO-002', title: 'Replace air filter', status: 'In Progress', priority: 'Medium', assignedTo: 'Jane Smith', dueDate: new Date(2023, 5, 20) },
  { id: 'WO-003', title: 'Lubricate machinery', status: 'Completed', priority: 'Low', assignedTo: 'Bob Johnson', dueDate: new Date(2023, 5, 10) },
  { id: 'WO-004', title: 'Inspect electrical systems', status: 'On Hold', priority: 'High', assignedTo: 'Alice Brown', dueDate: new Date(2023, 5, 25) },
  { id: 'WO-005', title: 'Calibrate sensors', status: 'Open', priority: 'Medium', assignedTo: 'Charlie Wilson', dueDate: new Date(2023, 5, 18) },
]

export default function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = React.useState<WorkOrder[]>(sampleWorkOrders)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>()
  const [priorityFilter, setPriorityFilter] = React.useState<string | undefined>()
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof WorkOrder; direction: 'ascending' | 'descending' } | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'All' ? undefined : value)
  }

  const handlePriorityFilter = (value: string) => {
    setPriorityFilter(value === 'All' ? undefined : value)
  }

  const handleSort = (key: keyof WorkOrder) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedWorkOrders = React.useMemo(() => {
    let result = [...workOrders]

    if (searchTerm) {
      result = result.filter(wo => 
        wo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wo.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      result = result.filter(wo => wo.status === statusFilter)
    }

    if (priorityFilter) {
      result = result.filter(wo => wo.priority === priorityFilter)
    }

    if (sortConfig) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }

    return result
  }, [workOrders, searchTerm, statusFilter, priorityFilter, sortConfig])

  const handleCreateWorkOrder = (newWorkOrder: Omit<WorkOrder, 'id'>) => {
    const id = `WO-${(workOrders.length + 1).toString().padStart(3, '0')}`
    setWorkOrders([...workOrders, { ...newWorkOrder, id }])
  }

  const handleEditWorkOrder = (updatedWorkOrder: WorkOrder) => {
    setWorkOrders(workOrders.map(workOrder => workOrder.id === updatedWorkOrder.id ? updatedWorkOrder : workOrder))
  }

  const handleDeleteWorkOrder = (workOrderId: string) => {
    setWorkOrders(workOrders.filter(workOrder => workOrder.id !== workOrderId))
  }

  return (
    <div className='flex'>
      <div className='w-1/4'>
      <Sidebar />  
      </div>      
    <div className="container mx-auto py-10 w-3/4">
      <h1 className="text-2xl font-bold mb-5">Work Orders</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search work orders..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
          />
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handlePriorityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Priorities</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create Work Order</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Work Order</DialogTitle>
            </DialogHeader>
            <CreateWorkOrderForm onSubmit={handleCreateWorkOrder} />
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              ID
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('id')}>
                {sortConfig?.key === 'id' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              Title
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('title')}>
                {sortConfig?.key === 'title' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>
              Due Date
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('dueDate')}>
                {sortConfig?.key === 'dueDate' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedWorkOrders.map((workOrder) => (
            <TableRow key={workOrder.id}>
              <TableCell className="font-medium">{workOrder.id}</TableCell>
              <TableCell>{workOrder.title}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${workOrder.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    workOrder.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    workOrder.status === 'On Hold' ? 'bg-red-100 text-red-800' :
                    'bg-green-100 text-green-800'}`}>
                  {workOrder.status}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${workOrder.priority === 'Low' ? 'bg-gray-100 text-gray-800' :
                    workOrder.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {workOrder.priority}
                </span>
              </TableCell>
              <TableCell>{workOrder.assignedTo}</TableCell>
              <TableCell>{format(workOrder.dueDate, 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit Work Order</DialogTitle>
                      </DialogHeader>
                      <EditWorkOrderForm workOrder={workOrder} onSubmit={handleEditWorkOrder} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteWorkOrder(workOrder.id)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  )
}

interface CreateWorkOrderFormProps {
  onSubmit: (workOrder: Omit<WorkOrder, 'id'>) => void
}

function CreateWorkOrderForm({ onSubmit }: CreateWorkOrderFormProps) {
  const [title, setTitle] = React.useState('')
  const [status, setStatus] = React.useState<WorkOrder['status']>('Open')
  const [priority, setPriority] = React.useState<WorkOrder['priority']>('Medium')
  const [assignedTo, setAssignedTo] = React.useState('')
  const [dueDate, setDueDate] = React.useState<Date | undefined>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && status && priority && assignedTo && dueDate) {
      onSubmit({ title, status, priority, assignedTo, dueDate })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: WorkOrder['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={(value: WorkOrder['priority']) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="dueDate">Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!dueDate && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={setDueDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit">Create Work Order</Button>
    </form>
  )
}

const formatDate = (date: Date) => {
  return date ? date.toISOString().split("T")[0] : "";
};


const parseDate = (dateStr: string) => {
  return new Date(dateStr);
};

interface EditWorkOrderFormProps {
  workOrder: WorkOrder
  onSubmit: (workOrder: WorkOrder) => void
}


function EditWorkOrderForm({ workOrder, onSubmit }: EditWorkOrderFormProps) {
  const [title, setTitle] = React.useState(workOrder.title)
  const [status, setStatus] = React.useState(workOrder.status)
  const [priority, setPriority] = React.useState(workOrder.priority)
  const [assignedTo, setAssignedTo] = React.useState(workOrder.assignedTo)
  const [dueDate, setDueDate] = React.useState<string>(formatDate(workOrder.dueDate))    

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title && status && priority && assignedTo && dueDate) {
      onSubmit({
        ...workOrder,
        title,
        status,
        priority,
        assignedTo,
        dueDate: parseDate(dueDate)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-title">Title</Label>
        <Input id="edit-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>  
      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select value={status} onValueChange={(value: WorkOrder['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>          
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>            
          </SelectContent>
        </Select>
      </div>  
      <div>
        <Label htmlFor="edit-priority">Priority</Label>
        <Select value={priority} onValueChange={(value: WorkOrder['priority']) => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>            
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-assignedTo">Assigned To</Label>
        <Input id="edit-assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
      </div> 
      <div>
        <Label htmlFor="edit-dueDate">Due Date</Label>
        <Input id="edit-dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
      </div>
      <Button type="submit">Update Work Order</Button>
    </form>
  )
}