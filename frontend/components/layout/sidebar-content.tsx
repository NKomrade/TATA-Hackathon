"use client";
import { ReactNode } from "react";

interface SidebarContentProps {
  children: ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
