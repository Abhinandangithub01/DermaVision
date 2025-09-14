
import React from 'react';
import { SkinAnalysis, SkinIssue } from '../types';
import RecommendationCard from './RecommendationCard';

interface AnalysisResultProps {
  result: SkinAnalysis;
}

const FoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-9-5.747h18" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M5.536 5.536A9 9 0 0118.465 18.464M18.464 5.536A9 9 0 015.536 18.464" />
  </svg>
);

const MedicineIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 20.5a.5.5 0 00.5.5h2a.5.5 0 00.5-.5v-2.09a1.5 1.5 0 01.326-2.613l1.832-.814a1.5 1.5 0 00.82-2.176l-1.04-1.89a1.5 1.5 0 00-2.094-.68l-1.85.823a1.5 1.5 0 01-1.99 0l-1.85-.823a1.5 1.5 0 00-2.094.68l-1.04 1.89a1.5 1.5 0 00.82 2.176l1.832.814A1.5 1.5 0 018.5 18.41V20.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2m0 16.5v-2" />
  </svg>
);


const AnalysisResult: React.FC<AnalysisResultProps> = ({ result }) => {
  return (
    <div className="w-full h-full overflow-y-auto pr-2">
      <h2 className="text-2xl font-bold text-brand-dark mb-4">Analysis Results</h2>
       {result.length === 0 ? (
         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
            <p className="font-bold">No Issues Detected</p>
            <p>The AI did not detect any specific issues. Your skin appears to be clear. Remember to maintain a healthy lifestyle.</p>
        </div>
       ) : (
        <div className="space-y-6">
            {result.map((issue: SkinIssue, index: number) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-blue mb-2">{issue.issue}</h3>
                <p className="text-gray-600 mb-4">{issue.description}</p>
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
