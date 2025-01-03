import { prisma } from "../../../../../lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const feedback = await prisma.feedback.update({
      where: { id: params.id },
      data: {
        votes: {
          increment: 1
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