import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeedbackCardProps {
  id: string
  votes: number
  title: string
  description: string
  tags: string[]
  commentCount: number
  onVote: () => void
}

export function FeedbackCard({
  id,
  votes,
  title,
  description,
  tags,
  commentCount,
  onVote
}: FeedbackCardProps) {
  return (
    <Link href={`/feedback/${id}`}>
      <div className="bg-white rounded-lg shadow-sm border p-6 hover:border-primary/50 transition-colors">
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="h-auto flex-col py-2 px-3"
            onClick={(e) => {
              e.preventDefault()
              onVote()
            }}
          >
            <span>▲</span>
            <span>{votes}</span>
          </Button>
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
            <div className="flex items-center gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-primary/10 text-primary text-sm px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
              <span className="text-muted-foreground text-sm">
                {commentCount} comments
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

