import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Target, 
  Brain, 
  Send, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Sparkles,
  GraduationCap,
  FileText,
  Users
} from 'lucide-react';

interface StudyPlan {
  id: string;
  subject: string;
  duration: string;
  difficulty: string;
  goals: string;
  plan: string;
  timestamp: Date;
}

const StudyPlanner = () => {
  const [subject, setSubject] = useState('');
  const [duration, setDuration] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [goals, setGoals] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<string>('');

  // n8n webhook URL (same as in the main app)
  const N8N_WEBHOOK_URL = 'https://adityahisop.app.n8n.cloud/webhook/073042fb-f843-43bf-a21b-bc056a57b0fc';

  // Test connection on component mount
  useEffect(() => {
    testWebhookConnection();
  }, []);

  const testWebhookConnection = async () => {
    try {
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: 'Study planner connection test',
          type: 'study_test'
        })
      });

      if (response.ok) {
        setConnectionStatus('connected');
        console.log('✅ Study planner webhook connected');
      } else {
        setConnectionStatus('error');
        console.error('❌ Study planner webhook failed:', response.status);
      }
    } catch (error) {
      setConnectionStatus('error');
      console.error('❌ Study planner webhook error:', error);
    }
  };

  const generateStudyPlan = async () => {
    if (!subject.trim() || !duration || !difficulty) return;

    setIsLoading(true);
    setCurrentPlan('');

    try {
      const studyRequest = {
        message: `Create a detailed study plan for: ${subject}. Duration: ${duration}, Difficulty: ${difficulty}. Goals: ${goals || 'General learning'}`,
        type: 'study_plan',
        subject: subject,
        duration: duration,
        difficulty: difficulty,
        goals: goals,
        timestamp: new Date().toISOString()
      };

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studyRequest)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const planText = await response.text();
      
      const newStudyPlan: StudyPlan = {
        id: Date.now().toString(),
        subject: subject,
        duration: duration,
        difficulty: difficulty,
        goals: goals,
        plan: planText || "I couldn't generate a study plan right now. Please try again.",
        timestamp: new Date()
      };

      setStudyPlans(prev => [newStudyPlan, ...prev]);
      setCurrentPlan(planText || "I couldn't generate a study plan right now. Please try again.");
      
      // Clear form
      setSubject('');
      setDuration('');
      setDifficulty('');
      setGoals('');

    } catch (error) {
      console.error('Error generating study plan:', error);
      const errorPlan = "Sorry, there was an issue connecting to the AI service. Please check your connection and try again.";
      setCurrentPlan(errorPlan);
    } finally {
      setIsLoading(false);
    }
  };

  const difficultyOptions = [
    { value: 'beginner', label: 'Beginner', color: 'text-emerald-400' },
    { value: 'intermediate', label: 'Intermediate', color: 'text-yellow-400' },
    { value: 'advanced', label: 'Advanced', color: 'text-red-400' }
  ];

  const durationOptions = [
    { value: '1 week', label: '1 Week' },
    { value: '2 weeks', label: '2 Weeks' },
    { value: '1 month', label: '1 Month' },
    { value: '3 months', label: '3 Months' },
    { value: '6 months', label: '6 Months' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-md border-b border-purple-500/30 px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => window.history.back()}
              className="w-10 h-10 bg-gray-700/50 hover:bg-gray-600/50 rounded-xl flex items-center justify-center transition-all border border-gray-600/50"
            >
              <ArrowLeft className="w-5 h-5 text-gray-300" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AI Study Planner
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              connectionStatus === 'connected' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' : 
              connectionStatus === 'error' ? 'bg-red-900/50 text-red-300 border border-red-500/30' : 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected' ? 'bg-emerald-400' : 
                connectionStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
              }`} />
              <span>{connectionStatus === 'connected' ? 'Connected' : 
                    connectionStatus === 'error' ? 'Disconnected' : 'Connecting...'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Study Plan Form */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
            >
              <div className="flex items-center space-x-3 mb-6">
                <GraduationCap className="w-8 h-8 text-purple-400" />
                <h2 className="text-2xl font-semibold text-gray-200">Create Your Study Plan</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    What do you want to study?
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., React.js, Machine Learning, Spanish, Physics..."
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200 placeholder-gray-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Study Duration
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                    >
                      <option value="">Select duration</option>
                      {durationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-200"
                    >
                      <option value="">Select level</option>
                      {difficultyOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Learning Goals (Optional)
                  </label>
                  <textarea
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="What do you hope to achieve? Any specific topics or skills?"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-gray-200 placeholder-gray-400"
                    rows={3}
                  />
                </div>

                <button
                  onClick={generateStudyPlan}
                  disabled={!subject.trim() || !duration || !difficulty || isLoading || connectionStatus === 'error'}
                  className={`w-full px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    subject.trim() && duration && difficulty && !isLoading && connectionStatus !== 'error'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:shadow-lg'
                      : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Generating Plan...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Generate AI Study Plan</span>
                    </>
                  )}
                </button>

                {connectionStatus === 'error' && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>Unable to connect to AI service.</span>
                    <button 
                      onClick={testWebhookConnection}
                      className="underline hover:no-underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Team Credits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-purple-900/40 rounded-2xl p-4 border border-purple-500/30"
            >
              <div className="flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-purple-400 mr-2" />
                <span className="text-sm font-semibold text-gray-300">Quantum Innovators Team</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                <div className="text-center">Aditya • Anubhab</div>
                <div className="text-center">Rohit • Kumaresh</div>
                <div className="text-center">Riya • Shreya</div>
              </div>
            </motion.div>
          </div>

          {/* Study Plan Display */}
          <div className="space-y-6">
            {/* Current Plan */}
            {(currentPlan || isLoading) && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <Brain className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-gray-200">AI Generated Study Plan</h3>
                </div>
                
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                  </div>
                ) : (
                  <div className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                    <pre className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
                      {currentPlan}
                    </pre>
                  </div>
                )}
              </motion.div>
            )}

            {/* Previous Plans */}
            {studyPlans.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold text-gray-200">Previous Study Plans</h3>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {studyPlans.map((plan) => (
                    <div key={plan.id} className="bg-gray-700/50 rounded-xl p-4 border border-gray-600/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-200">{plan.subject}</h4>
                        <span className="text-xs text-gray-400">
                          {plan.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-400 mb-2">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{plan.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span className="capitalize">{plan.difficulty}</span>
                        </span>
                      </div>
                      <div className="text-gray-300 text-sm bg-gray-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                        <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                          {plan.plan.substring(0, 200)}
                          {plan.plan.length > 200 && '...'}
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Tips */}
            {!currentPlan && !isLoading && studyPlans.length === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-emerald-400" />
                  <h3 className="text-xl font-semibold text-gray-200">Study Tips</h3>
                </div>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2"></div>
                    <p className="text-sm">Be specific about what you want to learn for better AI recommendations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-sm">Include your learning goals to get personalized study strategies</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                    <p className="text-sm">Choose realistic timeframes based on your availability</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                    <p className="text-sm">Save your study plans for future reference and tracking</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
