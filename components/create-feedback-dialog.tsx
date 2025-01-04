"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { CreateFeedbackForm } from "./create-feedback-form";

export function CreateFeedbackDialog() {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon size={16} />
          Criar Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Feedback</DialogTitle>
        </DialogHeader>
        <CreateFeedbackForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
} 