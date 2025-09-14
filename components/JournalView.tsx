import React, { useState } from 'react';
import { JournalEntry } from '../types';
import JournalDetail from './JournalDetail';

interface JournalViewProps {
  isLoading: boolean;
  entries: JournalEntry[];
  onUpdateEntry: (id: number, updates: { title?: string; notes?: string }) => void;
  onDelete: (id: number) => void;
  onClearAll: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ isLoading, entries, onUpdateEntry, onDelete, onClearAll }) => {
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const handleExport = () => {
    if (entries.length === 0) return;

    const dataStr = JSON.stringify(entries, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `dermavision-journal_${new Date().toISOString().split('T')[0]}.json`;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (selectedEntry) {
    return (
      <JournalDetail
        entry={selectedEntry}
        onUpdateEntry={(id, updates) => {
          onUpdateEntry(id, updates);
          setSelectedEntry(prev => prev ? {...prev, ...updates} : null);
        }}
        onDelete={(id) => {
          onDelete(id);
          setSelectedEntry(null);
        }}
        onBack={() => setSelectedEntry(null)}
      />
    );
  }
  
  const sortedEntries = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full h-full bg-surface p-6 sm:p-8 rounded-2xl shadow-xl">
      <div className="flex justify-between items-center mb-6 border-b border-border-color pb-4">
        <h2 className="text-2xl font-bold text-text-primary">My Skin Journal</h2>
        {sortedEntries.length > 0 && (
          <div className="flex items-center space-x-4">
             <button
              onClick={handleExport}
              className="text-primary hover:text-primary-dark font-semibold text-sm transition duration-300 flex items-center"
              aria-label="Export all journal entries"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Journal
            </button>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all journal entries? This action is irreversible.')) {
                  onClearAll();
                }
              }}
              className="text-red-600 hover:text-red-800 font-semibold text-sm transition duration-300 flex items-center"
              aria-label="Clear all journal entries"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        )}
      </div>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary py-16">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-primary"></div>
          <p className="mt-4 text-lg font-semibold text-text-primary">Loading Journal...</p>
        </div>
      ) : sortedEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary py-16">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-border-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary">Your Journal is Empty</h3>
            <p className="mt-2 max-w-sm">Use the 'Analyzer' to check your skin and save the results to start tracking your progress.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {sortedEntries.map((entry) => {
            const summaryText = entry.analysis.length === 0
              ? 'No issues detected'
              : entry.analysis.length === 1
              ? `Primary issue: ${entry.analysis[0].issue}`
              : `${entry.analysis.length} issues detected`;
            
            return (
              <div 
                  key={entry.id} 
                  className="bg-background p-4 rounded-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:bg-primary/5 hover:scale-[1.02] cursor-pointer flex justify-between items-center"
                  onClick={() => setSelectedEntry(entry)}
                  role="button"
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedEntry(entry); }}
                  aria-label={`View details for ${entry.title} from ${new Date(entry.date).toLocaleDateString()}`}
              >
                  <div className="flex-grow">
                      <p className="font-bold text-text-primary text-lg">{entry.title}</p>
                      <p className="text-sm text-text-secondary">
                        {new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        <span className="text-slate-300 mx-2">·</span>
                        {summaryText}
                      </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-text-secondary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JournalView;