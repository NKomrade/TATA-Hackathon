import { ReactNode } from "react";
import { Header } from "./Header";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
