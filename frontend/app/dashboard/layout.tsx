"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/lib/sidebar-config";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full bg-gray-50">
        <div className="flex-1 flex flex-col min-w-0 ml-[70px]">
          <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
            <div className="p-6">
              <div className="max-w-7xl mx-auto">{children}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2 overflow-hidden">
              {sidebarLinks.map((link, idx) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/dashboard" && pathname.startsWith(link.href));

                return (
                  <SidebarLink
                    key={idx}
                    link={link}
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                        : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  />
                );
              })}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col min-w-0 ml-[70px]">
        <div className="flex-1 overflow-auto bg-white dark:bg-neutral-900">
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
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
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
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        TATA Battery AI
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/rotatedbattery.svg"
        alt="Battery Logo"
        width={44}
        height={44}
        className="shrink-0"
      />
    </a>
  );
};
