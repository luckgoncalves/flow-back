import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus } from 'lucide-react'
import { FeedbackCard } from "./feedback-card"

export default function FeedbackPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">
            Solicitações de Melhorias na plataforma
          </h1>
          <p className="text-muted-foreground text-lg">
            Junte-se aos nossos parceiros para tornar o Acordo Fechado melhor. Vote em ideias ou sugira novas.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-2">
          <Tabs defaultValue="suggestions" className="w-full">
            <TabsList className="w-full justify-start h-11 bg-transparent">
              <TabsTrigger value="suggestions" className="data-[state=active]:bg-primary/5">
                Sugestões
                <span className="ml-2 bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
                  13
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-progress" className="data-[state=active]:bg-primary/5">
                Em andamento
                <span className="ml-2 bg-green-100 text-green-700 rounded-full px-2 py-0.5 text-xs">
                  2
                </span>
              </TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-primary/5">
                Concluído
                <span className="ml-2 bg-red-100 text-red-700 rounded-full px-2 py-0.5 text-xs">
                  24
                </span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Search and New Button */}
        <div className="flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input className="pl-10" placeholder="Buscar sugestões..." />
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>
        </div>

        {/* Feedback Cards */}
        <div className="space-y-4">
          <FeedbackCard
            votes={11}
            title="EZ SOFT -Plataforma que integra diversos canais de mensagens, incluindo WhatsApp."
            description="Boa tarde! Em razão, da suspensão do envio de mensagens de acordo pe..."
            tags={["Suggested", "Popular 🔥"]}
            commentCount={0}
          />
          <FeedbackCard
            votes={5}
            title="TRAVA PARA CONTRAPROPOSTA"
            description="Gostaria que fosse possível criar uma trava depois tratamos uma contra..."
            tags={["Suggested", "Otimizar", "UX"]}
            commentCount={0}
          />
          <FeedbackCard
            votes={3}
            title="Negocie os seus processos em lote com o Acordo Fechado"
            description="Possibilidade dos advogados acessarem todas as propostas cadastradas em seu nome"
            tags={["Suggested", "Otimizar"]}
            commentCount={0}
          />
        </div>
      </div>
    </div>
  )
}

