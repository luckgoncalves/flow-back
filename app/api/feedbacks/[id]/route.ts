import { prisma } from "../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: { id: params.id },
      include: {
        status: true,
        tags: true,
        comments: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            comments: true
          }
        }
      }
    })

    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(feedback)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const feedback = await prisma.feedback.update({
      where: { id: params.id },
      data: {
        statusId: data.statusId
      },
      include: {
        status: true,
        tags: true,
        comments: true,
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