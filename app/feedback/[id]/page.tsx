'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronUp, MessageSquare, ArrowLeft, Loader2 } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface FeedbackDetails {
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
  comments: Array<{
    id: string
    content: string
    createdAt: string
  }>
  _count: {
    comments: number
  }
}

export default function FeedbackDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [newComment, setNewComment] = useState("")

  const { data: feedback, isLoading } = useQuery<FeedbackDetails>({
    queryKey: ['feedback', params.id],
    queryFn: async () => {
      const response = await fetch(`/api/feedbacks/${params.id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch feedback')
      }
      return response.json()
    }
  })

  const { data: organization } = useQuery({
    queryKey: ['organization'],
    queryFn: async () => {
      const response = await fetch('/api/settings')
      if (!response.ok) {
        throw new Error('Failed to fetch organization')
      }
      return response.json()
    }
  })

  const { mutate: updateStatus } = useMutation({
    mutationFn: async ({ statusId }: { statusId: string }) => {
      const response = await fetch(`/api/feedbacks/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statusId })
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Status updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ['feedback', params.id] })
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update status",
      })
    }
  })

  const { mutate: voteFeedback } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/feedbacks/${params.id}/vote`, {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to vote')
      }
      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback', params.id] })
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

  const { mutate: addComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (content: string) => {
      const response = await fetch(`/api/feedbacks/${params.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content })
      })
      
      if (!response.ok) {
        throw new Error('Failed to add comment')
      }
      
      return response.json()
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
      setNewComment("")
      queryClient.invalidateQueries({ queryKey: ['feedback', params.id] })
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment",
      })
    }
  })

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    addComment(newComment)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    )
  }

  if (!feedback) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold">Feedback not found</h1>
          <Button asChild className="mt-4">
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <Card className="p-6">
          <div className="flex gap-6">
            {/* Vote button */}
            <Button
              variant="ghost"
              className="h-auto flex-col py-2 px-3"
              onClick={() => voteFeedback()}
            >
              <ChevronUp className="h-4 w-4" />
              <span>{feedback.votes}</span>
            </Button>

            {/* Content */}
            <div className="flex-1 space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">{feedback.title}</h1>
                  {organization && (
                    <Select
                      value={feedback.status.id}
                      onValueChange={(value) => updateStatus({ statusId: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent>
                        {organization.statuses.map((status: any) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <p className="text-muted-foreground">{feedback.description}</p>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                {feedback.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: `${tag.color}20`,
                      color: tag.color,
                    }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Comments section */}
              <div className="pt-6 border-t">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <h2 className="font-semibold">
                    Comments ({feedback._count.comments})
                  </h2>
                </div>

                {/* Add comment form */}
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={isAddingComment || !newComment.trim()}
                      >
                        {isAddingComment && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Add Comment
                      </Button>
                    </div>
                  </div>
                </form>

                {/* Comments list */}
                <div className="space-y-4">
                  {feedback.comments.map((comment) => (
                    <Card key={comment.id} className="p-4">
                      <p className="mb-2">{comment.content}</p>
                      <span className="text-sm text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 