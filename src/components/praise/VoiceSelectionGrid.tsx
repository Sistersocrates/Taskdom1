import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Loader2, Play, CheckCircle, Volume2 } from 'lucide-react';
import { ElevenLabsVoice } from '../../services/elevenLabsService';

interface VoiceSelectionGridProps {
  voices: ElevenLabsVoice[];
  selectedVoiceId: string | null;
  isPlaying: boolean;
  testingVoiceId: string | null;
  onVoiceSelect: (voiceId: string) => void;
  onTestVoice: (voiceId: string, voiceName: string) => void;
}

const VoiceSelectionGrid: React.FC<VoiceSelectionGridProps> = ({
  voices,
  selectedVoiceId,
  isPlaying,
  testingVoiceId,
  onVoiceSelect,
  onTestVoice,
}) => {
  const getVoiceGender = (voiceId: string): 'male' | 'female' => {
    const maleVoices = [
      'EkK5I93UQWFDigLMpZcX',
      'G17SuINrv2H9FC6nvetn',
      'IRHApOXLvnW57QJPQH2P',
      'f78MbfpvmG3q9e8TMpTG',
      'rWyjfFeMZ6PxkHqD3wGC',
      'YDCfZMLWcUmsGvqHq0rS',
      'T3b0vsQ5dQwMZ5ckOwBk',
      'XTdzBt8oIEvodkwhxeA0'
    ];
    return maleVoices.includes(voiceId) ? 'male' : 'female';
  };

  const getStyleColor = (style: string) => {
    switch (style) {
      case 'flirty': return 'bg-pink-900/30 text-pink-300';
      case 'dominant': return 'bg-red-900/30 text-red-300';
      case 'wholesome': return 'bg-green-900/30 text-green-300';
      case 'playful_dom': return 'bg-purple-900/30 text-purple-300';
      case 'seductive': return 'bg-rose-900/30 text-rose-300';
      case 'confident': return 'bg-blue-900/30 text-blue-300';
      case 'mysterious': return 'bg-indigo-900/30 text-indigo-300';
      case 'passionate': return 'bg-orange-900/30 text-orange-300';
      case 'sultry': return 'bg-amber-900/30 text-amber-300';
      case 'dreamy': return 'bg-teal-900/30 text-teal-300';
      case 'dark': return 'bg-violet-900/30 text-violet-300';
      default: return 'bg-gray-800 text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Choose Your Voice</h2>
        <p className="text-gray-400">
          Select a voice that matches your preference and style
        </p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {voices.map((voice) => (
            <div
              key={voice.voice_id}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                selectedVoiceId === voice.voice_id
                  ? 'border-primary-500 bg-primary-900/20 ring-2 ring-primary-500/30'
                  : 'border-gray-700 hover:border-primary-500/50 bg-gray-800'
              }`}
              onClick={() => onVoiceSelect(voice.voice_id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-white">{voice.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStyleColor(voice.category)}`}>
                      {voice.category}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-gray-700 text-gray-300">
                      {getVoiceGender(voice.voice_id)}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTestVoice(voice.voice_id, voice.name);
                  }}
                  disabled={isPlaying}
                  variant="outline"
                  size="sm"
                  className="ml-2"
                >
                  {testingVoiceId === voice.voice_id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {voice.description && (
                <p className="text-sm text-gray-400 mb-3">
                  {voice.description}
                </p>
              )}

              {selectedVoiceId === voice.voice_id && (
                <div className="flex items-center text-primary-400 text-sm font-medium">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {voices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Volume2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No voices found matching your filters.</p>
            <p className="text-sm">Try adjusting your filter settings.</p>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default VoiceSelectionGrid;
