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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown, ChevronUp, Filter, Plus, Edit, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import Sidebar from '@/components/ui/sidebar'
type Asset = {
  id: string
  name: string
  type: string
  status: 'Operational' | 'Under Maintenance' | 'Out of Service'
  location: string
  lastMaintenance: Date
  nextMaintenance: Date
}

const sampleAssets: Asset[] = [
  { id: 'AST-001', name: 'Conveyor Belt A', type: 'Conveyor', status: 'Operational', location: 'Warehouse 1', lastMaintenance: new Date(2023, 4, 15), nextMaintenance: new Date(2023, 7, 15) },
  { id: 'AST-002', name: 'Forklift 1', type: 'Vehicle', status: 'Under Maintenance', location: 'Warehouse 2', lastMaintenance: new Date(2023, 5, 1), nextMaintenance: new Date(2023, 8, 1) },
  { id: 'AST-003', name: 'CNC Machine', type: 'Manufacturing', status: 'Operational', location: 'Production Floor', lastMaintenance: new Date(2023, 3, 20), nextMaintenance: new Date(2023, 6, 20) },
  { id: 'AST-004', name: 'HVAC System', type: 'Facility', status: 'Operational', location: 'Building A', lastMaintenance: new Date(2023, 2, 10), nextMaintenance: new Date(2023, 8, 10) },
  { id: 'AST-005', name: 'Packaging Machine', type: 'Manufacturing', status: 'Out of Service', location: 'Packaging Area', lastMaintenance: new Date(2023, 5, 5), nextMaintenance: new Date(2023, 6, 5) },
]

