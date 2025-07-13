import React, { useState } from 'react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';
import { useVoicePraiseStore } from '../../store/voicePraiseStore';
import { useUserStore } from '../../store/userStore';

const CustomScripts: React.FC = () => {
  const { customScripts, addCustomScript, settings } = useVoicePraiseStore();
  const { user } = useUserStore();
  const [newScriptText, setNewScriptText] = useState('');
  const [newScriptTrigger, setNewScriptTrigger] = useState('session_start');

  const handleAddScript = () => {
    if (newScriptText.trim()) {
      addCustomScript({
        text: newScriptText,
        trigger: newScriptTrigger,
        tone: settings.style,
        nsfw_level: user?.settings.mode === 'sfw' ? 'SFW' : 'NSFW',
        scenario: 'Custom',
        pack: 'Custom'
      });
      setNewScriptText('');
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold text-white">Add Your Own Praise Lines</h2>
        <p className="text-gray-400">These scripts will be added to the rotation for the selected trigger.</p>
      </CardHeader>
      <CardBody>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Praise Text</label>
            <textarea
              value={newScriptText}
              onChange={(e) => setNewScriptText(e.target.value)}
              placeholder="e.g., You're doing amazing, sweetie!"
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trigger</label>
            <select
              value={newScriptTrigger}
              onChange={(e) => setNewScriptTrigger(e.target.value)}
              className="w-full p-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-800 text-white"
            >
              <option value="session_start">Session Start</option>
              <option value="session_end">Session End</option>
              <option value="task_complete">Task Complete</option>
              <option value="daily_goal">Daily Goal Met</option>
              <option value="spicy_scene">Spicy Scene Marked</option>
            </select>
          </div>
          <Button onClick={handleAddScript}>
            <Plus className="h-4 w-4 mr-2" />
            Add Script
          </Button>
        </div>
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-2">Your Custom Scripts</h3>
          <div className="space-y-2">
            {customScripts.map(script => (
              <div key={script.id} className="p-3 bg-gray-800 rounded-lg flex items-center justify-between">
                <div>
                  <p className="text-white">"{script.text}"</p>
                  <p className="text-xs text-gray-400">Trigger: {script.scenario}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => {
                  useVoicePraiseStore.setState(state => ({
                    customScripts: state.customScripts.filter(s => s.id !== script.id)
                  }));
                  useVoicePraiseStore.getState().saveUserPreferences();
                }}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomScripts;
