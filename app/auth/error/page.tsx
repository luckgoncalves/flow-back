"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: 
      "Este email já está registrado com outro método de login. Por favor, faça login usando o método original.",
    default: "Ocorreu um erro durante a autenticação.",
  };

  const message = errorMessages[error as string] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold text-red-600">Erro de Autenticação</h2>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600">{message}</p>
        </div>

        <div className="flex justify-center">
          <Link
            href="/auth/login"
            className="text-indigo-600 hover:text-indigo-500"
          >
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  );
} 