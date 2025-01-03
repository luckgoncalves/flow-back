import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { content } = await request.json()
    
    const comment = await prisma.comment.create({
      data: {
        content,
        feedbackId: params.id,
      }
    })

    return NextResponse.json(comment)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 