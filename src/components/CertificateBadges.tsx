import React from 'react';
import { Award, ShieldCheck, Leaf } from 'lucide-react';

interface CertificateBadgesProps {
  className?: string;
  variant?: 'default' | 'compact';
}

const CertificateBadges: React.FC<CertificateBadgesProps> = ({ 
  className = '', 
  variant = 'default' 
}) => {
  const badges = [
    {
      name: 'FSSAI',
      fullName: 'FSSAI Certified',
      icon: ShieldCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      description: 'Food Safety & Standards Authority of India'
    },
    {
      name: 'FDA',
      fullName: 'FDA Approved',
      icon: Award,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      description: 'US Food & Drug Administration'
    },
    {
      name: 'AYUSH',
      fullName: 'AYUSH Certified',
      icon: Leaf,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      description: 'Ministry of AYUSH, Government of India'
    }
  ];

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {badges.map((badge, idx) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.name}
              className={`inline-flex items-center gap-1.5 rounded-full ${badge.bgColor} ${badge.borderColor} border px-2.5 py-1 text-[9px] sm:text-[10px] font-semibold ${badge.color} transition-all duration-300 hover:scale-105`}
              title={badge.description}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{badge.name}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 ${className}`}>
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.name}
            className={`group relative inline-flex items-center gap-2 rounded-xl ${badge.bgColor} ${badge.borderColor} border px-3 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
            title={badge.description}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg ${badge.bgColor} ${badge.borderColor} border`}>
              <Icon className={`h-4 w-4 ${badge.color}`} />
            </div>
            <div className="flex flex-col">
              <span className={`text-xs font-bold ${badge.color}`}>{badge.name}</span>
              <span className="text-[10px] text-slate-600 leading-tight">{badge.fullName}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CertificateBadges;

