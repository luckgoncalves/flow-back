import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return NextResponse.json(
      { error: "Error fetching feedbacks" },
      { status: 500 }
    );
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