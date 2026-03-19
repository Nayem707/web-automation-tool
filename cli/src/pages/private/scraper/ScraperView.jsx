import React, { useState } from 'react';
import { useScraper } from '../../../features/scraper/hooks/useScraper';
import ScraperError from '../../../features/scraper/components/ScraperError';
import JsonExporter from '../../../features/scraper/components/JsonExporter';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

const TABS = [
  { label: 'Auto Limit', description: 'Fetch all data from a URL without restrictions' },
  { label: 'Custom Parameters', description: 'Set item limits and query parameters' },
];

const StatusBadge = ({ status }) => {
  const styles = {
    idle: 'bg-gray-100 text-gray-600',
    loading: 'bg-indigo-100 text-indigo-700',
    success: 'bg-emerald-100 text-emerald-700',
    error: 'bg-red-100 text-red-700',
  };
  const labels = { idle: 'Idle', loading: 'Scraping…', success: 'Success', error: 'Error' };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? styles.idle}`}
    >
      {labels[status] ?? status}
    </span>
  );
};

const ScraperView = () => {
  const {
    scrapeAuto,
    scrapeCustom,
    data,
    metadata,
    isLoading,
    hasData,
    error,
    hasError,
    status,
    lastUpdated,
    dismissError,
    reset,
  } = useScraper();

  const [activeTab, setActiveTab] = useState(0);
  const [url, setUrl] = useState('');
  const [itemCount, setItemCount] = useState('');
  const [params, setParams] = useState([{ key: '', value: '' }]);

  const handleAutoScrape = () => {
    if (!url.trim()) return;
    scrapeAuto({ url: url.trim() });
  };

  const handleCustomScrape = () => {
    if (!url.trim()) return;
    const body = { url: url.trim() };
    if (itemCount !== '') body.itemCount = Number(itemCount);
    const paramObj = {};
    params.forEach(({ key, value }) => {
      if (key.trim()) paramObj[key.trim()] = value.trim();
    });
    if (Object.keys(paramObj).length > 0) body.params = paramObj;
    scrapeCustom(body);
  };

  const addParam = () => setParams((prev) => [...prev, { key: '', value: '' }]);
  const removeParam = (i) => setParams((prev) => prev.filter((_, idx) => idx !== i));
  const updateParam = (i, field, val) =>
    setParams((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));

  const handleRun = activeTab === 0 ? handleAutoScrape : handleCustomScrape;
  const canRun = url.trim().length > 0 && !isLoading;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Web Scraper</h1>
          <p className="mt-1 text-sm text-gray-500">
            Fetch and extract public JSON data from any URL
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        {TABS.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === i
                ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-gray-200'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form card */}
      <Card title={TABS[activeTab].label} subtitle={TABS[activeTab].description}>
        <div className="space-y-4">
          {/* URL input — shared by both tabs */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              Target URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && canRun && handleRun()}
              placeholder="https://api.example.com/data"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </div>

          {/* Custom Parameters extras */}
          {activeTab === 1 && (
            <>
              {/* Item count */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Item Limit
                  <span className="ml-1 text-xs text-gray-400">(optional)</span>
                </label>
                <input
                  type="number"
                  min="1"
                  value={itemCount}
                  onChange={(e) => setItemCount(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-40 rounded-lg border border-gray-300 px-3 py-2.5 text-sm placeholder-gray-400 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              {/* Query params */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Query Parameters
                  <span className="ml-1 text-xs text-gray-400">(optional)</span>
                </label>
                <div className="space-y-2">
                  {params.map((p, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={p.key}
                        onChange={(e) => updateParam(i, 'key', e.target.value)}
                        placeholder="key"
                        className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                      <span className="text-gray-400">=</span>
                      <input
                        type="text"
                        value={p.value}
                        onChange={(e) => updateParam(i, 'value', e.target.value)}
                        placeholder="value"
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder-gray-400 transition outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                      />
                      {params.length > 1 && (
                        <button
                          onClick={() => removeParam(i)}
                          className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                          aria-label="Remove param"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={addParam}
                  className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  + Add parameter
                </button>
              </div>
            </>
          )}

          {/* Action row */}
          <div className="flex items-center gap-3 pt-1">
            <Button onClick={handleRun} disabled={!canRun}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  Scraping…
                </span>
              ) : activeTab === 0 ? (
                'Scrape All Data'
              ) : (
                'Scrape with Params'
              )}
            </Button>
            {hasData && (
              <Button variant="ghost" onClick={reset}>
                Clear Results
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Error */}
      {hasError && <ScraperError error={error} onRetry={handleRun} onDismiss={dismissError} />}

      {/* Results */}
      {hasData && (
        <div className="space-y-4">
          {/* Metadata summary */}
          {metadata && (
            <Card
              title="Result Summary"
              subtitle={
                lastUpdated
                  ? `Last updated ${new Date(lastUpdated).toLocaleTimeString()}`
                  : undefined
              }
            >
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Total Items</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">
                    {metadata.totalItems ?? '—'}
                  </p>
                </div>
                <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3">
                  <p className="text-xs text-indigo-600">Returned</p>
                  <p className="mt-0.5 text-lg font-bold text-indigo-700">
                    {metadata.returnedItems ?? '—'}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Limited</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">
                    {metadata.limited ? 'Yes' : 'No'}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">Server-side</p>
                  <p className="mt-0.5 text-lg font-bold text-gray-900">
                    {metadata.serverSideLimited ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
              {metadata.url && (
                <p className="mt-3 truncate rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 font-mono text-xs text-gray-500">
                  {metadata.url}
                </p>
              )}
            </Card>
          )}

          {/* JSON preview */}
          <Card title="Data Preview" subtitle="First 5 records">
            <pre className="max-h-64 overflow-auto rounded-lg border border-gray-100 bg-gray-50 p-4 font-mono text-xs leading-relaxed text-gray-700">
              {JSON.stringify(Array.isArray(data) ? data.slice(0, 5) : data, null, 2)}
            </pre>
          </Card>

          {/* Export */}
          <JsonExporter data={data} filename="scraped-data" />
        </div>
      )}
    </div>
  );
};

export default ScraperView;
