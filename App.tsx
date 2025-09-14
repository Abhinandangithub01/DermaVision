import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ImageUploader from './components/ImageUploader';
import AnalysisResult from './components/AnalysisResult';
import Loader from './components/Loader';
import JournalView from './components/JournalView';
import { analyzeSkinImage } from './services/geminiService';
import { SkinAnalysis, JournalEntry } from './types';

const fileToDataParts = (file: File): Promise<{dataUrl: string, base64: string, mimeType: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const [mimePart, base64Part] = dataUrl.split(',');
      if (!base64Part) {
        reject(new Error("Invalid file format"));
        return;
      }
      const mimeType = mimePart.split(':')[1].split(';')[0];
      resolve({ dataUrl, base64: base64Part, mimeType });
    };
    reader.onerror = (error) => reject(error);
  });
};

const OLD_JOURNAL_STORAGE_KEY = 'derm-ai-journal';
const JOURNAL_STORAGE_KEY = 'dermavision-journal';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SkinAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'analyzer' | 'journal'>('analyzer');
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [isJournalLoading, setIsJournalLoading] = useState<boolean>(true);
  const [isCurrentAnalysisSaved, setIsCurrentAnalysisSaved] = useState<boolean>(false);

  useEffect(() => {
    try {
      let storedEntriesRaw = localStorage.getItem(JOURNAL_STORAGE_KEY);
      let shouldMigrate = false;

      // If new key doesn't exist, check for old key
      if (!storedEntriesRaw) {
        const oldEntriesRaw = localStorage.getItem(OLD_JOURNAL_STORAGE_KEY);
        if (oldEntriesRaw) {
          storedEntriesRaw = oldEntriesRaw;
          shouldMigrate = true;
        }
      }

      if (storedEntriesRaw) {
        const storedEntries = JSON.parse(storedEntriesRaw) as JournalEntry[];
        // Data migration for old entries that might not have a title
        const migratedEntries = storedEntries.map(entry => {
            if (!entry.title) {
                return {
                    ...entry,
                    title: entry.analysis.length > 0 ? entry.analysis[0].issue : "Clear Skin Analysis"
                };
            }
            return entry;
        });
        setJournalEntries(migratedEntries);

        // If we loaded from the old key, save to the new key and remove the old one
        if (shouldMigrate) {
          localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(migratedEntries));
          localStorage.removeItem(OLD_JOURNAL_STORAGE_KEY);
        }
      }
    } catch (e) {
      console.error("Failed to parse or migrate journal entries from localStorage", e);
    } finally {
      setIsJournalLoading(false);
    }
  }, []);

  const handleImageUpload = async (file: File) => {
    setImageFile(file);
    const { dataUrl } = await fileToDataParts(file);
    setImageDataUrl(dataUrl);
    setAnalysis(null);
    setError(null);
    setIsCurrentAnalysisSaved(false);
  };

  const handleClearImage = () => {
    setImageFile(null);
    setImageDataUrl(null);
    setAnalysis(null);
    setError(null);
    setIsCurrentAnalysisSaved(false);
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!imageFile) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setIsCurrentAnalysisSaved(false);

    try {
      const { base64, mimeType } = await fileToDataParts(imageFile);
      const result = await analyzeSkinImage(base64, mimeType);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [imageFile]);

  const handleSaveToJournal = () => {
    if (!analysis || !imageDataUrl) return;

    const defaultTitle = analysis.length > 0 ? analysis[0].issue : "Clear Skin Analysis";

    const newEntry: JournalEntry = {
      id: Date.now(),
      title: defaultTitle,
      date: new Date().toISOString(),
      imageDataUrl,
      analysis,
      notes: '',
    };
    const updatedEntries = [...journalEntries, newEntry];
    setJournalEntries(updatedEntries);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
    setIsCurrentAnalysisSaved(true);
  };
  
  const handleUpdateEntry = (id: number, updates: Partial<Omit<JournalEntry, 'id'>>) => {
    const updatedEntries = journalEntries.map(entry => 
      entry.id === id ? { ...entry, ...updates } : entry
    );
    setJournalEntries(updatedEntries);
    localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
  };
  
  const handleDeleteEntry = (id: number) => {
     const updatedEntries = journalEntries.filter(entry => entry.id !== id);
     setJournalEntries(updatedEntries);
     localStorage.setItem(JOURNAL_STORAGE_KEY, JSON.stringify(updatedEntries));
  };
  
  const handleClearJournal = () => {
      setJournalEntries([]);
      localStorage.removeItem(JOURNAL_STORAGE_KEY);
  };

  const TabButton: React.FC<{tabName: 'analyzer' | 'journal', children: React.ReactNode}> = ({ tabName, children }) => {
    const isActive = view === tabName;
    return (
      <button
        onClick={() => setView(tabName)}
        className={`whitespace-nowrap py-2 px-4 rounded-full font-semibold text-sm transition-colors duration-300 ${
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-text-secondary hover:text-text-primary hover:bg-slate-200'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center mb-8">
            <nav className="flex space-x-2 bg-slate-100 p-1.5 rounded-full" aria-label="Tabs">
               <TabButton tabName="analyzer">Analyzer</TabButton>
               <TabButton tabName="journal">My Journal ({journalEntries.length})</TabButton>
            </nav>
        </div>

        {view === 'analyzer' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
            <div className="flex flex-col items-center space-y-6">
              <ImageUploader 
                onImageUpload={handleImageUpload}
                onClearImage={handleClearImage}
                previewUrl={imageDataUrl}
              />
              <button
                onClick={handleAnalyzeClick}
                disabled={!imageFile || isLoading}
                className="w-full bg-primary text-white font-bold py-3 px-4 rounded-xl text-lg hover:bg-primary-dark transition-all duration-300 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="obj 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : "Analyze My Skin"}
              </button>
            </div>

            <div className="bg-surface p-6 rounded-2xl shadow-lg min-h-[400px] flex flex-col">
              {isLoading && <Loader />}
              {error && (
                  <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
                      <h3 className="font-bold">Error</h3>
                      <p>{error}</p>
                  </div>
              )}
              {analysis && (
                <div className="flex-grow flex flex-col">
                    <div className="flex-grow">
                        <AnalysisResult result={analysis} />
                    </div>
                    <div className="mt-6 pt-4 border-t border-border-color">
                        <button
                            onClick={handleSaveToJournal}
                            disabled={isCurrentAnalysisSaved}
                            className="w-full bg-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-emerald-600 transition duration-300 disabled:bg-emerald-300 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isCurrentAnalysisSaved ? "Saved to Journal" : "Save to Journal"}
                        </button>
                    </div>
                </div>
              )}
              {!isLoading && !error && !analysis && (
                  <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-border-color" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104l-2.25 1.5a1.5 1.5 0 00-.673.563l-2.25 3.75a1.5 1.5 0 00.22 1.875l2.25 2.25a1.5 1.5 0 002.121 0l3.75-3.75a1.5 1.5 0 00.563-.673l1.5-2.25a1.5 1.5 0 00-1.875-2.22l-2.25.22a1.5 1.5 0 01-1.4-.75l-.75-1.5a1.5 1.5 0 00-1.327-.896zM15 10.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z" />
                      </svg>
                      <h2 className="text-xl font-semibold text-text-primary">Your Analysis Awaits</h2>
                      <p className="mt-2 max-w-sm">Upload a clear picture of your skin, and our AI will provide insights and recommendations.</p>
                  </div>
              )}
            </div>
          </div>
        )}
        
        {view === 'journal' && (
            <JournalView 
                isLoading={isJournalLoading}
                entries={journalEntries}
                onUpdateEntry={handleUpdateEntry}
                onDelete={handleDeleteEntry}
                onClearAll={handleClearJournal}
            />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;