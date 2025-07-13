import React, { useEffect, useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Volume2, Play, Loader2, CheckCircle, Settings, BookOpen, Sliders, FileText, Plus } from 'lucide-react';
import { useVoicePraiseStore } from '../store/voicePraiseStore';
import { useUserStore } from '../store/userStore';
import VoiceStyleSelection from '../components/praise/VoiceStyleSelection';
import VoiceFilter from '../components/praise/VoiceFilter';
import VoiceSelectionGrid from '../components/praise/VoiceSelectionGrid';
import ScriptLibrary from '../components/praise/ScriptLibrary';
import CustomScripts from '../components/praise/CustomScripts';
import VoiceSettings from '../components/praise/VoiceSettings';
import { ScriptPack } from '../data/scriptPacks';

const PraiseCustomizerPage: React.FC = () => {
  const {
    availableVoices,
    selectedVoiceId,
    isLoading,
    isPlaying,
    error,
    initialize,
    setSelectedVoice,
    testVoice,
    updateSettings,
    settings,
    getAvailableScripts,
    playCustomScript,
    currentScriptPack,
    refreshScriptPack
  } = useVoicePraiseStore();

  const { user } = useUserStore();

  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [styleFilter, setStyleFilter] = useState<'all' | 'flirty' | 'dominant' | 'wholesome'>('all');
  const [testingVoiceId, setTestingVoiceId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'voices' | 'scripts' | 'custom-scripts' | 'settings'>('voices');
  const [scriptFilter, setScriptFilter] = useState<'all' | 'SFW' | 'NSFW'>('all');
  const [scenarioFilter, setScenarioFilter] = useState<string>('all');

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    refreshScriptPack();
  }, [settings.style, user?.settings.mode, refreshScriptPack]);

  const handleVoiceSelect = (voiceId: string) => {
    setSelectedVoice(voiceId);
  };

  const handleTestVoice = async (voiceId: string, voiceName: string) => {
    setTestingVoiceId(voiceId);
    try {
      await testVoice(voiceId, `Hello! I'm ${voiceName}. This is how I'll encourage you during your reading sessions. Good girl, reader!`);
    } finally {
      setTestingVoiceId(null);
    }
  };

  const handleTestScript = async (script: ScriptPack) => {
    setTestingVoiceId(script.id);
    try {
      await playCustomScript(script);
    } finally {
      setTestingVoiceId(null);
    }
  };

  const handleStyleChange = (newStyle: 'flirty' | 'dominant' | 'wholesome') => {
    updateSettings({ style: newStyle });
    const newVoiceId = getVoiceByStyle(newStyle, genderFilter !== 'all' ? genderFilter : undefined);
    if (newVoiceId) {
      setSelectedVoice(newVoiceId);
    }
  };

  const getVoiceByStyle = (style: string, gender?: 'male' | 'female'): string | null => {
    const styleVoices = {
      flirty: {
        male: 'EkK5I93UQWFDigLMpZcX',
        female: '6qL48o1LBmtR94hIYAQh'
      },
      dominant: {
        male: 'G17SuINrv2H9FC6nvetn',
        female: '6qL48o1LBmtR94hIYAQh'
      },
      wholesome: {
        male: 'IRHApOXLvnW57QJPQH2P',
        female: 'esy0r39YPLQjOczyOib8'
      }
    };

    const voiceOptions = styleVoices[style as keyof typeof styleVoices];
    if (!voiceOptions) return null;

    if (gender) {
      return voiceOptions[gender];
    }

    return voiceOptions.female;
  };

  const getFilteredVoices = () => {
    let filtered = availableVoices;

    if (genderFilter === 'male') {
      filtered = filtered.filter(voice => 
        [
          'EkK5I93UQWFDigLMpZcX', 
          'G17SuINrv2H9FC6nvetn', 
          'IRHApOXLvnW57QJPQH2P', 
          'f78MbfpvmG3q9e8TMpTG',
          'rWyjfFeMZ6PxkHqD3wGC',
          'YDCfZMLWcUmsGvqHq0rS',
          'T3b0vsQ5dQwMZ5ckOwBk',
          'XTdzBt8oIEvodkwhxeA0'
        ].includes(voice.voice_id)
      );
    } else if (genderFilter === 'female') {
      filtered = filtered.filter(voice => 
        [
          '6qL48o1LBmtR94hIYAQh', 
          'esy0r39YPLQjOczyOib8',
          'PB6BdkFkZLbI39GHdnbQ',
          'FeJtVBW106P4mvgGebAg',
          'cPoqAvGWCPfCfyPMwe4z'
        ].includes(voice.voice_id)
      );
    }

    if (styleFilter !== 'all') {
      filtered = filtered.filter(voice => voice.category === styleFilter);
    }

    return filtered;
  };

  const getFilteredScripts = () => {
    const userNsfwLevel = user?.settings.mode === 'sfw' ? 'SFW' : 'NSFW';
    let filtered = getAvailableScripts(settings.style, userNsfwLevel);

    if (scriptFilter !== 'all') {
      filtered = filtered.filter(script => script.nsfw_level === scriptFilter);
    }

    if (scenarioFilter !== 'all') {
      filtered = filtered.filter(script => 
        script.scenario.toLowerCase().includes(scenarioFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const getUniqueScenarios = () => {
    const scripts = getAvailableScripts();
    const scenarios = [...new Set(scripts.map(script => script.scenario))];
    return scenarios.sort();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
              <p className="text-lg text-gray-400">Loading voice options...</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center text-white">
              <Volume2 className="mr-3" />
              Praise Customizer
            </h1>
            <p className="text-gray-400 mt-2">
              Choose your perfect reading companion voice and explore available praise scripts
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              Voice Assistant {settings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
        </div>

        {error && (
          <Card>
            <CardBody className="bg-error-900/20 border border-error-500/30">
              <p className="text-error-300">{error}</p>
            </CardBody>
          </Card>
        )}

        {selectedVoiceId && (
          <Card>
            <CardBody className="bg-primary-900/20 border border-primary-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-primary-400" />
                  <div>
                    <p className="font-medium text-primary-300">
                      Current Voice: {availableVoices.find(v => v.voice_id === selectedVoiceId)?.name || 'Unknown'}
                    </p>
                    <p className="text-sm text-primary-400">
                      Style: {settings.style} • Mode: {user?.settings.mode?.toUpperCase() || 'NSFW'} • {currentScriptPack.length} scripts available
                    </p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    const voice = availableVoices.find(v => v.voice_id === selectedVoiceId);
                    if (voice) handleTestVoice(selectedVoiceId, voice.name);
                  }}
                  disabled={isPlaying}
                  variant="outline"
                  className="border-primary-500/30 text-primary-400 hover:bg-primary-900/30"
                >
                  {testingVoiceId === selectedVoiceId ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardBody>
          </Card>
        )}

        <Card>
          <CardBody className="p-0">
            <div className="flex border-b border-red-900/30">
              <button
                onClick={() => setActiveTab('voices')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'voices'
                    ? 'border-b-2 border-primary-500 text-primary-400 bg-primary-900/20'
                    : 'text-gray-400 hover:text-primary-400 hover:bg-gray-800'
                }`}
              >
                <Volume2 className="h-5 w-5 mx-auto mb-1" />
                Voice Selection
              </button>
              <button
                onClick={() => setActiveTab('scripts')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'scripts'
                    ? 'border-b-2 border-primary-500 text-primary-400 bg-primary-900/20'
                    : 'text-gray-400 hover:text-primary-400 hover:bg-gray-800'
                }`}
              >
                <BookOpen className="h-5 w-5 mx-auto mb-1" />
                Script Library ({currentScriptPack.length})
              </button>
              <button
                onClick={() => setActiveTab('custom-scripts')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'custom-scripts'
                    ? 'border-b-2 border-primary-500 text-primary-400 bg-primary-900/20'
                    : 'text-gray-400 hover:text-primary-400 hover:bg-gray-800'
                }`}
              >
                <Plus className="h-5 w-5 mx-auto mb-1" />
                Custom Scripts
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'border-b-2 border-primary-500 text-primary-400 bg-primary-900/20'
                    : 'text-gray-400 hover:text-primary-400 hover:bg-gray-800'
                }`}
              >
                <Sliders className="h-5 w-5 mx-auto mb-1" />
                Voice Settings
              </button>
            </div>
          </CardBody>
        </Card>

        {activeTab === 'voices' && (
          <>
            <VoiceStyleSelection style={settings.style} onStyleChange={handleStyleChange} />
            <VoiceFilter
              genderFilter={genderFilter}
              styleFilter={styleFilter}
              onGenderFilterChange={setGenderFilter}
              onStyleFilterChange={setStyleFilter}
            />
            <VoiceSelectionGrid
              voices={getFilteredVoices()}
              selectedVoiceId={selectedVoiceId}
              isPlaying={isPlaying}
              testingVoiceId={testingVoiceId}
              onVoiceSelect={handleVoiceSelect}
              onTestVoice={handleTestVoice}
            />
          </>
        )}

        {activeTab === 'scripts' && (
          <ScriptLibrary
            scripts={getFilteredScripts()}
            isPlaying={isPlaying}
            testingVoiceId={testingVoiceId}
            onTestScript={handleTestScript}
            onRefresh={refreshScriptPack}
            scriptFilter={scriptFilter}
            onScriptFilterChange={setScriptFilter}
            scenarioFilter={scenarioFilter}
            onScenarioFilterChange={setScenarioFilter}
            uniqueScenarios={getUniqueScenarios()}
            style={settings.style}
          />
        )}

        {activeTab === 'custom-scripts' && <CustomScripts />}

        {activeTab === 'settings' && <VoiceSettings />}
      </div>
    </MainLayout>
  );
};

export default PraiseCustomizerPage;