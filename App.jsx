import React, { useState, useEffect } from 'react';
import { Check, Flame, Calendar, TrendingUp, Eye, EyeOff, RotateCcw, ChevronRight } from 'lucide-react';

const TaskInput = ({ value, onChange, completed, onToggle, placeholder, priority, rolloverCount = 0 }) => {
  const priorityStyles = {
    major: 'text-2xl font-bold border-4 border-orange-400 bg-orange-50 min-h-[80px]',
    medium: 'text-lg border-2 border-blue-400 bg-blue-50 min-h-[60px]',
    small: 'text-base border border-gray-300 bg-white min-h-[50px]'
  };

  const getRolloverBadge = () => {
    if (rolloverCount === 0) return null;
    
    const badges = {
      1: { text: '1 day', color: 'bg-yellow-100 text-yellow-700 border-yellow-300' },
      2: { text: '2 days', color: 'bg-orange-100 text-orange-700 border-orange-300' },
      3: { text: '3 days', color: 'bg-red-100 text-red-700 border-red-300' }
    };
    
    const badge = rolloverCount >= 3 
      ? { text: `${rolloverCount} days`, color: 'bg-red-200 text-red-800 border-red-400 font-bold' }
      : badges[rolloverCount];
    
    return (
      <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs border ${badge.color} shadow-sm z-10 flex items-center gap-1`}>
        <RotateCcw className="w-3 h-3" />
        {badge.text}
      </div>
    );
  };

  return (
    <div className="relative group">
      {getRolloverBadge()}
      <div className="flex items-start gap-3">
        <button
          onClick={onToggle}
          className={`mt-2 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            completed 
              ? 'bg-green-500 border-green-500 scale-110' 
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {completed && <Check className="w-4 h-4 text-white" />}
        </button>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 p-4 rounded-lg transition-all resize-none ${priorityStyles[priority]} ${
            completed ? 'line-through opacity-50' : ''
          } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            priority === 'major' ? 'focus:ring-orange-500' : 
            priority === 'medium' ? 'focus:ring-blue-500' : 
            'focus:ring-gray-400'
          }`}
          rows={priority === 'major' ? 2 : 1}
        />
      </div>
    </div>
  );
};

const FocusTodoApp = () => {
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [tasks, setTasks] = useState({ major: '', medium: ['', '', ''], small: ['', '', '', '', ''] });
  const [completed, setCompleted] = useState({ major: false, medium: [false, false, false], small: [false, false, false, false, false] });
  const [rolloverCounts, setRolloverCounts] = useState({ major: 0, medium: [0, 0, 0], small: [0, 0, 0, 0, 0] });
  const [overflowTasks, setOverflowTasks] = useState({ major: '', medium: ['', ''], small: ['', '', ''] });
  const [overflowCompleted, setOverflowCompleted] = useState({ major: false, medium: [false, false], small: [false, false, false] });
  const [overflowRolloverCounts, setOverflowRolloverCounts] = useState({ major: 0, medium: [0, 0], small: [0, 0, 0] });
  const [streak, setStreak] = useState(0);
  const [lastCompletionDate, setLastCompletionDate] = useState(null);
  const [history, setHistory] = useState([]);
  const [focusMode, setFocusMode] = useState(false);
  const [showArchive, setShowArchive] = useState(false);
  const [stats, setStats] = useState({ weekCompleted: 0, totalCompleted: 0 });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('focusTodoData');
    if (saved) {
      const data = JSON.parse(saved);
      setTasks(data.tasks || tasks);
      setCompleted(data.completed || completed);
      setRolloverCounts(data.rolloverCounts || { major: 0, medium: [0, 0, 0], small: [0, 0, 0, 0, 0] });
      setOverflowTasks(data.overflowTasks || { major: '', medium: ['', ''], small: ['', '', ''] });
      setOverflowCompleted(data.overflowCompleted || { major: false, medium: [false, false], small: [false, false, false] });
      setOverflowRolloverCounts(data.overflowRolloverCounts || { major: 0, medium: [0, 0], small: [0, 0, 0] });
      setStreak(data.streak || 0);
      setLastCompletionDate(data.lastCompletionDate);
      setHistory(data.history || []);
      setStats(data.stats || stats);
      setCurrentDate(data.currentDate || new Date().toDateString());
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    const data = {
      tasks,
      completed,
      rolloverCounts,
      overflowTasks,
      overflowCompleted,
      overflowRolloverCounts,
      streak,
      lastCompletionDate,
      history,
      stats,
      currentDate
    };
    localStorage.setItem('focusTodoData', JSON.stringify(data));
  }, [tasks, completed, rolloverCounts, overflowTasks, overflowCompleted, overflowRolloverCounts, streak, lastCompletionDate, history, stats, currentDate]);

  // Check if day has changed and handle rollover
  useEffect(() => {
    const checkDayChange = () => {
      const today = new Date().toDateString();
      if (today !== currentDate) {
        handleDayRollover(today);
      }
    };

    const interval = setInterval(checkDayChange, 60000); // Check every minute
    checkDayChange(); // Check immediately

    return () => clearInterval(interval);
  }, [currentDate, tasks, completed]);

  const handleDayRollover = (newDate) => {
    // Save yesterday's tasks to history
    const yesterday = {
      date: currentDate,
      tasks: { ...tasks },
      completed: { ...completed },
      overflowTasks: { ...overflowTasks },
      overflowCompleted: { ...overflowCompleted },
      completionRate: calculateCompletionRate()
    };
    
    const newHistory = [yesterday, ...history].slice(0, 30); // Keep last 30 days

    // Update streak
    const hasCompletions = completed.major || completed.medium.some(c => c) || completed.small.some(c => c);
    let newStreak = streak;
    
    if (hasCompletions) {
      const lastDate = lastCompletionDate ? new Date(lastCompletionDate) : null;
      const yesterdayDate = new Date(currentDate);
      
      if (lastDate && Math.abs(yesterdayDate - lastDate) <= 86400000) {
        newStreak = streak + 1;
      } else {
        newStreak = 1;
      }
      setLastCompletionDate(currentDate);
    } else {
      newStreak = 0;
    }

    // Calculate stats including overflow
    const completedCount = (completed.major ? 1 : 0) + 
                          completed.medium.filter(c => c).length + 
                          completed.small.filter(c => c).length +
                          (overflowCompleted.major ? 1 : 0) +
                          overflowCompleted.medium.filter(c => c).length +
                          overflowCompleted.small.filter(c => c).length;
    
    const newStats = {
      weekCompleted: stats.weekCompleted + completedCount,
      totalCompleted: stats.totalCompleted + completedCount
    };

    // Collect all incomplete tasks (main + overflow) with their rollover counts
    const incompleteTasks = [];
    
    // Add incomplete main tasks
    if (!completed.major && tasks.major) {
      incompleteTasks.push({ text: tasks.major, priority: 'major', rolloverCount: rolloverCounts.major + 1 });
    }
    tasks.medium.forEach((task, i) => {
      if (!completed.medium[i] && task) {
        incompleteTasks.push({ text: task, priority: 'medium', rolloverCount: rolloverCounts.medium[i] + 1 });
      }
    });
    tasks.small.forEach((task, i) => {
      if (!completed.small[i] && task) {
        incompleteTasks.push({ text: task, priority: 'small', rolloverCount: rolloverCounts.small[i] + 1 });
      }
    });
    
    // Add incomplete overflow tasks
    if (!overflowCompleted.major && overflowTasks.major) {
      incompleteTasks.push({ text: overflowTasks.major, priority: 'major', rolloverCount: overflowRolloverCounts.major + 1 });
    }
    overflowTasks.medium.forEach((task, i) => {
      if (!overflowCompleted.medium[i] && task) {
        incompleteTasks.push({ text: task, priority: 'medium', rolloverCount: overflowRolloverCounts.medium[i] + 1 });
      }
    });
    overflowTasks.small.forEach((task, i) => {
      if (!overflowCompleted.small[i] && task) {
        incompleteTasks.push({ text: task, priority: 'small', rolloverCount: overflowRolloverCounts.small[i] + 1 });
      }
    });

    // Fill tomorrow's slots with incomplete tasks
    // Priority order: major tasks first, then medium, then small
    const majorTasks = incompleteTasks.filter(t => t.priority === 'major');
    const mediumTasks = incompleteTasks.filter(t => t.priority === 'medium');
    const smallTasks = incompleteTasks.filter(t => t.priority === 'small');

    const rolledOverTasks = {
      major: majorTasks[0]?.text || '',
      medium: [
        majorTasks[1]?.text || mediumTasks[0]?.text || '',
        mediumTasks[1]?.text || '',
        mediumTasks[2]?.text || ''
      ],
      small: [
        smallTasks[0]?.text || '',
        smallTasks[1]?.text || '',
        smallTasks[2]?.text || '',
        smallTasks[3]?.text || '',
        smallTasks[4]?.text || ''
      ]
    };

    const rolledOverCounts = {
      major: majorTasks[0]?.rolloverCount || 0,
      medium: [
        majorTasks[1]?.rolloverCount || mediumTasks[0]?.rolloverCount || 0,
        mediumTasks[1]?.rolloverCount || 0,
        mediumTasks[2]?.rolloverCount || 0
      ],
      small: [
        smallTasks[0]?.rolloverCount || 0,
        smallTasks[1]?.rolloverCount || 0,
        smallTasks[2]?.rolloverCount || 0,
        smallTasks[3]?.rolloverCount || 0,
        smallTasks[4]?.rolloverCount || 0
      ]
    };

    setHistory(newHistory);
    setStreak(newStreak);
    setStats(newStats);
    setTasks(rolledOverTasks);
    setRolloverCounts(rolledOverCounts);
    setCompleted({ major: false, medium: [false, false, false], small: [false, false, false, false, false] });
    setOverflowTasks({ major: '', medium: ['', ''], small: ['', '', ''] });
    setOverflowCompleted({ major: false, medium: [false, false], small: [false, false, false] });
    setOverflowRolloverCounts({ major: 0, medium: [0, 0], small: [0, 0, 0] });
    setCurrentDate(newDate);
  };

  const allMainTasksComplete = () => {
    const allDone = completed.major && 
                    completed.medium.every(c => c) && 
                    completed.small.every(c => c) &&
                    tasks.major.trim() !== '' &&
                    tasks.medium.every(t => t.trim() !== '') &&
                    tasks.small.every(t => t.trim() !== '');
    return allDone;
  };

  const calculateCompletionRate = () => {
    const total = 1 + 3 + 5;
    const done = (completed.major ? 1 : 0) + 
                 completed.medium.filter(c => c).length + 
                 completed.small.filter(c => c).length;
    return Math.round((done / total) * 100);
  };

  const handleTaskChange = (type, index, value) => {
    const newTasks = { ...tasks };
    const newCounts = { ...rolloverCounts };
    
    if (type === 'major') {
      newTasks.major = value;
      // Reset count if task text changed
      if (value !== tasks.major) {
        newCounts.major = 0;
      }
    } else {
      newTasks[type][index] = value;
      // Reset count if task text changed
      if (value !== tasks[type][index]) {
        newCounts[type][index] = 0;
      }
    }
    
    setTasks(newTasks);
    setRolloverCounts(newCounts);
  };

  const handleOverflowTaskChange = (type, index, value) => {
    const newTasks = { ...overflowTasks };
    const newCounts = { ...overflowRolloverCounts };
    
    if (type === 'major') {
      newTasks.major = value;
      if (value !== overflowTasks.major) {
        newCounts.major = 0;
      }
    } else {
      newTasks[type][index] = value;
      if (value !== overflowTasks[type][index]) {
        newCounts[type][index] = 0;
      }
    }
    
    setOverflowTasks(newTasks);
    setOverflowRolloverCounts(newCounts);
  };

  const toggleComplete = (type, index) => {
    const newCompleted = { ...completed };
    if (type === 'major') {
      newCompleted.major = !newCompleted.major;
    } else {
      newCompleted[type][index] = !newCompleted[type][index];
    }
    setCompleted(newCompleted);
  };

  const toggleOverflowComplete = (type, index) => {
    const newCompleted = { ...overflowCompleted };
    if (type === 'major') {
      newCompleted.major = !newCompleted.major;
    } else {
      newCompleted[type][index] = !newCompleted[type][index];
    }
    setOverflowCompleted(newCompleted);
  };

  const resetDay = () => {
    if (window.confirm('Reset all tasks for today?')) {
      setTasks({ major: '', medium: ['', '', ''], small: ['', '', '', '', ''] });
      setCompleted({ major: false, medium: [false, false, false], small: [false, false, false, false, false] });
      setRolloverCounts({ major: 0, medium: [0, 0, 0], small: [0, 0, 0, 0, 0] });
      setOverflowTasks({ major: '', medium: ['', ''], small: ['', '', ''] });
      setOverflowCompleted({ major: false, medium: [false, false], small: [false, false, false] });
      setOverflowRolloverCounts({ major: 0, medium: [0, 0], small: [0, 0, 0] });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Focus<span className="text-orange-500">135</span></h1>
              <p className="text-gray-600">1 Major · 3 Medium · 5 Small</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end mb-2">
                <Flame className={`w-6 h-6 ${streak > 0 ? 'text-orange-500' : 'text-gray-300'}`} />
                <span className="text-3xl font-bold text-gray-800">{streak}</span>
              </div>
              <p className="text-sm text-gray-500">day streak</p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{calculateCompletionRate()}%</div>
              <div className="text-xs text-gray-500">Today</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.weekCompleted}</div>
              <div className="text-xs text-gray-500">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalCompleted}</div>
              <div className="text-xs text-gray-500">All Time</div>
            </div>
          </div>
          
          {/* Overflow indicator */}
          {allMainTasksComplete() && (
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                <span className="text-green-700 font-medium text-sm">✨ Overflow Mode Unlocked</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setFocusMode(!focusMode)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 rounded-lg transition-colors"
            >
              {focusMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="text-sm">{focusMode ? 'Show All' : 'Focus Mode'}</span>
            </button>
            <button
              onClick={() => setShowArchive(!showArchive)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Archive</span>
            </button>
            <button
              onClick={resetDay}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-lg transition-colors ml-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-sm">Reset</span>
            </button>
          </div>
        </div>

        {/* Archive View */}
        {showArchive && history.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Past Days
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {history.slice(0, 10).map((day, idx) => {
                const hasOverflow = day.overflowCompleted && (
                  day.overflowCompleted.major || 
                  day.overflowCompleted.medium?.some(c => c) || 
                  day.overflowCompleted.small?.some(c => c)
                );
                return (
                  <div key={idx} className="border-l-4 border-gray-300 pl-4 py-2 hover:bg-gray-50 rounded">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-700">{day.date}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm font-bold text-gray-800">{day.completionRate}%</div>
                        {hasOverflow && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">+Overflow</span>}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {day.completed.major && '✓ Major'} 
                      {day.completed.medium.filter(c => c).length > 0 && ` · ${day.completed.medium.filter(c => c).length} Medium`}
                      {day.completed.small.filter(c => c).length > 0 && ` · ${day.completed.small.filter(c => c).length} Small`}
                      {hasOverflow && (
                        <span className="text-purple-600 ml-1">
                          {day.overflowCompleted.major && ' +1 Major'}
                          {day.overflowCompleted.medium?.filter(c => c).length > 0 && ` +${day.overflowCompleted.medium.filter(c => c).length} Med`}
                          {day.overflowCompleted.small?.filter(c => c).length > 0 && ` +${day.overflowCompleted.small.filter(c => c).length} Small`}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-6">
          {/* Major Task */}
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-orange-900">Major Priority</h2>
            </div>
            <TaskInput
              value={tasks.major}
              onChange={(value) => handleTaskChange('major', null, value)}
              completed={completed.major}
              onToggle={() => toggleComplete('major')}
              placeholder="What's the ONE thing that matters most today?"
              priority="major"
              rolloverCount={rolloverCounts.major}
            />
          </div>

          {/* Medium Tasks */}
          {!focusMode && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Medium Tasks (3)</h2>
              <div className="space-y-3">
                {tasks.medium.map((task, idx) => (
                  <TaskInput
                    key={idx}
                    value={task}
                    onChange={(value) => handleTaskChange('medium', idx, value)}
                    completed={completed.medium[idx]}
                    onToggle={() => toggleComplete('medium', idx)}
                    placeholder={`Medium task ${idx + 1}`}
                    priority="medium"
                    rolloverCount={rolloverCounts.medium[idx]}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Small Tasks */}
          {!focusMode && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-700 mb-4">Small Tasks (5)</h2>
              <div className="space-y-2">
                {tasks.small.map((task, idx) => (
                  <TaskInput
                    key={idx}
                    value={task}
                    onChange={(value) => handleTaskChange('small', idx, value)}
                    completed={completed.small[idx]}
                    onToggle={() => toggleComplete('small', idx)}
                    placeholder={`Small task ${idx + 1}`}
                    priority="small"
                    rolloverCount={rolloverCounts.small[idx]}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Overflow/Bonus Tasks - Only shown when all main tasks are complete */}
        {allMainTasksComplete() && (
          <div className="mt-8 space-y-6">
            {/* Celebration Banner */}
            <div className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl shadow-lg p-6 text-white">
              <div className="text-center">
                <div className="text-4xl mb-2">🎉</div>
                <h2 className="text-3xl font-bold mb-2">All Tasks Complete!</h2>
                <p className="text-lg opacity-90">Feeling productive? Add overflow tasks below!</p>
              </div>
            </div>

            {/* Overflow Major Task */}
            <div className="bg-gradient-to-r from-purple-100 to-purple-50 rounded-2xl shadow-lg p-6 border-2 border-purple-300">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-purple-900">Bonus Major Task</h2>
                <span className="ml-auto text-sm bg-purple-200 px-3 py-1 rounded-full text-purple-800 font-medium">Overflow</span>
              </div>
              <TaskInput
                value={overflowTasks.major}
                onChange={(value) => handleOverflowTaskChange('major', null, value)}
                completed={overflowCompleted.major}
                onToggle={() => toggleOverflowComplete('major')}
                placeholder="Another big win for today?"
                priority="major"
                rolloverCount={overflowRolloverCounts.major}
              />
            </div>

            {/* Overflow Medium Tasks */}
            {!focusMode && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
                <h2 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                  Bonus Medium Tasks (2)
                  <span className="ml-auto text-sm bg-indigo-200 px-3 py-1 rounded-full text-indigo-800 font-medium">Overflow</span>
                </h2>
                <div className="space-y-3">
                  {overflowTasks.medium.map((task, idx) => (
                    <TaskInput
                      key={idx}
                      value={task}
                      onChange={(value) => handleOverflowTaskChange('medium', idx, value)}
                      completed={overflowCompleted.medium[idx]}
                      onToggle={() => toggleOverflowComplete('medium', idx)}
                      placeholder={`Bonus medium task ${idx + 1}`}
                      priority="medium"
                      rolloverCount={overflowRolloverCounts.medium[idx]}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Overflow Small Tasks */}
            {!focusMode && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-gray-200">
                <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                  Bonus Small Tasks (3)
                  <span className="ml-auto text-sm bg-gray-200 px-3 py-1 rounded-full text-gray-800 font-medium">Overflow</span>
                </h2>
                <div className="space-y-2">
                  {overflowTasks.small.map((task, idx) => (
                    <TaskInput
                      key={idx}
                      value={task}
                      onChange={(value) => handleOverflowTaskChange('small', idx, value)}
                      completed={overflowCompleted.small[idx]}
                      onToggle={() => toggleOverflowComplete('small', idx)}
                      placeholder={`Bonus small task ${idx + 1}`}
                      priority="small"
                      rolloverCount={overflowRolloverCounts.small[idx]}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500 pb-4">
          Today: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>
    </div>
  );
};

export default FocusTodoApp;
