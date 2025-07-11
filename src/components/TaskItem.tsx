import React, { useState } from 'react';
import { Task } from '../types';
import { Check, X } from 'lucide-react';
import { cn } from '../utils/cn';
import { useVoicePraiseStore } from '../store/voicePraiseStore';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onComplete, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { testVoice, selectedVoiceId } = useVoicePraiseStore();
  
  const handleComplete = (id: string, completed: boolean) => {
    onComplete(id, completed);
    
    if (completed && selectedVoiceId) {
      // Play specific task completion message
      testVoice(selectedVoiceId, "Every time you finish a task, you make it harder for me to behave.");
    }
  };
  
  return (
    <div 
      className={cn(
        'flex items-center justify-between p-3 mb-2 rounded-lg transition-all duration-200',
        task.completed ? 'bg-card/70' : 'bg-card',
        'hover:border-accent hover:shadow-red'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <button
          onClick={() => handleComplete(task.id, !task.completed)}
          className={cn(
            'w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-all duration-200',
            task.completed 
              ? 'bg-accent text-accent-text' 
              : 'border-2 border-border hover:border-accent'
          )}
        >
          {task.completed && <Check size={14} />}
        </button>
        
        <span 
          className={cn(
            'transition-all duration-200 font-lato',
            task.completed && 'line-through text-secondary-text'
          )}
        >
          {task.title}
        </span>
      </div>
      
      {isHovered && (
        <button
          onClick={() => onDelete(task.id)}
          className="text-secondary-text hover:text-accent transition-colors duration-200"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default TaskItem;