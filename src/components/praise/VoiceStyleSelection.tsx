import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { CheckCircle } from 'lucide-react';

interface VoiceStyleSelectionProps {
  style: string;
  onStyleChange: (style: 'flirty' | 'dominant' | 'wholesome') => void;
}

const VoiceStyleSelection: React.FC<VoiceStyleSelectionProps> = ({ style, onStyleChange }) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Choose Your Style</h2>
        <p className="text-gray-400">Select the personality that matches your preference</p>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              value: 'flirty',
              label: 'Flirty & Fun',
              description: 'Playful, seductive, and encouraging',
              icon: '😘'
            },
            {
              value: 'dominant',
              label: 'Dominant & Commanding',
              description: 'Strong, assertive, and demanding',
              icon: '🔥'
            },
            {
              value: 'wholesome',
              label: 'Calm & Supportive',
              description: 'Gentle, warm, and nurturing',
              icon: '🤗'
            }
          ].map((item) => (
            <div
              key={item.value}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                style === item.value
                  ? 'border-primary-500 bg-primary-900/20 ring-2 ring-primary-500/30'
                  : 'border-gray-700 hover:border-primary-500/50 bg-gray-800'
              }`}
              onClick={() => onStyleChange(item.value as any)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h3 className="font-semibold text-lg text-white mb-1">{item.label}</h3>
                <p className="text-sm text-gray-400">{item.description}</p>
                {style === item.value && (
                  <div className="flex items-center justify-center text-primary-400 text-sm font-medium mt-2">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default VoiceStyleSelection;
