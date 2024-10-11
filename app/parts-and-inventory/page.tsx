"use client"
import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Sidebar from '@/components/ui/sidebar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Filter, Plus, Search, Edit, Trash2 } from 'lucide-react'

type Part = {
  id: string
  name: string
  category: string
  quantity: number
  unit: string
  location: string
  minimumStock: number
  price: number
}

const sampleParts: Part[] = [
  { id: 'PRT-001', name: 'Bearing', category: 'Mechanical', quantity: 50, unit: 'pcs', location: 'Shelf A1', minimumStock: 20, price: 15.99 },
  { id: 'PRT-002', name: 'Electric Motor', category: 'Electrical', quantity: 10, unit: 'pcs', location: 'Shelf B2', minimumStock: 5, price: 199.99 },
  { id: 'PRT-003', name: 'Hydraulic Oil', category: 'Fluids', quantity: 200, unit: 'liters', location: 'Tank 1', minimumStock: 100, price: 5.50 },
  { id: 'PRT-004', name: 'Belt', category: 'Mechanical', quantity: 30, unit: 'pcs', location: 'Shelf C3', minimumStock: 15, price: 25.00 },
  { id: 'PRT-005', name: 'Circuit Breaker', category: 'Electrical', quantity: 25, unit: 'pcs', location: 'Shelf D4', minimumStock: 10, price: 45.75 },
]

export default function PartsInventoryPage() {
  const [parts, setParts] = React.useState<Part[]>(sampleParts)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string | undefined>()
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Part; direction: 'ascending' | 'descending' } | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value === 'All' ? undefined : value)
  }

  const handleSort = (key: keyof Part) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedParts = React.useMemo(() => {
    let result = [...parts]

    if (searchTerm) {
      result = result.filter(part => 
        part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        part.id.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      result = result.filter(part => part.category === categoryFilter)
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
  }, [parts, searchTerm, categoryFilter, sortConfig])

  const handleCreatePart = (newPart: Omit<Part, 'id'>) => {
    const id = `PRT-${(parts.length + 1).toString().padStart(3, '0')}`
    setParts([...parts, { ...newPart, id }])
  }

  const handleEditPart = (updatedPart: Part) => {
    setParts(parts.map(part => part.id === updatedPart.id ? updatedPart : part))
  }

  const handleDeletePart = (partId: string) => {
    setParts(parts.filter(part => part.id !== partId))
  }

  return (
    <div className='flex'>
      <div className='w-1/4'>
      <Sidebar />  
      </div>
      
    <div className="container mx-auto py-10 w-3/4">
      <h1 className="text-2xl font-bold mb-5">Parts and Inventory</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search parts..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-64"
          />
          <Select onValueChange={handleCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              <SelectItem value="Mechanical">Mechanical</SelectItem>
              <SelectItem value="Electrical">Electrical</SelectItem>
              <SelectItem value="Fluids">Fluids</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Part</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Part</DialogTitle>
            </DialogHeader>
            <CreatePartForm onSubmit={handleCreatePart} />
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
            <TableHead>Category</TableHead>
            <TableHead>
              Quantity
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('quantity')}>
                {sortConfig?.key === 'quantity' ? (
                  sortConfig.direction === 'ascending' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead>Unit</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Minimum Stock</TableHead>
            <TableHead>
              Price
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('price')}>
                {sortConfig?.key === 'price' ? (
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
          {filteredAndSortedParts.map((part) => (
            <TableRow key={part.id}>
              <TableCell className="font-medium">{part.id}</TableCell>
              <TableCell>{part.name}</TableCell>
              <TableCell>{part.category}</TableCell>
              <TableCell>{part.quantity}</TableCell>
              <TableCell>{part.unit}</TableCell>
              <TableCell>{part.location}</TableCell>
              <TableCell>{part.minimumStock}</TableCell>
              <TableCell>${part.price.toFixed(2)}</TableCell>
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
                      <EditPartForm part={part} onSubmit={handleEditPart} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeletePart(part.id)}><Trash2 className="h-4 w-4" /></Button>
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

interface CreatePartFormProps {
  onSubmit: (part: Omit<Part, 'id'>) => void
}

function CreatePartForm({ onSubmit }: CreatePartFormProps) {
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [quantity, setQuantity] = React.useState('')
  const [unit, setUnit] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [minimumStock, setMinimumStock] = React.useState('')
  const [price, setPrice] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category && quantity && unit && location && minimumStock && price) {
      onSubmit({
        name,
        category,
        quantity: parseInt(quantity),
        unit,
        location,
        minimumStock: parseInt(minimumStock),
        price: parseFloat(price)
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Electrical">Electrical</SelectItem>
            <SelectItem value="Fluids">Fluids</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="quantity">Quantity</Label>
        <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="unit">Unit</Label>
        <Input id="unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="minimumStock">Minimum Stock</Label>
        <Input id="minimumStock" type="number" value={minimumStock} onChange={(e) => setMinimumStock(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <Button type="submit">Add Part</Button>
    </form>
  )
}


interface EditPartFormProps {
  part: Part
  onSubmit: (part: Part) => void
}


function EditPartForm({ part, onSubmit }: EditPartFormProps) {
  const [name, setName] = React.useState(part.name)
  const [category, setCategory] = React.useState(part.category)
  const [quantity, setQuantity] = React.useState(part.quantity)
  const [unit, setUnit] = React.useState(part.unit)
  const [location, setLocation] = React.useState(part.location)
  const [minimumStock, setMinimumStock] = React.useState(part.minimumStock)
  const [price, setPrice] = React.useState(part.price)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category && quantity && unit && location && minimumStock && price) {
      onSubmit({
        ...part,
        name,
        category,
        quantity,
        unit,
        location,
        minimumStock,
        price
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
        <Label htmlFor="edit-category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Mechanical">Mechanical</SelectItem>
            <SelectItem value="Electrical">Electrical</SelectItem>
            <SelectItem value="Fluids">Fluids</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-quantity">Quantity</Label>
        <Input id="edit-quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} required />
      </div>
      <div>
        <Label htmlFor="edit-unit">Unit</Label>
        <Input id="edit-unit" value={unit} onChange={(e) => setUnit(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-location">Location</Label>
        <Input id="edit-location" value={location} onChange={(e) => setLocation(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-minimumStock">Minimum Stock</Label>
        <Input id="edit-minimumStock" type="number" value={minimumStock} onChange={(e) => setMinimumStock(Number(e.target.value))} required />
      </div>
      <div>
        <Label htmlFor="edit-price">Price</Label>
        <Input id="edit-price" type="number" step="0.01" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
      </div>
      <Button type="submit">Update Part</Button>
    </form>
  )
}