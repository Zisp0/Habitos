import { useLocalStorage } from "./hooks/useLocalStorage";
import { HabitBoard } from "./components/HabitBoard";
import { WeeklyTasks } from "./components/WeeklyTasks";
import { ThresholdSettings } from "./components/ThresholdSettings";
import { HabitStats } from "./components/HabitStats";
import { useState } from "react";
import { Settings, Sparkles } from "lucide-react";

function App() {
  const [habits, setHabits] = useLocalStorage("habits-list", []);
  const [checks, setChecks] = useLocalStorage("habits-checks", {});
  const [tasks, setTasks] = useLocalStorage("weekly-tasks", {});
  const [thresholds, setThresholds] = useLocalStorage("thresholds", {
    low: 30,
    high: 70,
  });
  const [showSettings, setShowSettings] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight">Hábitos</h1>
              <p className="text-xs text-slate-400 -mt-0.5">Tu progreso diario</p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors"
            title="Ajustes"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        {/* Settings Panel */}
        {showSettings && (
          <ThresholdSettings
            thresholds={thresholds}
            setThresholds={setThresholds}
          />
        )}

        {/* Habit Board */}
        <HabitBoard
          habits={habits}
          setHabits={setHabits}
          checks={checks}
          setChecks={setChecks}
          thresholds={thresholds}
        />

        {/* Weekly Tasks */}
        <WeeklyTasks tasks={tasks} setTasks={setTasks} />

        {/* Statistics */}
        <HabitStats
          habits={habits}
          checks={checks}
          thresholds={thresholds}
        />
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-xs text-slate-400">
        Construye mejores hábitos, un día a la vez 💪
      </footer>
    </div>
  );
}

export default App;
