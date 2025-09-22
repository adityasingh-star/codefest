import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  MessageCircle, 
  Moon, 
  Activity,  
  Heart, 
  Settings, 
  Bell, 
  User,
  Send,

  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  Star,
  BookOpen,
  Headphones
} from 'lucide-react';

// Types
interface MoodEntry {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  notes: string;
}

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  quality: number;
  duration: number;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Mock AI responses
const aiResponses = [
  "I understand you're going through a tough time. Remember that it's okay to feel this way, and you're not alone.",
  "That sounds challenging. What's one small thing you could do today to take care of yourself?",
  "Thank you for sharing that with me. How are you feeling right now in this moment?",
  "It's great that you're reaching out. What support do you feel you need most right now?",
  "I hear you. Sometimes just talking about our feelings can help. What's been on your mind lately?",
  "That's a positive step forward. How can we build on this feeling?",
  "It's completely normal to have ups and downs. What usually helps you feel more grounded?"
];

const MentalHealthApp = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [sleepEntries, setSleepEntries] = useState<SleepEntry[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! I'm here to support you. How are you feeling today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [meditationTime, setMeditationTime] = useState(300); // 5 minutes default
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(meditationTime);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerActive(false);
      setTimeRemaining(meditationTime);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining, meditationTime]);

  // Add mood entry
  const addMoodEntry = (mood: MoodEntry['mood'], notes: string) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood,
      notes
    };
    setMoodEntries([newEntry, ...moodEntries]);
  };

  // Add sleep entry
  const addSleepEntry = (bedtime: string, wakeTime: string, quality: number) => {
    const bed = new Date(`2024-01-01T${bedtime}`);
    let wake = new Date(`2024-01-01T${wakeTime}`);
    if (wake < bed) wake.setDate(wake.getDate() + 1);
    
    const duration = (wake.getTime() - bed.getTime()) / (1000 * 60 * 60);
    
    const newEntry: SleepEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      bedtime,
      wakeTime,
      quality,
      duration: Math.round(duration * 10) / 10
    };
    setSleepEntries([newEntry, ...sleepEntries]);
  };

  // Send chat message
  const sendMessage = () => {
    if (!currentMessage.trim()) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        isUser: false,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  // Format time for timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case 'great': return <Smile className="w-6 h-6 text-green-500" />;
      case 'good': return <Smile className="w-6 h-6 text-blue-500" />;
      case 'okay': return <Meh className="w-6 h-6 text-yellow-500" />;
      case 'bad': return <Frown className="w-6 h-6 text-orange-500" />;
      case 'terrible': return <Frown className="w-6 h-6 text-red-500" />;
      default: return <Meh className="w-6 h-6" />;
    }
  };

  // Navigation
  const navItems = [
    { id: 'dashboard', icon: Activity, label: 'Dashboard' },
    { id: 'chat', icon: MessageCircle, label: 'AI Chat' },
    { id: 'mood', icon: Heart, label: 'Mood' },
    { id: 'sleep', icon: Moon, label: 'Sleep' },
    { id: 'meditation', icon: Brain, label: 'Meditation' },
    { id: 'resources', icon: BookOpen, label: 'Resources' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              MindWell
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
            <Settings className="w-6 h-6 text-gray-600 hover:text-purple-600 cursor-pointer" />
            <User className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full p-1 cursor-pointer" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/50'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Today's Mood</p>
                          <div className="flex items-center space-x-2 mt-2">
                            {moodEntries.length > 0 ? getMoodIcon(moodEntries[0].mood) : <Meh className="w-6 h-6 text-gray-400" />}
                            <span className="text-xl font-semibold capitalize">
                              {moodEntries.length > 0 ? moodEntries[0].mood : 'Not set'}
                            </span>
                          </div>
                        </div>
                        <Heart className="w-12 h-12 text-purple-200" />
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Sleep Quality</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    sleepEntries.length > 0 && i < sleepEntries[0].quality
                                      ? 'text-yellow-500 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-xl font-semibold">
                              {sleepEntries.length > 0 ? `${sleepEntries[0].duration}h` : '0h'}
                            </span>
                          </div>
                        </div>
                        <Moon className="w-12 h-12 text-blue-200" />
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-600 text-sm">Streak</p>
                          <p className="text-3xl font-bold text-purple-600 mt-2">7 days</p>
                        </div>
                        <TrendingUp className="w-12 h-12 text-green-200" />
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <button
                        onClick={() => setActiveTab('mood')}
                        className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 transition-all"
                      >
                        <Heart className="w-8 h-8 text-pink-600" />
                        <span className="text-sm font-medium text-pink-800">Log Mood</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('chat')}
                        className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 transition-all"
                      >
                        <MessageCircle className="w-8 h-8 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">Chat with AI</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('meditation')}
                        className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 transition-all"
                      >
                        <Brain className="w-8 h-8 text-purple-600" />
                        <span className="text-sm font-medium text-purple-800">Meditate</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('sleep')}
                        className="flex flex-col items-center space-y-2 p-4 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 hover:from-indigo-200 hover:to-blue-200 transition-all"
                      >
                        <Moon className="w-8 h-8 text-indigo-600" />
                        <span className="text-sm font-medium text-indigo-800">Log Sleep</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* AI Chat */}
              {activeTab === 'chat' && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 h-[600px] flex flex-col"
                >
                  <div className="p-6 border-b border-white/20">
                    <h2 className="text-2xl font-semibold">AI Support Chat</h2>
                    <p className="text-gray-600 mt-1">Talk to our AI companion for emotional support</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {chatMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isUser
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                              : 'bg-white/80 text-gray-800'
                          }`}
                        >
                          <p>{message.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-6 border-t border-white/20">
                    <div className="flex space-x-4">
                      <input
                        type="text"
                        value={currentMessage}
                        onChange={(e) => setCurrentMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={sendMessage}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Mood Tracker */}
              {activeTab === 'mood' && (
                <motion.div
                  key="mood"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-semibold mb-6">How are you feeling today?</h2>
                    
                    <MoodLogger onAddMood={addMoodEntry} />
                  </div>

                  {moodEntries.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4">Recent Entries</h3>
                      <div className="space-y-4">
                        {moodEntries.slice(0, 5).map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
                            <div className="flex items-center space-x-3">
                              {getMoodIcon(entry.mood)}
                              <div>
                                <p className="font-medium capitalize">{entry.mood}</p>
                                <p className="text-sm text-gray-600">{entry.date}</p>
                              </div>
                            </div>
                            {entry.notes && (
                              <p className="text-sm text-gray-600 max-w-xs truncate">{entry.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Sleep Tracker */}
              {activeTab === 'sleep' && (
                <motion.div
                  key="sleep"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-semibold mb-6">Sleep Tracker</h2>
                    
                    <SleepLogger onAddSleep={addSleepEntry} />
                  </div>

                  {sleepEntries.length > 0 && (
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4">Sleep History</h3>
                      <div className="space-y-4">
                        {sleepEntries.slice(0, 5).map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-white/40 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <Moon className="w-6 h-6 text-blue-500" />
                              <div>
                                <p className="font-medium">{entry.duration} hours</p>
                                <p className="text-sm text-gray-600">{entry.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < entry.quality ? 'text-yellow-500 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">
                                {entry.bedtime} - {entry.wakeTime}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Meditation */}
              {activeTab === 'meditation' && (
                <motion.div
                  key="meditation"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
                    <h2 className="text-2xl font-semibold mb-6">Meditation Timer</h2>
                    
                    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-8">
                      <div className="text-4xl font-bold text-purple-700">
                        {formatTime(timeRemaining)}
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4 mb-8">
                      <button
                        onClick={() => setMeditationTime(300)}
                        className={`px-4 py-2 rounded-lg ${meditationTime === 300 ? 'bg-purple-500 text-white' : 'bg-white/50'}`}
                      >
                        5 min
                      </button>
                      <button
                        onClick={() => setMeditationTime(600)}
                        className={`px-4 py-2 rounded-lg ${meditationTime === 600 ? 'bg-purple-500 text-white' : 'bg-white/50'}`}
                      >
                        10 min
                      </button>
                      <button
                        onClick={() => setMeditationTime(900)}
                        className={`px-4 py-2 rounded-lg ${meditationTime === 900 ? 'bg-purple-500 text-white' : 'bg-white/50'}`}
                      >
                        15 min
                      </button>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => setIsTimerActive(!isTimerActive)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:shadow-lg transition-all flex items-center space-x-2"
                      >
                        {isTimerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                        <span>{isTimerActive ? 'Pause' : 'Start'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsTimerActive(false);
                          setTimeRemaining(meditationTime);
                        }}
                        className="px-6 py-3 bg-white/50 text-gray-700 rounded-xl hover:bg-white/70 transition-all flex items-center space-x-2"
                      >
                        <RotateCcw className="w-5 h-5" />
                        <span>Reset</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4">Breathing Exercise</h3>
                      <p className="text-gray-600 mb-4">Follow the 4-7-8 breathing technique</p>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span>Inhale for 4 counts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                          <span>Hold for 7 counts</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span>Exhale for 8 counts</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                      <h3 className="text-xl font-semibold mb-4">Guided Sessions</h3>
                      <div className="space-y-3">
                        <button className="w-full flex items-center space-x-3 p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-all">
                          <Headphones className="w-5 h-5 text-purple-600" />
                          <span>Stress Relief (10 min)</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-all">
                          <Headphones className="w-5 h-5 text-blue-600" />
                          <span>Sleep Preparation (15 min)</span>
                        </button>
                        <button className="w-full flex items-center space-x-3 p-3 bg-white/40 rounded-xl hover:bg-white/60 transition-all">
                          <Headphones className="w-5 h-5 text-green-600" />
                          <span>Mindfulness (5 min)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Resources */}
              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h2 className="text-2xl font-semibold mb-6">Mental Health Resources</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-purple-700">Crisis Support</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                            <h4 className="font-semibold text-red-800">National Suicide Prevention Lifeline</h4>
                            <p className="text-red-600">988</p>
                          </div>
                          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
                            <h4 className="font-semibold text-orange-800">Crisis Text Line</h4>
                            <p className="text-orange-600">Text HOME to 741741</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-blue-700">Professional Help</h3>
                        <div className="space-y-3">
                          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                            <h4 className="font-semibold text-blue-800">Find a Therapist</h4>
                            <p className="text-blue-600 text-sm">Psychology Today directory</p>
                          </div>
                          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <h4 className="font-semibold text-green-800">Teletherapy Options</h4>
                            <p className="text-green-600 text-sm">BetterHelp, Talkspace, Cerebral</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-lg font-semibold text-green-700 mb-4">Self-Help Resources</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-white/40 rounded-xl">
                          <BookOpen className="w-8 h-8 text-purple-600 mb-3" />
                          <h4 className="font-semibold">Articles & Guides</h4>
                          <p className="text-sm text-gray-600 mt-2">Evidence-based mental health information</p>
                        </div>
                        <div className="p-4 bg-white/40 rounded-xl">
                          <Headphones className="w-8 h-8 text-blue-600 mb-3" />
                          <h4 className="font-semibold">Podcasts</h4>
                          <p className="text-sm text-gray-600 mt-2">Mental health podcasts and audio content</p>
                        </div>
                        <div className="p-4 bg-white/40 rounded-xl">
                          <Heart className="w-8 h-8 text-pink-600 mb-3" />
                          <h4 className="font-semibold">Support Groups</h4>
                          <p className="text-sm text-gray-600 mt-2">Connect with others facing similar challenges</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                      <h4 className="font-semibold text-yellow-800 mb-2">Disclaimer</h4>
                      <p className="text-yellow-700 text-sm">
                        This app provides general mental health support and is not a substitute for professional medical advice, 
                        diagnosis, or treatment. Always seek the advice of qualified health providers with questions about your mental health.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Mood Logger Component
const MoodLogger = ({ onAddMood }: { onAddMood: (mood: MoodEntry['mood'], notes: string) => void }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [notes, setNotes] = useState('');

  const moods = [
    { value: 'terrible' as const, label: 'Terrible', color: 'text-red-500', emoji: '😢' },
    { value: 'bad' as const, label: 'Bad', color: 'text-orange-500', emoji: '😞' },
    { value: 'okay' as const, label: 'Okay', color: 'text-yellow-500', emoji: '😐' },
    { value: 'good' as const, label: 'Good', color: 'text-blue-500', emoji: '😊' },
    { value: 'great' as const, label: 'Great', color: 'text-green-500', emoji: '😄' },
  ];

  const handleSubmit = () => {
    if (selectedMood) {
      onAddMood(selectedMood, notes);
      setSelectedMood(null);
      setNotes('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => setSelectedMood(mood.value)}
            className={`p-4 rounded-xl transition-all ${
              selectedMood === mood.value
                ? 'bg-white shadow-lg scale-105'
                : 'bg-white/40 hover:bg-white/60'
            }`}
          >
            <div className="text-3xl mb-2">{mood.emoji}</div>
            <div className={`text-sm font-medium ${mood.color}`}>{mood.label}</div>
          </button>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes (optional)
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="How are you feeling? What happened today?"
          className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedMood}
        className={`w-full px-6 py-3 rounded-xl transition-all ${
          selectedMood
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Save Mood Entry
      </button>
    </div>
  );
};

// Sleep Logger Component
const SleepLogger = ({ onAddSleep }: { onAddSleep: (bedtime: string, wakeTime: string, quality: number) => void }) => {
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState(0);

  const handleSubmit = () => {
    if (bedtime && wakeTime && quality > 0) {
      onAddSleep(bedtime, wakeTime, quality);
      setBedtime('');
      setWakeTime('');
      setQuality(0);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedtime
          </label>
          <input
            type="time"
            value={bedtime}
            onChange={(e) => setBedtime(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wake Time
          </label>
          <input
            type="time"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sleep Quality
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => setQuality(star)}
              className={`p-2 transition-all ${
                star <= quality ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
              }`}
            >
              <Star className={`w-8 h-8 ${star <= quality ? 'fill-current' : ''}`} />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!bedtime || !wakeTime || quality === 0}
        className={`w-full px-6 py-3 rounded-xl transition-all ${
          bedtime && wakeTime && quality > 0
            ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Save Sleep Entry
      </button>
    </div>
  );
};

export default MentalHealthApp;