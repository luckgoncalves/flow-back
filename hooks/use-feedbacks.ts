import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from "@/hooks/use-toast"

interface Feedback {
  id: string
  title: string
  description: string
  votes: number
  status: {
    id: string
    name: string
    color: string
  }
  tags: Array<{
    id: string
    name: string
    color: string
  }>
  _count: {
    comments: number
  }
}

export function useFeedbacks() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: feedbacks, isLoading } = useQuery<Feedback[]>({
    queryKey: ['feedbacks'],
    queryFn: async () => {
      const response = await fetch('/api/feedbacks')
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks')
      }
      return response.json()
    }
  })

  const { mutate: voteFeedback } = useMutation({
    mutationFn: async (feedbackId: string) => {
      const response = await fetch(`/api/feedbacks/${feedbackId}/vote`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to vote')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to vote on feedback",
      })
    }
  })

  return {
    feedbacks,
    isLoading,
    voteFeedback
  }
} 