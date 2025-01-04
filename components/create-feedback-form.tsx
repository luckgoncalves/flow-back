"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface CreateFeedbackFormProps {
  onSuccess: () => void;
}

export function CreateFeedbackForm({ onSuccess }: CreateFeedbackFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const response = await fetch("/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Falha ao criar feedback");

      toast({
        title: "Sucesso!",
        description: "Feedback criado com sucesso.",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar o feedback.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          {...register("title", { required: true })}
          placeholder="Título"
        />
        {errors.title && (
          <span className="text-sm text-red-500">Título é obrigatório</span>
        )}
      </div>
      
      <div>
        <Textarea
          {...register("description", { required: true })}
          placeholder="Descrição"
        />
        {errors.description && (
          <span className="text-sm text-red-500">Descrição é obrigatória</span>
        )}
      </div>

      <Button type="submit" className="w-full">
        Criar Feedback
      </Button>
    </form>
  );
} 