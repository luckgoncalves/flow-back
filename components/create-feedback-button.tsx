"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

export function CreateFeedbackButton() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <Button className="gap-2">
      <PlusIcon size={16} />
      Criar Feedback
    </Button>
  );
} 