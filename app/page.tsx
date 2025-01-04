'use client'

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2 } from 'lucide-react'
import { FeedbackCard } from "@/components/feedback-card"
import { useFeedbacks } from "@/hooks/use-feedbacks"
import { useOrganization } from "@/hooks/use-organization"
import { NewFeedbackDialog } from "@/components/new-feedback-dialog"
import { CreateFeedbackButton } from "@/components/create-feedback-button"
import { CreateFeedbackDialog } from "@/components/create-feedback-dialog" 

export default function FeedbackPage() {
  const { organization } = useOrganization()
  const { feedbacks, isLoading, voteFeedback } = useFeedbacks()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-lg">Loading feedbacks...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            {organization?.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {organization?.subtitle}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-2">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="w-full justify-start h-11 bg-transparent">
              {organization?.statuses.map((status) => (
                <TabsTrigger 
                  key={status.id}
                  value={status.name.toLowerCase()} 
                  className="data-[state=active]:bg-primary/5"
                >
                  {status.name}
                  <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                    {feedbacks?.filter(f => f.status.id === status.id).length || 0}
                  </span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Search and New Button */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input className="pl-10" placeholder="Buscar sugestões..." />
          </div>
          {organization && <NewFeedbackDialog organization={organization} />}
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4">
          {feedbacks?.map((feedback) => (
            <FeedbackCard 
              key={feedback.id}
              id={feedback.id}
              votes={feedback.votes}
              title={feedback.title}
              description={feedback.description}
              tags={feedback.tags.map(tag => tag.name)}
              commentCount={feedback._count.comments}
              onVote={() => voteFeedback(feedback.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

