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

// "use client";
// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Battery, TrendingUp, Recycle, BarChart3, ArrowRight, Zap, Shield, Brain, Cpu } from "lucide-react";
// import Link from "next/link";

// export default function HomePage() {
//   const [isVisible, setIsVisible] = useState(false);
//   const [batteryLevel, setBatteryLevel] = useState(85);

//   useEffect(() => {
//     setIsVisible(true);
//     const interval = setInterval(() => {
//       setBatteryLevel(prev => prev === 85 ? 92 : 85);
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const features = [
//     {
//       icon: Brain,
//       title: "AI-Powered Intelligence",
//       description: "Advanced machine learning algorithms predict battery behavior with 99% accuracy",
//       color: "from-purple-500 to-pink-500"
//     },
//     {
//       icon: TrendingUp,
//       title: "Predictive Analytics",
//       description: "Forecast degradation patterns and optimize performance for maximum lifespan",
//       color: "from-blue-500 to-cyan-500"
//     },
//     {
//       icon: Recycle,
//       title: "Circular Economy",
//       description: "Smart recommendations for second-life applications and sustainable reuse",
//       color: "from-green-500 to-emerald-500"
//     },
//     {
//       icon: Shield,
//       title: "Real-time Monitoring",
//       description: "Continuous health monitoring with instant alerts and safety protocols",
//       color: "from-orange-500 to-red-500"
//     }
//   ];

//   const stats = [
//     { value: "99%", label: "Prediction Accuracy" },
//     { value: "40%", label: "Extended Battery Life" },
//     { value: "60%", label: "Cost Reduction" },
//     { value: "85%", label: "Waste Prevention" }
//   ];

//   return (
//     <div className="min-h-screen bg-black text-white overflow-hidden">
//       {/* Animated Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>
//         <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400 opacity-20 blur-[100px]"></div>
//       </div>

//       <div className="relative z-10">
//         {/* Navigation */}
//         <nav className="flex justify-between items-center p-6 max-w-7xl mx-auto">
//           <div className="flex items-center space-x-2">
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <Cpu className="w-5 h-5 text-white" />
//             </div>
//             <span className="text-xl font-bold">BatteryTwin</span>
//           </div>
//           <div className="hidden md:flex space-x-8 text-gray-300">
//             <Link href="#features" className="hover:text-white transition-colors">Features</Link>
//             <Link href="#analytics" className="hover:text-white transition-colors">Analytics</Link>
//             <Link href="#about" className="hover:text-white transition-colors">About</Link>
//           </div>
//         </nav>

//         {/* Hero Section */}
//         <div className={`max-w-7xl mx-auto px-6 py-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
//           <div className="grid lg:grid-cols-2 gap-12 items-center">
//             <div>
//               <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
//                 <Zap className="w-4 h-4 mr-2" />
//                 Tata InnoVent 2025-26 Finalist
//               </div>
//               <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent leading-tight">
//                 The Future of
//                 <br />
//                 <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
//                   Battery Intelligence
//                 </span>
//               </h1>
//               <p className="text-xl text-gray-300 mb-8 leading-relaxed">
//                 Revolutionary digital twin technology that transforms battery lifecycle management through AI-powered analytics, predictive modeling, and intelligent reuse strategies.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 <Link href="/dashboard">
//                   <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg group">
//                   Launch Dashboard
//                   <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                   </Button>
//                 </Link>
//                 <Button variant="outline" size="lg" className="border-gray-600 px-8 py-4 text-lg text-black">
//                   View Demo
//                 </Button>
//               </div>
//             </div>

//             {/* Interactive Battery Visual */}
//             <div className="relative">
//               <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>
//               <Card className="relative bg-gray-900/50 border-gray-700 p-8 backdrop-blur-sm">
//                 <div className="text-center mb-6">
//                   <h3 className="text-2xl font-bold mb-2">Live Battery Twin</h3>
//                   <p className="text-gray-400">Real-time digital representation</p>
//                 </div>
                
//                 {/* Battery Visualization */}
//                 <div className="relative mx-auto w-32 h-64 border-4 border-gray-600 rounded-lg bg-gray-800">
//                   <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 w-8 h-4 bg-gray-600 rounded-t"></div>
//                   <div 
//                     className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t transition-all duration-1000 rounded-md ${
//                       batteryLevel > 80 ? 'from-green-500 to-green-400' : 'from-yellow-500 to-yellow-400'
//                     }`}
//                     style={{ height: `${batteryLevel}%` }}
//                   ></div>
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <span className="text-2xl font-bold text-white drop-shadow-lg">
//                       {batteryLevel}%
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6 space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Health Score</span>
//                     <span className="text-green-400 font-semibold">Excellent</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Cycles</span>
//                     <span className="text-white">1,247 / 3,000</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Temperature</span>
//                     <span className="text-blue-400">23°C</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-400">Predicted Life</span>
//                     <span className="text-purple-400">2.3 years</span>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           </div>
//         </div>

//         {/* Stats Section */}
//         <div className="max-w-7xl mx-auto px-6 py-16">
//           <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//             {stats.map((stat, index) => (
//               <div key={index} className="text-center">
//                 <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
//                   {stat.value}
//                 </div>
//                 <div className="text-gray-400">{stat.label}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Features Section */}
//         <div id="features" className="max-w-7xl mx-auto px-6 py-20">
//           <div className="text-center mb-16">
//             <h2 className="text-4xl font-bold mb-4">Revolutionary Capabilities</h2>
//             <p className="text-xl text-gray-400 max-w-2xl mx-auto">
//               Harness the power of digital twins and AI to transform how batteries are monitored, analyzed, and reused.
//             </p>
//           </div>

//           <div className="grid md:grid-cols-2 gap-8">
//             {features.map((feature, index) => (
//               <Card 
//                 key={index} 
//                 className="group bg-gray-900/50 border-gray-800 p-8 hover:bg-gray-800/50 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
//               >
//                 <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mb-6 group-hover:scale-110 transition-transform`}>
//                   <feature.icon className="w-8 h-8 text-white" />
//                 </div>
//                 <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors">
//                   {feature.title}
//                 </h3>
//                 <p className="text-gray-400 leading-relaxed">
//                   {feature.description}
//                 </p>
//               </Card>
//             ))}
//           </div>
//         </div>

//         {/* Technology Showcase */}
//         <div className="max-w-7xl mx-auto px-6 py-20">
//           <Card className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 border-gray-700 p-12 backdrop-blur-sm">
//             <div className="grid lg:grid-cols-2 gap-12 items-center">
//               <div>
//                 <h2 className="text-4xl font-bold mb-6">
//                   Hybrid Digital Twin Technology
//                 </h2>
//                 <p className="text-gray-300 text-lg mb-6 leading-relaxed">
//                   Our proprietary platform combines physics-based modeling with machine learning to create the most accurate battery digital twins in the industry.
//                 </p>
//                 <ul className="space-y-4 text-gray-300">
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-blue-500 rounded-full mr-4"></div>
//                     Real-time state estimation and health monitoring
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-purple-500 rounded-full mr-4"></div>
//                     Capacity fade and resistance growth prediction
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-green-500 rounded-full mr-4"></div>
//                     Second-life application optimization
//                   </li>
//                   <li className="flex items-center">
//                     <div className="w-2 h-2 bg-orange-500 rounded-full mr-4"></div>
//                     Circular economy integration
//                   </li>
//                 </ul>
//               </div>
              
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl blur-xl"></div>
//                 <div className="relative bg-gray-900/80 rounded-2xl p-8 border border-gray-700">
//                   <div className="flex items-center justify-between mb-6">
//                     <h4 className="text-xl font-semibold">System Overview</h4>
//                     <div className="flex space-x-2">
//                       <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
//                       <span className="text-green-400 text-sm">Live</span>
//                     </div>
//                   </div>
                  
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Active Batteries</span>
//                       <span className="text-2xl font-bold text-blue-400">2,847</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Data Points/sec</span>
//                       <span className="text-2xl font-bold text-purple-400">15.2K</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">ML Models</span>
//                       <span className="text-2xl font-bold text-green-400">24</span>
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <span className="text-gray-300">Accuracy</span>
//                       <span className="text-2xl font-bold text-orange-400">99.2%</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//         {/* Floating Elements */}
//         <div className="fixed top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
//         <div className="fixed bottom-20 right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
//         <div className="fixed top-1/2 left-1/4 w-24 h-24 bg-green-500/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
//       </div>
//     </div>
//   );
// }