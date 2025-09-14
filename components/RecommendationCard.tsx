
import React from 'react';

interface RecommendationCardProps {
  title: string;
  items: string[];
  icon: JSX.Element;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ title, items, icon }) => {
  return (
    <div className="bg-slate-50 rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold text-brand-dark flex items-center mb-3">
        {icon}
        <span className="ml-2">{title}</span>
      </h3>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default RecommendationCard;
