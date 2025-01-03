const { PrismaClient } = require('@prisma/client')
const { hash } = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create default user
  const defaultUser = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@flowback.com',
      password: await hash('123456', 10),
    },
  })

  // Create default organization
  const defaultOrg = await prisma.organization.create({
    data: {
      name: 'FlowBack',
      subdomain: 'flowback',
      title: 'Solicitações de Melhorias',
      subtitle: 'Ajude-nos a melhorar nossa plataforma',
      members: {
        create: {
          userId: defaultUser.id,
          role: 'OWNER',
        },
      },
      logoSettings: {
        create: {
          whiteBackground: true,
          shadow: false,
          borderRadius: false,
        },
      },
      // Create default statuses
      statuses: {
        create: [
          {
            name: 'Sugestões',
            color: '#3b82f6',
            order: 1,
            isDefault: true,
          },
          {
            name: 'Em revisão',
            color: '#f59e0b',
            order: 2,
            isDefault: false,
          },
          {
            name: 'Planejado',
            color: '#8b5cf6',
            order: 3,
            isDefault: false,
          },
          {
            name: 'Em andamento',
            color: '#10b981',
            order: 4,
            isDefault: false,
          },
          {
            name: 'Concluído',
            color: '#6b7280',
            order: 5,
            isDefault: false,
          },
        ],
      },
      // Create default tags
      tags: {
        create: [
          {
            name: 'Bug',
            color: '#ef4444',
          },
          {
            name: 'Feature',
            color: '#3b82f6',
          },
          {
            name: 'Improvement',
            color: '#10b981',
          },
        ],
      },
      // Create default project
      projects: {
        create: {
          name: 'Principal',
          description: 'Projeto principal da plataforma',
        },
      },
    },
  })

  console.log({ defaultUser, defaultOrg })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 