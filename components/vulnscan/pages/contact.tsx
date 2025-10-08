"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export function ContactPage() {
  return (
    <section className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold">Contact</h1>
        <p className="text-muted-foreground">{"This form is non-functional (frontend-only)."}</p>
      </div>
      <form
        className="grid gap-4 max-w-lg"
        onSubmit={(e) => {
          e.preventDefault()
          alert("Thanks! This is a demo-only form.")
        }}
      >
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Jane Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="jane@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="msg">Message</Label>
          <Textarea id="msg" placeholder="How can we help?" />
        </div>
        <Button type="submit">Send</Button>
      </form>
    </section>
  )
}