export default function AssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>(sampleAssets)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [typeFilter, setTypeFilter] = React.useState<string | undefined>()
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>()
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Asset; direction: 'ascending' | 'descending' } | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleTypeFilter = (value: string) => {
    setTypeFilter(value === 'All' ? undefined : value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value === 'All' ? undefined : value)
  }

  const handleSort = (key: keyof Asset) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedAssets = React.useMemo(() => {
    let result = [...assets]

    if (searchTerm) {
      result = result.filter(asset => 
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (typeFilter) {
      result = result.filter(asset => asset.type === typeFilter)
    }

    if (statusFilter) {
      result = result.filter(asset => asset.status === statusFilter)
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
  }, [assets, searchTerm, typeFilter, statusFilter, sortConfig])

  const handleCreateAsset = (newAsset: Omit<Asset, 'id'>) => {
    const id = `AST-${(assets.length + 1).toString().padStart(3, '0')}`
    setAssets([...assets, { ...newAsset, id }])
  }

  const handleEditAsset = (updatedAsset: Asset) => {
    setAssets(assets.map(asset => asset.id === updatedAsset.id ? updatedAsset : asset))
  }

  const handleDeleteAsset = (assetId: string) => {
    setAssets(assets.filter(asset => asset.id !== assetId))
  }

  return (
    <div className='flex'>
      <div className='w-1/4'>
      <Sidebar />  
      </div>
      
    <div className="container mx-auto py-10 w-3/4">
    
      <h1 className="text-2xl font-bold mb-5">Activos</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search assets..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
          />
          <Select onValueChange={handleTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              <SelectItem value="Conveyor">Conveyor</SelectItem>
              <SelectItem value="Vehicle">Vehicle</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Facility">Facility</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Operational">Operational</SelectItem>
              <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
              <SelectItem value="Out of Service">Out of Service</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Asset</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Asset</DialogTitle>
            </DialogHeader>
            <CreateAssetForm onSubmit={handleCreateAsset} />
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
              Name
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('name')}>
                {sortConfig?.key === 'name' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>
              Last Maintenance
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('lastMaintenance')}>
                {sortConfig?.key === 'lastMaintenance' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>
              Next Maintenance
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('nextMaintenance')}>
                {sortConfig?.key === 'nextMaintenance' ? (
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
          {filteredAndSortedAssets.map((asset) => (
            <TableRow key={asset.id}>
              <TableCell className="font-medium">{asset.id}</TableCell>
              <TableCell>{asset.name}</TableCell>
              <TableCell>{asset.type}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${asset.status === 'Operational' ? 'bg-green-100 text-green-800' :
                    asset.status === 'Under Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'}`}>
                  {asset.status}
                </span>
              </TableCell>
              <TableCell>{asset.location}</TableCell>
              <TableCell>{format(asset.lastMaintenance, 'MMM dd, yyyy')}</TableCell>
              <TableCell>{format(asset.nextMaintenance, 'MMM dd, yyyy')}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                      </DialogHeader>
                      <EditAssetForm asset={asset} onSubmit={handleEditAsset} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteAsset(asset.id)}><Trash2 className="h-4 w-4" /></Button>
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

interface CreateAssetFormProps {
  onSubmit: (asset: Omit<Asset, 'id'>) => void
}

function CreateAssetForm({ onSubmit }: CreateAssetFormProps) {
  const [name, setName] = React.useState('')
  const [type, setType] = React.useState('')
  const [status, setStatus] = React.useState<Asset['status']>('Operational')
  const [location, setLocation] = React.useState('')
  const [lastMaintenance, setLastMaintenance] = React.useState<Date | undefined>(new Date())
  const [nextMaintenance, setNextMaintenance] = React.useState<Date | undefined>(new Date())

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && type && status && location && lastMaintenance && nextMaintenance) {
      onSubmit({ name, type, status, location, lastMaintenance, nextMaintenance })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conveyor">Conveyor</SelectItem>
            <SelectItem value="Vehicle">Vehicle</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Facility">Facility</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(value: Asset['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Operational">Operational</SelectItem>
            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            <SelectItem value="Out of Service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="lastMaintenance">Last Maintenance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!lastMaintenance && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {lastMaintenance ? format(lastMaintenance, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={lastMaintenance}
              onSelect={setLastMaintenance}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label htmlFor="nextMaintenance">Next Maintenance</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!nextMaintenance && "text-muted-foreground"}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {nextMaintenance ? format(nextMaintenance, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={nextMaintenance}
              onSelect={setNextMaintenance}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit">Add Asset</Button>
    </form>
  )
}

const formatDate = (date: Date) => {
  return date ? date.toISOString().split("T")[0] : "";
};


const parseDate = (dateStr: string) => {
  return new Date(dateStr);
};

interface EditAssetFormProps {
  asset: Asset
  onSubmit: (asset: Asset) => void
}


function EditAssetForm({ asset, onSubmit }: EditAssetFormProps) {
  const [name, setName] = React.useState(asset.name)
  const [type, setType] = React.useState(asset.type)
  const [status, setStatus] = React.useState(asset.status)  
  const [location, setLocation] = React.useState(asset.location)
  const [lastMaintenance, setLastMaintenance] = React.useState<string>(formatDate(asset.lastMaintenance))
  const [nextMaintenance, setNextMaintenance] = React.useState<string>(formatDate(asset.nextMaintenance))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && type && status && location && lastMaintenance && nextMaintenance) {
      onSubmit({
        ...asset,
        name,
        type,
        status,
        location,
        lastMaintenance: parseDate(lastMaintenance),
        nextMaintenance: parseDate(nextMaintenance)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="edit-name">Name</Label>
        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>      
      <div>
        <Label htmlFor="edit-type">Type</Label>
        <Select value={status} onValueChange={(value: Asset['type']) => setType(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Conveyor">Conveyor</SelectItem>
            <SelectItem value="Vehicle">Vehicle</SelectItem>
            <SelectItem value="Manufacturing">Manufacturing</SelectItem>
            <SelectItem value="Facility">Facility</SelectItem>
          </SelectContent>
        </Select>
      </div> 
      <div>
        <Label htmlFor="edit-status">Status</Label>
        <Select value={status} onValueChange={(value: Asset['status']) => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Operational">Operational</SelectItem>
            <SelectItem value="Under Maintenance">Under Maintenance</SelectItem>
            <SelectItem value="Out of Service">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>      
      <div>
        <Label htmlFor="edit-location">Location</Label>
        <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-lastMaintenance">Last Maintenance</Label>
        <Input id="edit-lastMaintenance" type="date" value={lastMaintenance} onChange={(e) => setLastMaintenance(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-nextMaintenance">Next Maintenance</Label>
        <Input id="edit-nextMaintenance" type="date" value={nextMaintenance} onChange={(e) => setNextMaintenance(e.target.value)} required />
      </div>
      <Button type="submit">Update Asset</Button>
    </form>
  )
}