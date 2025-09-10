import React from "react";
import { Battery, TrendingUp, Recycle, Database } from "lucide-react";

const sidebarOptions = [
  {
    label: "Battery Analytics",
    href: "/dashboard/analytics",
    icon: <Battery className="h-6 w-6" />,
    activeColor: "linear-gradient(135deg, #10a37f, #0ea46f)",
  },
  {
    label: "Predictions",
    href: "/dashboard/predictions",
    icon: <TrendingUp className="h-6 w-6" />,
    activeColor: "linear-gradient(135deg, #3b82f6, #06b6d4)",
  },
  {
    label: "Reuse Recommendations",
    href: "/dashboard/reuse",
    icon: <Recycle className="h-6 w-6" />,
    activeColor: "linear-gradient(135deg, #f59e42, #fbbf24)",
  },
  {
    label: "Data Management",
    href: "/dashboard/data",
    icon: <Database className="h-6 w-6" />,
    activeColor: "linear-gradient(135deg, #6366f1, #818cf8)",
  },
];

// Enhanced floating sidebar matching the battery dashboard theme
const sidebar: React.FC = () => {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "20px",
        transform: "translateY(-50%)", // Centers vertically
        width: "64px",
        height: "280px",
        background: "rgba(30, 41, 59, 0.5)", // slate-800/50 equivalent
        backdropFilter: "blur(12px)", // Glass effect
        borderRadius: "20px",
        border: "1px solid rgba(71, 85, 105, 0.5)", // slate-600/50 equivalent
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 1000,
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(0, 0, 0, 0.15)",
        padding: "16px 0",
      }}
    >
      {sidebarOptions.map((opt, i) => (
        <a
          key={opt.label}
          href={opt.href}
          title={opt.label}
          style={{
            textDecoration: "none",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: i === 0 ? opt.activeColor : "rgba(51, 65, 85, 0.6)",
            border: i === 0 ? "2px solid rgba(16, 163, 127, 0.8)" : "1px solid rgba(71, 85, 105, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "600",
            fontSize: "16px",
            cursor: "pointer",
            outline: "none",
            margin: "8px 0",
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {opt.icon}
        </a>
      ))}
      
      {/* Background pattern overlay matching dashboard */}
      <div 
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPgo8cGF0aCBkPSJtIDYwIDAgTCAwIDYwIE0gMCAyMCBMIDIwIDAgTSA0MCA2MCBMIDY0IDQwIiBzdHJva2U9IiMxZTI5M2IiIHN0cm9rZS13aWR0aD0iMC41IiBmaWxsPSJub25lIiBvcGFjaXR5PSIwLjEiLz4KPC9wYXR0ZXJuPgo8L2RlZnM+CjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz4KPHN2Zz4=')`,
          opacity: 0.1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default sidebar;
