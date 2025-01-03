import { prisma } from "../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        status: true,
        tags: true,
        _count: {
          select: {
            comments: true
          }
        }
      },
      orderBy: {
        votes: 'desc'
      }
    })

    return NextResponse.json(feedbacks)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const feedback = await prisma.feedback.create({
      data: {
        title: data.title,
        description: data.description,
        organizationId: data.organizationId,
        projectId: data.projectId,
        statusId: data.statusId,
        tags: {
          connect: data.tagIds.map((id: string) => ({ id }))
        }
      },
      include: {
        status: true,
        tags: true,
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    return NextResponse.json(feedback)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 