import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Loader2, Play } from 'lucide-react';
import { useVoicePraiseStore } from '../../store/voicePraiseStore';

const VoiceSettings: React.FC = () => {
  const {
    settings,
    updateSettings,
    voiceSpeed,
    setVoiceSpeed,
    voiceStability,
    setVoiceStability,
    selectedVoiceId,
    availableVoices,
    isPlaying,
    testVoice,
  } = useVoicePraiseStore();

  const handleTestVoice = () => {
    if (selectedVoiceId) {
      const voice = availableVoices.find(v => v.voice_id === selectedVoiceId);
      if (voice) {
        testVoice(selectedVoiceId, `Hello! I'm ${voice.name}. This is how I'll encourage you during your reading sessions. Good girl, reader!`);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Voice Settings</h2>
      </CardHeader>
      <CardBody className="space-y-6">
        {/* Enable/Disable Voice */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-white">Voice Assistant</h3>
            <p className="text-sm text-gray-400">
              Enable or disable voice encouragement during reading
            </p>
          </div>
          <Button
            variant={settings.enabled ? 'primary' : 'outline'}
            onClick={() => updateSettings({ enabled: !settings.enabled })}
          >
            {settings.enabled ? 'Enabled' : 'Disabled'}
          </Button>
        </div>

        {/* Volume Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Volume: {Math.round(settings.volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.volume}
            onChange={(e) => updateSettings({ volume: parseFloat(e.target.value) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!settings.enabled}
          />
        </div>

        {/* Voice Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Voice Speed: {voiceSpeed.toFixed(1)}x
          </label>
          <input
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            value={voiceSpeed}
            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!settings.enabled}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0.5x (Slow)</span>
            <span>1.0x (Normal)</span>
            <span>2.0x (Fast)</span>
          </div>
        </div>

        {/* Voice Stability Control */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Voice Stability: {Math.round(voiceStability * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={voiceStability}
            onChange={(e) => setVoiceStability(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            disabled={!settings.enabled}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0% (Variable)</span>
            <span>50% (Balanced)</span>
            <span>100% (Consistent)</span>
          </div>
        </div>

        {/* Frequency Setting */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Praise Frequency
          </label>
          <select
            value={settings.frequency}
            onChange={(e) => updateSettings({ frequency: e.target.value as any })}
            className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
            disabled={!settings.enabled}
          >
            <option value="low">Low - Major milestones only</option>
            <option value="medium">Medium - Regular encouragement</option>
            <option value="high">High - Frequent praise</option>
          </select>
        </div>

        {/* Time Restrictions */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Active Hours
          </label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">From</label>
              <input
                type="time"
                value={settings.timeRestrictions.start}
                onChange={(e) => updateSettings({
                  timeRestrictions: { ...settings.timeRestrictions, start: e.target.value }
                })}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                disabled={!settings.enabled}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs text-gray-500 mb-1">To</label>
              <input
                type="time"
                value={settings.timeRestrictions.end}
                onChange={(e) => updateSettings({
                  timeRestrictions: { ...settings.timeRestrictions, end: e.target.value }
                })}
                className="w-full p-2 border border-gray-700 rounded-lg bg-gray-800 text-white"
                disabled={!settings.enabled}
              />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Voice messages will only play during these hours
          </p>
        </div>

        {/* Test Voice with Current Settings */}
        <div className="pt-4 border-t border-gray-700">
          <Button
            onClick={handleTestVoice}
            disabled={!selectedVoiceId || isPlaying || !settings.enabled}
            className="w-full"
          >
            {isPlaying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing Voice...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                Test Voice with Current Settings
              </>
            )}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default VoiceSettings;
