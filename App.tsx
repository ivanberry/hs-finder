
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

      <div className="mt-12 text-sm text-gray-500 flex items-center space-x-1">
        <span>Global trade classifications made simple.</span>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Top Bar */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-10 px-4 py-3 sm:px-8 flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-8">
        <button onClick={resetToHome} className="text-2xl font-bold flex items-center shrink-0">
          <span className="text-blue-500">H</span>
          <span className="text-red-500">S</span>
          <span className="text-yellow-500">F</span>
        </button>
        <div className="flex-1 w-full max-w-2xl">
          <SearchBar onSearch={handleSearch} initialValue={query} compact />
        </div>
        <div className="hidden sm:flex items-center space-x-4">
           <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
           </button>
           <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">U</div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-4xl">
        <div className="text-gray-500 text-sm mb-6">
          {loading ? 'Searching global databases...' : `Showing results for "${query}"`}
        </div>

        {loading ? (
          <div className="space-y-8 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <p className="font-medium">Error searching for code</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : data ? (
          <div className="space-y-10">
            {/* Grounded Summary Area */}
            <section className="prose prose-blue max-w-none">
              <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
                {/* Formatting simple bullet points if AI returned markdown-like strings */}
                {data.summary.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">
                    {line.startsWith('* ') || line.startsWith('- ') ? (
                       <span className="block ml-4 pl-2 border-l-2 border-blue-100">{line.substring(2)}</span>
                    ) : line.startsWith('#') ? (
                       <span className="block font-bold text-xl mt-4 mb-2">{line.replace(/#/g, '').trim()}</span>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            </section>

            {/* Sources section (from groundingMetadata) */}
            {data.sources && data.sources.length > 0 && (
              <section className="pt-8 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Official Sources & Reference Material</h3>
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
                          <p className="text-xs text-green-700 mb-1 truncate">{new URL(source.uri).hostname}</p>
                          <h4 className="text-blue-700 font-medium group-hover:underline line-clamp-2 leading-snug">
                            {source.title}
                          </h4>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 ml-2 mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Related Topics / Tips */}
            <section className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
              <h4 className="text-blue-900 font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1a1 1 0 112 0v1a1 1 0 11-2 0zM13.314 15.314a1 1 0 11-1.414 1.414l-.707-.707a1 1 0 111.414-1.414l.707.707zM17.243 16.536a1 1 0 11-1.414-1.414l.707-.707a1 1 0 111.414 1.414l-.707.707zM7 10a3 3 0 116 0 3 3 0 01-6 0z" />
                </svg>
                Pro Tip: Understanding HS Codes
              </h4>
              <p className="text-blue-800 text-sm leading-relaxed">
                HS Codes are standardized globally at the 6-digit level. However, countries often extend them up to 8 or 10 digits for local duty rates (e.g., HTSUS in the US or CN in Europe). Always verify the final 4 digits with your destination country's customs portal.
              </p>
            </section>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            No information available for this query. Try a more specific trade item.
          </div>
        )}
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
