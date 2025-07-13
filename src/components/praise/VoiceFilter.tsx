import React from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { User, Users } from 'lucide-react';

interface VoiceFilterProps {
  genderFilter: 'all' | 'male' | 'female';
  styleFilter: string;
  onGenderFilterChange: (filter: 'all' | 'male' | 'female') => void;
  onStyleFilterChange: (filter: string) => void;
}

const VoiceFilter: React.FC<VoiceFilterProps> = ({
  genderFilter,
  styleFilter,
  onGenderFilterChange,
  onStyleFilterChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Filter Voices</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gender Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Voice Gender
            </label>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Voices', icon: Users },
                { value: 'male', label: 'Male', icon: User },
                { value: 'female', label: 'Female', icon: User },
              ].map(({ value, label, icon: Icon }) => (
                <Button
                  key={value}
                  variant={genderFilter === value ? 'primary' : 'outline'}
                  onClick={() => onGenderFilterChange(value as any)}
                  className="flex items-center"
                  size="sm"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Style Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Voice Style
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Styles' },
                { value: 'flirty', label: 'Flirty' },
                { value: 'dominant', label: 'Dominant' },
                { value: 'wholesome', label: 'Wholesome' },
                { value: 'playful_dom', label: 'Playful Dom' },
                { value: 'seductive', label: 'Seductive' },
                { value: 'confident', label: 'Confident' },
                { value: 'mysterious', label: 'Mysterious' },
                { value: 'passionate', label: 'Passionate' },
                { value: 'sultry', label: 'Sultry' },
                { value: 'dreamy', label: 'Dreamy' },
                { value: 'dark', label: 'Dark' },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={styleFilter === value ? 'primary' : 'outline'}
                  onClick={() => onStyleFilterChange(value)}
                  size="sm"
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default VoiceFilter;
