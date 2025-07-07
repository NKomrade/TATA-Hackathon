import Header from '@/components/layout/Header';
import { Brain, Database, MessageSquare, Users, Zap, Shield } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Responses',
      description: 'Advanced natural language processing to understand and respond to your queries accurately.'
    },
    {
      icon: Database,
      title: 'Knowledge Graph',
      description: 'Comprehensive graph database storing interconnected information for contextual responses.'
    },
    {
      icon: MessageSquare,
      title: 'Interactive Chat',
      description: 'Intuitive chat interface for seamless communication with our AI assistant.'
    },
    {
      icon: Users,
      title: 'Multi-User Support',
      description: 'Designed to handle multiple users simultaneously with personalized experiences.'
    },
    {
      icon: Zap,
      title: 'Fast Performance',
      description: 'Optimized for speed with sub-second response times and efficient query processing.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built with security best practices and reliable infrastructure for consistent service.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-blue-100 rounded-full">
              <Brain className="w-12 h-12 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            About AI Help Bot
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Our AI Help Bot leverages advanced knowledge graph technology to provide 
            intelligent, contextual responses to your questions. Built for accuracy, 
            speed, and user experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-slate-200 p-6 hover:shadow-xl transition-shadow">
              <div className="p-3 bg-blue-100 rounded-full w-fit mb-4">
                <feature.icon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Frontend</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Next.js 13+ with App Router</li>
                <li>• TypeScript for type safety</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Shadcn/ui component library</li>
                <li>• Lucide React icons</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Backend</h3>
              <ul className="space-y-2 text-slate-600">
                <li>• Knowledge Graph Database</li>
                <li>• Natural Language Processing</li>
                <li>• RESTful API Architecture</li>
                <li>• Real-time Query Processing</li>
                <li>• Automated Graph Updates</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {[
            { value: '1,247', label: 'Knowledge Entities' },
            { value: '3,891', label: 'Connected Relationships' },
            { value: '96.2%', label: 'Accuracy Rate' },
            { value: '0.8s', label: 'Average Response Time' }
          ].map((stat, index) => (
            <div key={index} className="text-center bg-white rounded-lg shadow-lg border border-slate-200 p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-slate-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AboutPage;