import React, { useState } from 'react';
import MainLayout from '../components/layout/MainLayout';
import { Card, CardBody, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { 
  Plus, 
  Check, 
  X, 
  Calendar, 
  Clock, 
  BookOpen, 
  Edit, 
  Trash2, 
  Bell, 
  Sparkles,
  ChevronDown,
  Save,
  Flame,
  Coffee,
  Droplet,
  Pencil,
  Headphones,
  Smartphone,
  Zap,
  Heart,
  Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import GoogleCalendar from '../components/productivity/GoogleCalendar';

// Predefined habits by category
const PREDEFINED_HABITS = {
  reading: [
    { name: 'Daily Reading Ritual', icon: '📚', description: 'Read for at least 30 minutes every day' },
    { name: 'Conquer a Chapter', icon: '📖', description: 'Complete at least one chapter daily' },
    { name: 'Tame the TBR Hydra', icon: '🐉', description: 'Reduce your to-be-read pile' },
    { name: 'Rate the Spice', icon: '🌶️', description: 'Rate the spice level of what you read today' },
    { name: 'Explore New Tropes', icon: '🔍', description: 'Try a book with a trope you haven\'t read before' },
    { name: 'Expand the Library', icon: '🏛️', description: 'Add a new book to your collection' },
    { name: 'Leave an Offering (Review)', icon: '✍️', description: 'Write a review for a completed book' },
    { name: 'Share the Lore', icon: '📣', description: 'Share your reading progress or thoughts' }
  ],
  personal: [
    { name: 'Hone Your Craft', icon: '🧵', description: 'Practice a creative skill for 20 minutes' },
    { name: 'Decipher Ancient Tomes', icon: '📜', description: 'Learn something new today' },
    { name: 'Train for Battle (Fitness)', icon: '💪', description: 'Complete a workout or physical activity' },
    { name: 'Brew a Potion (Hydration)', icon: '🧪', description: 'Drink at least 8 glasses of water' },
    { name: 'Mind Fortress (Meditation)', icon: '🧘', description: 'Meditate for at least 10 minutes' },
    { name: 'Scry the Soul (Journaling)', icon: '📓', description: 'Write in your journal' },
    { name: 'Seek Forbidden Knowledge', icon: '🔮', description: 'Research a topic you\'re curious about' }
  ],
  productivity: [
    { name: 'Dominate the Day', icon: '📅', description: 'Plan your day in the morning' },
    { name: 'Slay the Inbox Dragon', icon: '📧', description: 'Clear your email inbox' },
    { name: 'Sanctum Upkeep', icon: '🧹', description: 'Clean or organize your space' },
    { name: 'Forge Alliances (Social)', icon: '🤝', description: 'Connect with a friend or family member' },
    { name: 'Manage the Treasury', icon: '💰', description: 'Review your finances' },
    { name: 'Organize the Armory', icon: '🗃️', description: 'Declutter a space or digital files' },
    { name: 'Prepare Provisions (Meal Prep)', icon: '🍱', description: 'Prepare meals in advance' }
  ]
};

const ProductivityHabitsPage: React.FC = () => {
  const [habits, setHabits] = useState([
    { id: '1', name: 'Read for 30 minutes', completed: false, streak: 5, icon: '📚', description: 'Daily reading session' },
    { id: '2', name: 'Drink water', completed: true, streak: 12, icon: '💧', description: 'Stay hydrated while reading' },
    { id: '3', name: 'No phone during reading', completed: false, streak: 3, icon: '📵', description: 'Distraction-free reading time' }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [customIcon, setCustomIcon] = useState('📚');
  const [customDescription, setCustomDescription] = useState('');
  const [isCalendarConnected, setIsCalendarConnected] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('reading');
  const [selectedPredefinedHabit, setSelectedPredefinedHabit] = useState<number | null>(null);
  
  const handleAddHabit = () => {
    let habitName = newHabitName;
    let habitIcon = customIcon;
    let habitDescription = customDescription;
    
    // If a predefined habit is selected, use its values
    if (selectedPredefinedHabit !== null) {
      const predefinedHabit = PREDEFINED_HABITS[selectedCategory as keyof typeof PREDEFINED_HABITS][selectedPredefinedHabit];
      habitName = predefinedHabit.name;
      habitIcon = predefinedHabit.icon;
      habitDescription = predefinedHabit.description;
    }
    
    if (habitName.trim()) {
      const newHabit = {
        id: Date.now().toString(),
        name: habitName,
        completed: false,
        streak: 0,
        icon: habitIcon,
        description: habitDescription
      };
      
      setHabits([...habits, newHabit]);
      setShowAddModal(false);
      setNewHabitName('');
      setCustomIcon('📚');
      setCustomDescription('');
      setSelectedPredefinedHabit(null);
    }
  };
  
  const handleToggleHabit = (id: string) => {
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };
  
  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };
  
  const handleSelectPredefinedHabit = (index: number) => {
    const habit = PREDEFINED_HABITS[selectedCategory as keyof typeof PREDEFINED_HABITS][index];
    setSelectedPredefinedHabit(index);
    setNewHabitName(habit.name);
    setCustomIcon(habit.icon);
    setCustomDescription(habit.description);
  };
  
  const renderIconOptions = () => {
    const icons = ['📚', '💧', '🏃', '🧘', '🌙', '☀️', '📝', '🎯', '⏰', '🍎', '🧠', '❤️', '📵', '🔄', '👥', '⭐'];
    
    return (
      <div className="grid grid-cols-8 gap-2">
        {icons.map((icon, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setCustomIcon(icon)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${
              customIcon === icon ? 'bg-accent text-white' : 'bg-card hover:bg-border'
            }`}
          >
            {icon}
          </button>
        ))}
      </div>
    );
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Reading Habits</h1>
            <p className="text-gray-400">Build consistent reading habits and track your progress</p>
          </div>
          <Button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center"
          >
            <Plus size={18} className="mr-2" />
            Add Habit
          </Button>
        </div>
        
        {/* Calendar Connection */}
        <Card>
          <CardBody className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-700/30 mr-4">
                <Calendar className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Connect Calendar</h3>
                <p className="text-sm text-gray-400">Sync your reading habits with your calendar</p>
              </div>
            </div>
            <Button
              variant={isCalendarConnected ? "outline" : "primary"}
              onClick={() => setIsCalendarConnected(!isCalendarConnected)}
            >
              {isCalendarConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </CardBody>
        </Card>

        {isCalendarConnected && <GoogleCalendar />}
        
        {/* Habits List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {habits.map((habit) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group"
            >
              <Card className={`overflow-hidden transition-all duration-300 ${
                habit.completed ? 'border-success-600/50 bg-success-900/10' : ''
              }`}>
                <CardBody className="p-0">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex items-center justify-center text-xl rounded-lg bg-card border border-border mr-3">
                          {habit.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{habit.name}</h3>
                          <p className="text-xs text-gray-400">{habit.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleToggleHabit(habit.id)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            habit.completed 
                              ? 'bg-success-600/20 text-success-400 hover:bg-success-600/30' 
                              : 'bg-card hover:bg-border text-gray-400 hover:text-white'
                          }`}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteHabit(habit.id)}
                          className="w-8 h-8 rounded-lg bg-card hover:bg-border text-gray-400 hover:text-error-400 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Flame className="h-4 w-4 text-accent mr-1" />
                        <span className="text-gray-400">
                          {habit.streak} day streak
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        {habit.completed ? 'Completed today' : 'Not completed yet'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="h-1 w-full bg-border">
                    <div 
                      className="h-full bg-accent transition-all duration-500"
                      style={{ width: habit.completed ? '100%' : '0%' }}
                    ></div>
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Add Habit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg max-h-[90vh] flex flex-col"
            >
              <Card className="flex flex-col max-h-full">
                <CardHeader className="flex flex-row items-center justify-between border-b border-border flex-shrink-0">
                  <h2 className="text-xl font-bold text-white">Add New Reading Habit</h2>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </CardHeader>
                <CardBody className="p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Habit Category
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.keys(PREDEFINED_HABITS).map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(category);
                              setSelectedPredefinedHabit(null);
                            }}
                            className={`p-2 rounded-lg text-center transition-all ${
                              selectedCategory === category 
                                ? 'bg-accent/20 border border-accent/50 text-white' 
                                : 'bg-card border border-border text-gray-400 hover:bg-border'
                            }`}
                          >
                            <div className="capitalize">{category}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Predefined Habits */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Select a Predefined Habit
                      </label>
                      <div className="max-h-48 overflow-y-auto border border-border rounded-lg divide-y divide-border">
                        {PREDEFINED_HABITS[selectedCategory as keyof typeof PREDEFINED_HABITS].map((habit, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleSelectPredefinedHabit(index)}
                            className={`w-full p-3 text-left flex items-center transition-all ${
                              selectedPredefinedHabit === index 
                                ? 'bg-accent/20 text-white' 
                                : 'hover:bg-card text-gray-300'
                            }`}
                          >
                            <span className="text-xl mr-3">{habit.icon}</span>
                            <div>
                              <div className="font-medium">{habit.name}</div>
                              <div className="text-xs text-gray-400">{habit.description}</div>
                            </div>
                            {selectedPredefinedHabit === index && (
                              <Check className="ml-auto h-5 w-5 text-accent" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="border-t border-border pt-4">
                      <h3 className="text-lg font-medium text-white mb-4">Customize Habit</h3>
                      
                      {/* Custom Habit Name */}
                      <div className="mb-4">
                        <Input
                          label="Habit Name"
                          value={newHabitName}
                          onChange={(e) => setNewHabitName(e.target.value)}
                          placeholder="e.g., Read for 30 minutes"
                          fullWidth
                        />
                      </div>
                      
                      {/* Custom Description */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Description
                        </label>
                        <textarea
                          value={customDescription}
                          onChange={(e) => setCustomDescription(e.target.value)}
                          placeholder="Brief description of this habit"
                          className="w-full p-3 bg-card border border-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent"
                          rows={2}
                        />
                      </div>
                      
                      {/* Icon Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Icon
                        </label>
                        {renderIconOptions()}
                      </div>
                    </div>
                  </div>
                </CardBody>
                
                {/* Action Buttons - Fixed at bottom */}
                <div className="flex justify-end space-x-3 p-4 border-t border-border mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddModal(false)}
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAddHabit}
                    disabled={!newHabitName.trim()}
                  >
                    <Save size={18} className="mr-2" />
                    Save Habit
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
        
        {/* Tips Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-white">Reading Habit Tips</h2>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="p-2 bg-purple-900/20 rounded-lg border border-purple-700/30 mr-3">
                  <Clock className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Consistent Time</h3>
                  <p className="text-sm text-gray-400">Read at the same time each day to build a strong habit.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-green-900/20 rounded-lg border border-green-700/30 mr-3">
                  <BookOpen className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Start Small</h3>
                  <p className="text-sm text-gray-400">Begin with just 10 minutes of reading and gradually increase.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-blue-900/20 rounded-lg border border-blue-700/30 mr-3">
                  <Bell className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Set Reminders</h3>
                  <p className="text-sm text-gray-400">Use notifications to remind you of your reading time.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 bg-amber-900/20 rounded-lg border border-amber-700/30 mr-3">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Reward Yourself</h3>
                  <p className="text-sm text-gray-400">Celebrate streaks and milestones to stay motivated.</p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ProductivityHabitsPage;