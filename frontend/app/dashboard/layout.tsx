"use client";
import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJtIDYwIDAgTCAwIDYwIE0gMCAyMCBMIDIwIDAgTSA0MCA2MCBMIDY0IDQwIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-20"></div>
        
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 pl-[90px]">
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJtIDYwIDAgTCAwIDYwIE0gMCAyMCBMIDIwIDAgTSA0MCA2MCBMIDY0IDQwIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')] opacity-20"></div>
      
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 pl-[90px]">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <Image
        src="/rotatedbattery.svg"
        alt="Battery Logo"
        width={48}
        height={48}
        className="shrink-0"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text"
      >
        TATA Battery AI
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
    >
      <Image
        src="/rotatedbattery.svg"
        alt="Battery Logo"
        width={44}
        height={44}
        className="shrink-0"
      />
    </Link>
  );
};
