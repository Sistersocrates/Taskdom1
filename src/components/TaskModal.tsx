import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Card, CardBody, CardHeader } from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import { motion } from 'framer-motion';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskName: string) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave }) => {
  const [taskName, setTaskName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName.trim()) {
      onSave(taskName);
      setTaskName('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800">
            <h2 className="text-xl font-bold text-white">Add New Task</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Task Name"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name..."
                fullWidth
                autoFocus
              />
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!taskName.trim()}
                >
                  Save
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
};

export default TaskModal;