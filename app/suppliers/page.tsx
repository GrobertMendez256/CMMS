"use client"
import React from 'react'
import Sidebar from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Filter, Plus, Search, Edit, Trash2 } from 'lucide-react'

type Supplier = {
  id: string
  name: string
  category: string
  contactPerson: string
  email: string
  phone: string
  address: string
  rating: number
}

const sampleSuppliers: Supplier[] = [
  { id: 'SUP-001', name: 'ABC Manufacturing', category: 'Mechanical Parts', contactPerson: 'John Doe', email: 'john@abcmfg.com', phone: '123-456-7890', address: '123 Main St, Anytown, USA', rating: 4.5 },
  { id: 'SUP-002', name: 'XYZ Electronics', category: 'Electrical Components', contactPerson: 'Jane Smith', email: 'jane@xyzelectronics.com', phone: '987-654-3210', address: '456 Oak Ave, Somewhere, USA', rating: 4.2 },
  { id: 'SUP-003', name: 'FluidTech Solutions', category: 'Hydraulic Systems', contactPerson: 'Bob Johnson', email: 'bob@fluidtech.com', phone: '456-789-0123', address: '789 Pine Rd, Nowhere, USA', rating: 3.8 },
  { id: 'SUP-004', name: 'Global Tools Inc.', category: 'Tools and Equipment', contactPerson: 'Alice Brown', email: 'alice@globaltools.com', phone: '321-654-0987', address: '159 Elm St, Everywhere, USA', rating: 4.7 },
  { id: 'SUP-005', name: 'SafetyFirst Gear', category: 'Safety Equipment', contactPerson: 'Charlie Wilson', email: 'charlie@safetyfirst.com', phone: '741-852-9630', address: '357 Cedar Ln, Anywhere, USA', rating: 4.9 },
]

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = React.useState<Supplier[]>(sampleSuppliers)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [categoryFilter, setCategoryFilter] = React.useState<string | undefined>()
  const [sortConfig, setSortConfig] = React.useState<{ key: keyof Supplier; direction: 'ascending' | 'descending' } | null>(null)

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleCategoryFilter = (value: string) => {
    setCategoryFilter(value === 'All' ? undefined : value)
  }

  const handleSort = (key: keyof Supplier) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  const filteredAndSortedSuppliers = React.useMemo(() => {
    let result = [...suppliers]

    if (searchTerm) {
      result = result.filter(supplier => 
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      result = result.filter(supplier => supplier.category === categoryFilter)
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
  }, [suppliers, searchTerm, categoryFilter, sortConfig])

  const handleCreateSupplier = (newSupplier: Omit<Supplier, 'id'>) => {
    const id = `SUP-${(suppliers.length + 1).toString().padStart(3, '0')}`
    setSuppliers([...suppliers, { ...newSupplier, id }])
  }

  const handleEditSupplier = (updatedSupplier: Supplier) => {
    setSuppliers(suppliers.map(supplier => supplier.id === updatedSupplier.id ? updatedSupplier : supplier))
  }

  const handleDeleteSupplier = (supplierId: string) => {
    setSuppliers(suppliers.filter(supplier => supplier.id !== supplierId))
  }

  return (
    <div className='flex'>
      <div className='w-1/4'>
      <Sidebar />  
      </div>
      
    <div className="container mx-auto py-10 w-3/4">    
      <h1 className="text-2xl font-bold mb-5">Suppliers</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Search suppliers..."
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
              <SelectItem value="Mechanical Parts">Mechanical Parts</SelectItem>
              <SelectItem value="Electrical Components">Electrical Components</SelectItem>
              <SelectItem value="Hydraulic Systems">Hydraulic Systems</SelectItem>
              <SelectItem value="Tools and Equipment">Tools and Equipment</SelectItem>
              <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Add Supplier</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
            </DialogHeader>
            <CreateSupplierForm onSubmit={handleCreateSupplier} />
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
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>
              Rating
              <Button variant="ghost" size="sm" className="ml-2" onClick={() => handleSort('rating')}>
                {sortConfig?.key === 'rating' ? (
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
          {filteredAndSortedSuppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.id}</TableCell>
              <TableCell>{supplier.name}</TableCell>
              <TableCell>{supplier.category}</TableCell>
              <TableCell>{supplier.contactPerson}</TableCell>
              <TableCell>{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.rating.toFixed(1)}</TableCell>
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
                      <EditSupplierForm supplier={supplier} onSubmit={handleEditSupplier} />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteSupplier(supplier.id)}><Trash2 className="h-4 w-4" /></Button>
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

interface CreateSupplierFormProps {
  onSubmit: (supplier: Omit<Supplier, 'id'>) => void
}

function CreateSupplierForm({ onSubmit }: CreateSupplierFormProps) {
  const [name, setName] = React.useState('')
  const [category, setCategory] = React.useState('')
  const [contactPerson, setContactPerson] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [address, setAddress] = React.useState('')
  const [rating, setRating] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category && contactPerson && email && phone && address && rating) {
      onSubmit({
        name,
        category,
        contactPerson,
        email,
        phone,
        address,
        rating: parseFloat(rating)
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
            <SelectItem value="Mechanical Parts">Mechanical Parts</SelectItem>
            <SelectItem value="Electrical Components">Electrical Components</SelectItem>
            <SelectItem value="Hydraulic Systems">Hydraulic Systems</SelectItem>
            <SelectItem value="Tools and Equipment">Tools and Equipment</SelectItem>
            <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="contactPerson">Contact Person</Label>
        <Input id="contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="rating">Rating</Label>
        <Input id="rating" type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} required />
      </div>
      <Button type="submit">Add Supplier</Button>
    </form>
  )
}

interface EditSupplierFormProps {
  supplier: Supplier
  onSubmit: (supplier: Supplier) => void
}

function EditSupplierForm({ supplier, onSubmit }: EditSupplierFormProps) {
  const [name, setName] = React.useState(supplier.name)
  const [category, setCategory] = React.useState(supplier.category)
  const [contactPerson, setContactPerson] = React.useState(supplier.contactPerson)
  const [email, setEmail] = React.useState(supplier.email)
  const [phone, setPhone] = React.useState(supplier.phone)
  const [address, setAddress] = React.useState(supplier.address)
  const [rating, setRating] = React.useState(supplier.rating)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && category && contactPerson && email && phone && address && rating) {
      onSubmit({
        ...supplier,
        name,
        category,
        contactPerson,
        email,
        phone,
        address,
        rating
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
            <SelectItem value="Mechanical Parts">Mechanical Parts</SelectItem>
            <SelectItem value="Electrical Components">Electrical Components</SelectItem>
            <SelectItem value="Hydraulic Systems">Hydraulic Systems</SelectItem>
            <SelectItem value="Tools and Equipment">Tools and Equipment</SelectItem>
            <SelectItem value="Safety Equipment">Safety Equipment</SelectItem>            
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="edit-contactPerson">Contact Person</Label>
        <Input id="edit-contactPerson" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-email">Email</Label>
        <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-phone">Phone</Label>
        <Input id="edit-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-address">Address</Label>
        <Input id="edit-address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="edit-rating">Rating</Label>
        <Input id="edit-rating" type="number" min="0" max="5" step="0.1" value={rating} onChange={(e) => setRating(Number(e.target.value))} required />
      </div>
      <Button type="submit">Update Supplier</Button>
    </form>
  )
}