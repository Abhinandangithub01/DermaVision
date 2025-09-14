import React from 'react';
import { SkinAnalysis, SkinIssue } from '../types';
import RecommendationCard from './RecommendationCard';

interface AnalysisResultProps {
  result: SkinAnalysis;
}

const FoodIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.993.883L4 8v10a1 1 0 001 1h10a1 1 0 001-1V8a1 1 0 00-1-1h-1V6a4 4 0 00-4-4zM8.5 6a1.5 1.5 0 113 0V7h-3V6z" />
    </svg>
);

const MedicineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-500" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414L9 9.414V12a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414l-3-3z" clipRule="evenodd" />
  </svg>
);


const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="w-full h-full overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-text-primary mb-4">Analysis Results</h2>
       {result.length === 0 ? (
         <div className="bg-amber-50 border-l-4 border-amber-400 text-amber-800 p-4 rounded-r-lg" role="alert">
            <p className="font-bold">No Issues Detected</p>
            <p>The AI did not detect any specific issues. Your skin appears to be clear. Remember to maintain a healthy lifestyle.</p>
        </div>
       ) : (
        <div className="space-y-6">
            {result.map((issue: SkinIssue, index: number) => (
            <div key={index} className="bg-surface p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-bold text-primary mb-2">{issue.issue}</h3>
                <p className="text-text-secondary mb-4">{issue.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecommendationCard title="Food Recommendations" items={issue.food_recommendations} icon={<FoodIcon />} />
                <RecommendationCard title="Medicine Recommendations" items={issue.medicine_recommendations} icon={<MedicineIcon />} />
                </div>
            </div>
            ))}
        </div>
       )}
    </div>
  );
};

export default AnalysisResult;