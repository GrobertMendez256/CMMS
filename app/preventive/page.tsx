"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import Sidebar from '@/components/ui/sidebar'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown, ChevronUp, Filter, Plus, Search } from 'lucide-react'
import { format } from 'date-fns'

type MaintenanceTask = {
  id: string
  assetName: string
  taskDescription: string
  frequency: string
  lastPerformed: Date
  nextDue: Date
  assignedTo: string
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Overdue'
}

const sampleTasks: MaintenanceTask[] = [
  { id: 'PM-001', assetName: 'Conveyor Belt A', taskDescription: 'Lubricate bearings and check belt tension', frequency: 'Monthly', lastPerformed: new Date(2023, 4, 15), nextDue: new Date(2023, 5, 15), assignedTo: 'John Doe', status: 'Scheduled' },
  { id: 'PM-002', assetName: 'HVAC System', taskDescription: 'Replace air filters and clean coils', frequency: 'Quarterly', lastPerformed: new Date(2023, 2, 1), nextDue: new Date(2023, 5, 1), assignedTo: 'Jane Smith', status: 'Overdue' },
  { id: 'PM-003', assetName: 'CNC Machine', taskDescription: 'Calibrate and perform precision tests', frequency: 'Bi-annually', lastPerformed: new Date(2023, 0, 10), nextDue: new Date(2023, 6, 10), assignedTo: 'Bob Johnson', status: 'Scheduled' },
  { id: 'PM-004', assetName: 'Forklift 1', taskDescription: 'Check hydraulic system and tire pressure', frequency: 'Weekly', lastPerformed: new Date(2023, 5, 5), nextDue: new Date(2023, 5, 12), assignedTo: 'Alice Brown', status: 'In Progress' },
  { id: 'PM-005', assetName: 'Electrical Panel', taskDescription: 'Thermal imaging and connection tightness check', frequency: 'Annually', lastPerformed: new Date(2022, 11, 1), nextDue: new Date(2023, 11, 1), assignedTo: 'Charlie Wilson', status: 'Scheduled' },
]

export default function PreventiveMaintenancePage() {
  const [tasks, setTasks] = React.useState<MaintenanceTask[]>(sampleTasks)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>()
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof MaintenanceTask; direction: 'ascending' | 'descending' } | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'All' ? undefined : value)
  }

  const handleSort = (key: keyof MaintenanceTask) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedTasks = React.useMemo(() => {
    let result = [...tasks]

    if (searchTerm) {
      result = result.filter(task => 
        task.assetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.taskDescription.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter) {
      result = result.filter(task => task.status === statusFilter)
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
  }, [tasks, searchTerm, statusFilter, sortConfig])

  const handleCreateTask = (newTask: Omit<MaintenanceTask, 'id'>) => {
    const id = `PM-${(tasks.length + 1).toString().padStart(3, '0')}`
    setTasks([...tasks, { ...newTask, id }])
  }

  return (
    <div className='flex'>
      <div className='w-1/4'>
      <Sidebar />  
      </div>      
    <div className="container mx-auto py-10 w-3/4">
      <h1 className="text-2xl font-bold mb-5">Preventive Maintenance</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search tasks..."
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
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Maintenance Task</DialogTitle>
            </DialogHeader>
            <CreateTaskForm onSubmit={handleCreateTask} />
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
              Asset Name
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('assetName')}>
                {sortConfig?.key === 'assetName' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Task Description</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>
              Next Due
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('nextDue')}>
                {sortConfig?.key === 'nextDue' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>{task.assetName}</TableCell>
              <TableCell>{task.taskDescription}</TableCell>
              <TableCell>{task.frequency}</TableCell>
              <TableCell>{format(task.nextDue, 'MMM dd, yyyy')}</TableCell>
              <TableCell>{task.assignedTo}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${task.status === 'Scheduled' ? 'bg-blue-100 text-blue-800' :
                    task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'}`}>
                  {task.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  )
}

interface CreateTaskFormProps {
  onSubmit: (task: Omit<MaintenanceTask, 'id'>) => void
}

function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [assetName, setAssetName] = React.useState('')
  const [taskDescription, setTaskDescription] = React.useState('')
  const [frequency, setFrequency] = React.useState('')
  const [lastPerformed, setLastPerformed] = React.useState<Date | undefined>(new Date())
  const [nextDue, setNextDue] = React.useState<Date | undefined>(new Date())
  const [assignedTo, setAssignedTo] = React.useState('')
  const [status, setStatus] = React.useState<MaintenanceTask['status']>('Scheduled')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (assetName && taskDescription && frequency && lastPerformed && nextDue && assignedTo && status) {
      onSubmit({
        assetName,
        taskDescription,
        frequency,
        lastPerformed,
        nextDue,
        assignedTo,
        status
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="assetName">Asset Name</Label>
        <Input id="assetName" value={assetName} onChange={(e) => setAssetName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="taskDescription">Task Description</Label>
        <Textarea id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="frequency">Frequency</Label>
        <Select value={frequency} onValueChange={setFrequency}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
            <SelectItem value="Quarterly">Quarterly</SelectItem>
            <SelectItem value="Bi-annually">Bi-annually</SelectItem>
            <SelectItem value="Annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="lastPerformed">Last Performed</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!lastPerformed && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {lastPerformed ? format(lastPerformed, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={lastPerformed}
              onSelect={setLastPerformed}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="nextDue">Next Due</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!nextDue && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {nextDue ? format(nextDue, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={nextDue}
              onSelect={setNextDue}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="assignedTo">Assigned To</Label>
        <Input id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: MaintenanceTask['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">Add Task</Button>
    </form>
  )
}