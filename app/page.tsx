"use client"

import React from "react"
import { Button } from "@/components/ui/button"

export default function MainPage() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="space-x-4">
        <Button variant="outline">Sign Up</Button>
        <Button>Log In</Button>
      </div>
    </div>
  )
}
