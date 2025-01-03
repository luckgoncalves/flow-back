import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from "@/hooks/use-toast"

interface Organization {
  id: string
  name: string
  subdomain: string
  title: string
  subtitle?: string
  logoSettings: {
    whiteBackground: boolean
    shadow: boolean
    borderRadius: boolean
  }
  statuses: Array<{
    id: string
    name: string
    isDefault: boolean
  }>
  projects: Array<{
    id: string
    name: string
  }>
  tags: Array<{
    id: string
    name: string
  }>
}

export function useOrganization() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: organization, isLoading } = useQuery<Organization>({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch organization')
      }
      return response.json()
    }
  })

  const { mutate: updateOrganization, isPending: isUpdating } = useMutation({
    mutationFn: async (data: Organization) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        throw new Error('Failed to update organization')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Settings saved successfully",
      })
      queryClient.invalidateQueries({ queryKey: ['organization'] })
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save settings",
      })
    }
  })

  return {
    organization,
    isLoading,
    isUpdating,
    updateOrganization
  }
} 