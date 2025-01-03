import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const organization = await prisma.organization.findFirst({
      include: {
        logoSettings: true,
        statuses: {
          where: {
            isDefault: true
          },
          orderBy: {
            order: 'asc'
          }
        },
        projects: true,
        tags: true
      }
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const organization = await prisma.organization.update({
      where: { id: data.id },
      data: {
        name: data.name,
        title: data.title,
        subtitle: data.subtitle,
        logoSettings: {
          update: {
            whiteBackground: data.logoSettings.whiteBackground,
            shadow: data.logoSettings.shadow,
            borderRadius: data.logoSettings.borderRadius,
          }
        },
        statuses: {
          updateMany: data.statuses.map((status: any) => ({
            where: { id: status.id },
            data: {
              name: status.name,
              isDefault: status.isDefault,
            }
          }))
        }
      },
      include: {
        logoSettings: true,
        statuses: true
      }
    })

    return NextResponse.json(organization)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
} 