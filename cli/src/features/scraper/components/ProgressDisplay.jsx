const ProgressDisplay = ({ progress, isActive }) => {
  if (!progress && !isActive) return null;

  const processed = progress?.processedPlayers || 0;
  const total = progress?.totalPlayers || 0;
  const successful = progress?.successfulPlayers || 0;
  const failed = progress?.failedPlayers || 0;

  const percentage = processed && total ? ((processed / total) * 100).toFixed(1) : 0;
  const successRate = processed ? ((successful / processed) * 100).toFixed(1) : 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      {/* Header with gradient background when active */}
      <div
        className={`px-6 py-4 ${isActive ? 'bg-gradient-to-r from-indigo-50 to-purple-50' : 'bg-gray-50'}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isActive && (
              <div className="relative">
                <div className="absolute h-3 w-3 animate-ping rounded-full bg-indigo-400 opacity-75"></div>
                <div className="relative h-3 w-3 rounded-full bg-indigo-500"></div>
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {isActive ? 'Actively Scraping' : 'Scraping Summary'}
              </h3>
              <p className="mt-0.5 text-sm text-gray-500">
                {isActive ? 'Processing player data in real-time' : 'Last scraping session results'}
              </p>
            </div>
          </div>

          {/* Large percentage display */}
          <div className="text-right">
            <span className="text-3xl font-bold text-indigo-600">{percentage}%</span>
            <p className="text-xs text-gray-500">complete</p>
          </div>
        </div>
      </div>

      {/* Progress bar section */}
      <div className="px-6 pt-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">Overall progress</span>
          <span className="font-semibold text-indigo-600">
            {processed}/{total} players
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="relative h-full overflow-hidden rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          >
            {/* Animated shine effect on active progress bar */}
            {isActive && (
              <div className="animate-shimmer absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            )}
          </div>
        </div>
      </div>

      {/* Stats cards - more visual and organized */}
      <div className="grid grid-cols-3 gap-3 px-6 py-4">
        <div className="rounded-xl bg-indigo-50 p-4">
          <p className="text-xs font-medium tracking-wider text-indigo-600 uppercase">Processed</p>
          <p className="mt-1 text-2xl font-bold text-indigo-700">{processed}</p>
          <p className="mt-1 text-xs text-indigo-500">players</p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-4">
          <p className="text-xs font-medium tracking-wider text-emerald-600 uppercase">
            Successful
          </p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">{successful}</p>
          <div className="mt-1 flex items-center gap-1">
            <span className="text-xs text-emerald-500">{successRate}% success</span>
          </div>
        </div>

        <div className="rounded-xl bg-red-50 p-4">
          <p className="text-xs font-medium tracking-wider text-red-600 uppercase">Failed</p>
          <p className="mt-1 text-2xl font-bold text-red-700">{failed}</p>
          {processed > 0 && (
            <p className="mt-1 text-xs text-red-500">
              {((failed / processed) * 100).toFixed(1)}% of total
            </p>
          )}
        </div>
      </div>

      {/* Footer with contextual information */}
      <div
        className={`border-t border-gray-100 px-6 py-4 ${isActive ? 'bg-indigo-50/50' : 'bg-gray-50'}`}
      >
        {isActive ? (
          <div className="flex items-center gap-3">
            <svg
              className="h-5 w-5 animate-bounce text-indigo-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <p className="text-sm font-medium text-indigo-700">
              Actively scraping player data... This may take a few minutes
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            {processed > 0 && (
              <span className="font-medium text-gray-700">
                Completed at {((successful / processed) * 100).toFixed(1)}% success rate
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add custom animation to your global CSS or tailwind config
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }

export default ProgressDisplay;
