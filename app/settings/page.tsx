'use client'

import { useOrganization } from "@/hooks/use-organization"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card } from "@/components/ui/card"
import { Upload, Loader2 } from 'lucide-react'
import { useState, useEffect } from "react"

export default function SettingsPage() {
  const { organization, isLoading, isUpdating, updateOrganization } = useOrganization()
  const [formData, setFormData] = useState<any>(null)

  useEffect(() => {
    if (organization) {
      setFormData(organization)
    }
  }, [organization])

  if (isLoading || !formData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Loading settings...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateOrganization(formData)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <form onSubmit={handleSubmit}>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Page Settings</h1>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>

          <Card className="p-6 space-y-8">
            {/* Basic Information */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">Your page's name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subdomain">Subdomain</Label>
                <Input 
                  id="subdomain" 
                  value={formData.subdomain}
                  disabled
                />
                <p className="text-sm text-muted-foreground">Can't be changed</p>
              </div>
            </div>

            {/* Title and Subtitle */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input 
                  id="title" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">The title displayed on your page</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input 
                  id="subtitle" 
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                />
                <p className="text-sm text-muted-foreground">Displayed under the title</p>
              </div>
            </div>

            {/* Feature Status */}
            <div className="space-y-4">
              <div>
                <Label>Feature Status</Label>
                <p className="text-sm text-muted-foreground">Choose which status to display and use custom labels if you wish</p>
              </div>
              
              <div className="space-y-4">
                {formData.statuses.map((status: any, index: number) => (
                  <div key={status.id} className="flex items-center gap-4">
                    <Checkbox 
                      checked={status.isDefault}
                      onCheckedChange={(checked) => {
                        const newStatuses = [...formData.statuses]
                        newStatuses[index] = { ...status, isDefault: checked }
                        setFormData({ ...formData, statuses: newStatuses })
                      }}
                    />
                    <Input 
                      value={status.name}
                      onChange={(e) => {
                        const newStatuses = [...formData.statuses]
                        newStatuses[index] = { ...status, name: e.target.value }
                        setFormData({ ...formData, statuses: newStatuses })
                      }}
                      className="max-w-[300px]" 
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Logo Settings */}
            <div className="space-y-4">
              <div>
                <Label>Logo</Label>
                <p className="text-sm text-muted-foreground">Your companies logo (optional)</p>
              </div>

              <div className="space-y-4">
                <Button type="button" variant="outline" className="w-32">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="white-bg" 
                      checked={formData.logoSettings?.whiteBackground}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          logoSettings: {
                            ...formData.logoSettings,
                            whiteBackground: checked
                          }
                        })
                      }}
                    />
                    <Label htmlFor="white-bg">White Background</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="shadow"
                      checked={formData.logoSettings?.shadow}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          logoSettings: {
                            ...formData.logoSettings,
                            shadow: checked
                          }
                        })
                      }}
                    />
                    <Label htmlFor="shadow">Shadow</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="border-radius"
                      checked={formData.logoSettings?.borderRadius}
                      onCheckedChange={(checked) => {
                        setFormData({
                          ...formData,
                          logoSettings: {
                            ...formData.logoSettings,
                            borderRadius: checked
                          }
                        })
                      }}
                    />
                    <Label htmlFor="border-radius">Border Radius</Label>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </form>
    </div>
  )
} 