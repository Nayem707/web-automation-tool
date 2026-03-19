import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import {
  getAllTeams,
  getRosterScrapingStatus,
  previewRosterData,
  scrapeAllRosters,
  scrapeTeamRoster,
} from '../scraperAPI';

/**
 * RosterScraperControl Component
 * UI controls for scraping NBA.com team rosters
 */
const RosterScraperControl = () => {
  const dispatch = useDispatch();
  const { isRosterScrapingActive, rosterStats, teams, previewData, status, error } = useSelector(
    (state) => state.scraper
  );

  const [selectedTeam, setSelectedTeam] = useState('');
  const [previewLimit, setPreviewLimit] = useState(3);

  useEffect(() => {
    // Load teams on mount
    dispatch(getAllTeams());
  }, [dispatch]);

  useEffect(() => {
    // Poll status if scraping is active
    if (isRosterScrapingActive) {
      const interval = setInterval(() => {
        dispatch(getRosterScrapingStatus());
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [isRosterScrapingActive, dispatch]);

  const handleScrapeAll = () => {
    if (
      window.confirm(
        'This will scrape all 30 NBA team rosters from NBA.com. This takes about 60-90 seconds. Continue?'
      )
    ) {
      dispatch(scrapeAllRosters());
    }
  };

  const handleScrapeTeam = () => {
    if (!selectedTeam) {
      alert('Please select a team first');
      return;
    }

    dispatch(scrapeTeamRoster({ teamSlug: selectedTeam }));
  };

  const handlePreview = () => {
    dispatch(previewRosterData(previewLimit));
  };

  const isLoading = status === 'loading' || status === 'scraping';
  const isScraping = isRosterScrapingActive;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">🏀 NBA Roster Scraper</h3>
          <p className="text-sm text-gray-600">
            Scrape current NBA team rosters directly from official NBA.com pages
          </p>
        </div>

        {/* Status Display */}
        {isScraping && (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium text-blue-900">Scraping in progress...</span>
            </div>
            {rosterStats && (
              <div className="mt-2 text-xs text-blue-700">
                <div>
                  Teams: {rosterStats.teamsProcessed || 0} / {rosterStats.totalTeams || 30}
                </div>
                <div>Players: {rosterStats.totalPlayers || 0}</div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && status === 'error' && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="mt-1 text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Success Stats */}
        {rosterStats && status === 'success' && !isScraping && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="mb-2 text-sm font-medium text-green-900">
              ✅ Scraping Completed Successfully
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs text-green-700">
              <div>Total Players: {rosterStats.totalPlayers}</div>
              <div>Teams Processed: {rosterStats.teamsProcessed}</div>
              {rosterStats.duration && <div>Duration: {rosterStats.duration}</div>}
              {rosterStats.failedTeams?.length > 0 && (
                <div className="col-span-2 text-yellow-700">
                  Failed Teams: {rosterStats.failedTeams.length}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Main Actions */}
        <div className="space-y-4">
          {/* Scrape All Teams */}
          <div className="border-b pb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Scrape All Teams</h4>
            <Button
              onClick={handleScrapeAll}
              disabled={isLoading || isScraping}
              variant="primary"
              className="w-full"
            >
              {isScraping ? 'Scraping...' : 'Scrape All 30 Teams'}
            </Button>
            <p className="mt-1 text-xs text-gray-500">
              Scrapes all NBA team rosters and saves to database
            </p>
          </div>

          {/* Scrape Specific Team */}
          <div className="border-b pb-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Scrape Specific Team</h4>
            <div className="flex space-x-2">
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                disabled={isLoading || isScraping}
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a team...</option>
                {teams.map((team) => (
                  <option key={team.slug} value={team.slug}>
                    {team.name}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleScrapeTeam}
                disabled={isLoading || isScraping || !selectedTeam}
                variant="secondary"
              >
                Scrape
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max="10"
                value={previewLimit}
                onChange={(e) => setPreviewLimit(parseInt(e.target.value) || 3)}
                disabled={isLoading || isScraping}
                className="w-20 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handlePreview}
                disabled={isLoading || isScraping}
                variant="secondary"
                className="flex-1"
              >
                Preview {previewLimit} Teams
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Test scraping without saving to database</p>
          </div>
        </div>

        {/* Preview Results */}
        {previewData && previewData.length > 0 && (
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-700">Preview Results</h4>
            <div className="space-y-2">
              {previewData.map((teamData, index) => (
                <div key={index} className="rounded border border-gray-200 bg-white p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">{teamData.team}</span>
                    <span className="text-xs text-gray-500">
                      {teamData.playersCount || 0} players
                    </span>
                  </div>
                  {teamData.error && <p className="mt-1 text-xs text-red-600">{teamData.error}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-1 text-xs font-medium text-blue-900">ℹ️ Info</h4>
          <ul className="space-y-1 text-xs text-blue-700">
            <li>• Scrapes from official NBA.com roster pages</li>
            <li>• Gets current active roster players only</li>
            <li>• Includes height (cm), weight (kg), position</li>
            <li>• Rate limited to prevent blocking (2s between teams)</li>
            <li>• Estimated time: 60-90 seconds for all teams</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export default RosterScraperControl;
