
import React, { useState } from 'react';
import { JournalEntry } from '../types';
import AnalysisResult from './AnalysisResult';

interface JournalDetailProps {
  entry: JournalEntry;
  onUpdateEntry: (id: number, updates: { title?: string, notes?: string }) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ entry, onUpdateEntry, onDelete, onBack }) => {
  const [title, setTitle] = useState(entry.title);
  const [notes, setNotes] = useState(entry.notes);
  const [isSaved, setIsSaved] = useState(false);
  
  const hasChanges = title !== entry.title || notes !== entry.notes;

  const handleSaveChanges = () => {
    onUpdateEntry(entry.id, { title, notes });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this journal entry? This action cannot be undone.')) {
      onDelete(entry.id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      <button
        onClick={onBack}
        className="mb-6 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Journal
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <img src={entry.imageDataUrl} alt="Skin analysis" className="w-full h-auto rounded-lg object-contain border border-brand-gray" />
            <p className="text-center text-sm text-gray-500 mt-2">
              Analysis from {new Date(entry.date).toLocaleString()}
            </p>
          </div>
          <div>
            <label htmlFor="entry-title" className="text-lg font-semibold text-brand-dark mb-2 block">Title</label>
            <input
                id="entry-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-brand-gray rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
                aria-label="Journal entry title"
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-brand-dark mb-2">My Notes</h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about your skin, routine, or feelings..."
              className="w-full h-32 p-2 border border-brand-gray rounded-md focus:ring-2 focus:ring-brand-blue focus:border-transparent transition"
              aria-label="Journal notes"
            />
            <div className="flex items-center mt-2">
               <button
                onClick={handleSaveChanges}
                className="bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-blue-dark transition duration-300 disabled:bg-brand-gray"
                disabled={!hasChanges}
              >
                Save Changes
              </button>
               {isSaved && <span className="ml-4 text-green-600 font-semibold">Saved!</span>}
            </div>
          </div>
           <div className="mt-6">
                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 font-semibold transition duration-300 flex items-center"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Entry
                </button>
            </div>
        </div>
        <div className="max-h-[70vh] overflow-y-auto">
          <h3 className="text-xl font-bold text-brand-dark mb-4">Detailed Analysis</h3>
          <AnalysisResult result={entry.analysis} />
        </div>
      </div>
    </div>
  );
};

export default JournalDetail;
