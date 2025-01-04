"use client";

import React from "react";
import { useSession } from "next-auth/react";

export function UserInfo() {
  const { data: session } = useSession();

  if (!session?.user) return null;

  return (
    <div>
      <p>Olá, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
    </div>
  );
} 