
import React, { useState, useCallback } from 'react';
import { AppView, SearchResponse } from './types';
import SearchBar from './components/SearchBar';
import Footer from './components/Footer';
import { searchHSCode } from './services/hsSearchService';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery);
    setView(AppView.RESULTS);
    setLoading(true);
    setError(null);
    try {
      const result = await searchHSCode(searchQuery);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during the search.');
    } finally {
      setLoading(false);
    }
  }, []);

  const resetToHome = () => {
    setView(AppView.HOME);
    setQuery('');
    setData(null);
    setError(null);
  };

  const renderHome = () => (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 -mt-16">
      <div className="mb-8 text-center">
        <h1 className="text-6xl sm:text-8xl font-bold tracking-tight text-gray-900 flex items-center justify-center">
          <span className="text-blue-500">H</span>
          <span className="text-red-500">S</span>
          <span className="text-yellow-500 ml-2">F</span>
          <span className="text-blue-500">i</span>
          <span className="text-green-500">n</span>
          <span className="text-red-500">d</span>
        </h1>
        <p className="mt-4 text-gray-500 text-lg">Official Harmonized System Code Search</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />

      <div className="mt-10 flex space-x-3">
        <button 
          onClick={() => handleSearch(query || 'Electric Vehicles')}
          className="px-6 py-2 bg-gray-50 text-gray-700 rounded-md border border-transparent hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium"
        >
          HS Search
        </button>
        <button 
          onClick={() => handleSearch('Coffee Beans')}
          className="px-6 py-2 bg-gray-50 text-gray-700 rounded-md border border-transparent hover:border-gray-300 hover:shadow-sm transition-all text-sm font-medium"
        >
          I'm Feeling Lucky
        </button>
      </div>

      <div className="mt-12 text-sm text-gray-500">
        <span>Connect to your custom database via API.</span>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3 sm:px-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8">
        <button onClick={resetToHome} className="text-2xl font-bold flex items-center shrink-0">
          <span className="text-blue-500">H</span>
          <span className="text-red-500">S</span>
          <span className="text-yellow-500">F</span>
        </button>
        <div className="flex-1 w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} initialValue={query} compact />
        </div>
        <div className="hidden sm:flex items-center space-x-4 shrink-0">
           <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">U</div>
        </div>
      </header>

      <main className="flex-1 px-4 sm:px-8 py-6 max-w-4xl">
        <div className="text-gray-500 text-sm mb-6">
          {loading ? 'Querying database...' : `Results for "${query}"`}
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Connection Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-8">
            {/* Direct HS Code Results */}
            {data.results && data.results.length > 0 && (
              <div className="space-y-6">
                {data.results.map((item, idx) => (
                  <div key={idx} className="group">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-xl font-bold text-blue-800 tabular-nums">{item.hsCode}</span>
                      <span className="text-sm text-gray-500 uppercase font-semibold tracking-wide">{item.section}</span>
                    </div>
                    <p className="text-gray-700 mt-1 text-lg group-hover:text-blue-900 transition-colors">
                      {item.description}
                    </p>
                    {item.typicalDutyRate && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Estimated Duty: {item.typicalDutyRate}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* AI Summary / Context (if available from custom API) */}
            {data.summary && (
              <section className="prose prose-blue max-w-none pt-4">
                <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                  {data.summary}
                </div>
              </section>
            )}

            {/* Sources section */}
            {data.sources && data.sources.length > 0 && (
              <section className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Official References</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {data.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-green-700 mb-1 truncate">{source.uri}</p>
                          <h4 className="text-blue-700 font-medium group-hover:underline line-clamp-2 leading-snug">
                            {source.title}
                          </h4>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {!data.results?.length && !data.summary && (
              <div className="py-20 text-center text-gray-500">
                No matching codes found in the database.
              </div>
            )}
          </div>
        ) : null}
      </main>

      <Footer />
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {view === AppView.HOME ? renderHome() : renderResults()}
    </div>
  );
};

export default App;
