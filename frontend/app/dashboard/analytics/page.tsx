"use client";
import React, { useState } from "react";
import Header from "@/components/dashboard/Battery Analytics/header";
import Analytics from "@/components/dashboard/Battery Analytics/analytics";
import Rul from "@/components/dashboard/Battery Analytics/rul";
import Reuse from "@/components/dashboard/Battery Analytics/reuse";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("analytics");

  let content = null;
  if (activeTab === "analytics") content = <Analytics />;
  else if (activeTab === "rul") content = <Rul />;
  else if (activeTab === "reuse") content = <Reuse />;

  return (
    <div className="w-full min-h-full space-y-6">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full">{content}</div>
    </div>
  );
}
