'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  change: string;
  changeType: 'positive' | 'negative';
}

const MetricCard = ({ title, value, icon: Icon, color, change, changeType }: MetricCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
    emerald: 'bg-emerald-100 text-emerald-600'
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 p-6 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-2xl ${colorClasses[color as keyof typeof colorClasses]} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          changeType === 'positive' ? 'text-green-600' : 'text-red-600'
        }`}>
          {changeType === 'positive' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{change}</span>
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-slate-800 mb-1 group-hover:text-slate-900 transition-colors">{value}</h3>
        <p className="text-slate-600 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
};

export default MetricCard;