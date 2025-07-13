import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Loader2, Play, BookOpen, Shuffle } from 'lucide-react';
import { ScriptPack } from '../../data/scriptPacks';

interface ScriptLibraryProps {
  scripts: ScriptPack[];
  isPlaying: boolean;
  testingVoiceId: string | null;
  onTestScript: (script: ScriptPack) => void;
  onRefresh: () => void;
  scriptFilter: 'all' | 'SFW' | 'NSFW';
  onScriptFilterChange: (filter: 'all' | 'SFW' | 'NSFW') => void;
  scenarioFilter: string;
  onScenarioFilterChange: (filter: string) => void;
  uniqueScenarios: string[];
  style: string;
}

const ScriptLibrary: React.FC<ScriptLibraryProps> = ({
  scripts,
  isPlaying,
  testingVoiceId,
  onTestScript,
  onRefresh,
  scriptFilter,
  onScriptFilterChange,
  scenarioFilter,
  onScenarioFilterChange,
  uniqueScenarios,
  style,
}) => {
  const getStyleColor = (style: string) => {
    switch (style) {
      case 'flirty': return 'bg-pink-900/30 text-pink-300';
      case 'dominant': return 'bg-red-900/30 text-red-300';
      case 'wholesome': return 'bg-green-900/30 text-green-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  const getNSFWColor = (level: 'SFW' | 'NSFW') => {
    return level === 'NSFW' ? 'bg-error-900/30 text-error-300' : 'bg-success-900/30 text-success-300';
  };

  return (
    <>
      {/* Script Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Script Library</h2>
            <Button
              onClick={onRefresh}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <Shuffle className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* NSFW Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Content Level
              </label>
              <select
                value={scriptFilter}
                onChange={(e) => onScriptFilterChange(e.target.value as any)}
                className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
              >
                <option value="all">All Content</option>
                <option value="SFW">Safe for Work</option>
                <option value="NSFW">Adults Only</option>
              </select>
            </div>

            {/* Scenario Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Scenario Type
              </label>
              <select
                value={scenarioFilter}
                onChange={(e) => onScenarioFilterChange(e.target.value)}
                className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
              >
                <option value="all">All Scenarios</option>
                {uniqueScenarios.map(scenario => (
                  <option key={scenario} value={scenario}>{scenario}</option>
                ))}
              </select>
            </div>

            {/* Current Style Info */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Style
              </label>
              <div className="p-2 bg-gray-800 rounded-lg">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStyleColor(style)}`}>
                  {style}
                </span>
                <span className="ml-2 text-sm text-gray-400">
                  {scripts.length} scripts
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Script Grid */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-white">Available Scripts</h2>
          <p className="text-gray-400">
            Test different praise scripts to find your favorites
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scripts.map((script) => (
              <div
                key={script.id}
                className="p-4 border border-gray-700 rounded-lg hover:border-primary-500/50 transition-all bg-gray-800"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStyleColor(script.tone)}`}>
                        {script.tone}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getNSFWColor(script.nsfw_level)}`}>
                        {script.nsfw_level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{script.scenario}</p>
                  </div>

                  <Button
                    onClick={() => onTestScript(script)}
                    disabled={isPlaying}
                    variant="outline"
                    size="sm"
                  >
                    {testingVoiceId === script.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                <blockquote className="text-sm italic text-gray-300 border-l-4 border-primary-500/30 pl-3">
                  "{script.text}"
                </blockquote>
              </div>
            ))}
          </div>

          {scripts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No scripts found matching your filters.</p>
              <p className="text-sm">Try adjusting your filter settings or changing your voice style.</p>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ScriptLibrary;
