"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Battery, TrendingUp, Recycle, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  const features = [
    {
      icon: Battery,
      title: "Battery Analytics",
      description: "Comprehensive analysis of battery health and performance metrics"
    },
    {
      icon: TrendingUp,
      title: "Predictive Modeling",
      description: "AI-powered predictions for capacity degradation and remaining useful life"
    },
    {
      icon: Recycle,
      title: "Reuse Recommendations",
      description: "Smart recommendations for second-life applications and circular economy"
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Deep insights with hybrid digital twin technology"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Battery Digital Twin
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Advanced battery lifecycle management with AI-powered analytics, 
            predictive modeling, and smart reuse recommendations for sustainable mobility.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-4">
              Launch Dashboard
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <feature.icon className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Demo Section */}
        <Card className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Experience the Future of Battery Management</h2>
          <p className="text-gray-600 mb-6">
            Built for the Tata InnoVent 2025-26 hackathon - Digital twins for battery ageing and reuse modeling
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/dashboard">
              <Button size="lg">Explore Dashboard</Button>
            </Link>
            <Link href="/dashboard/analytics">
              <Button variant="outline" size="lg">View Analytics</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
