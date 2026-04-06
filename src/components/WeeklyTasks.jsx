import { useState } from "react";
import { cn } from "../lib/utils";
import {
  getWeekDays,
  formatFullDate,
  formatDayShort,
  formatDayNumber,
  dateKey,
  isToday,
  addWeeks,
  subWeeks,
  formatWeekRange,
} from "../lib/dateUtils";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ListTodo,
} from "lucide-react";

export function WeeklyTasks({ tasks, setTasks }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTaskInputs, setNewTaskInputs] = useState({});

  const days = getWeekDays(currentDate);

  const navigate = (dir) => {
    setCurrentDate(dir === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
  };

  const addTask = (day) => {
    const dk = dateKey(day);
    const text = (newTaskInputs[dk] || "").trim();
    if (!text) return;

    const dayTasks = tasks[dk] || [];
    setTasks({
      ...tasks,
      [dk]: [...dayTasks, { id: Date.now().toString(), text, done: false }],
    });
    setNewTaskInputs({ ...newTaskInputs, [dk]: "" });
  };

  const toggleTask = (day, id) => {
    const dk = dateKey(day);
    const dayTasks = (tasks[dk] || []).map((t) =>
      t.id === id ? { ...t, done: !t.done } : t
    );
    setTasks({ ...tasks, [dk]: dayTasks });
  };

  const removeTask = (day, id) => {
    const dk = dateKey(day);
    const dayTasks = (tasks[dk] || []).filter((t) => t.id !== id);
    setTasks({ ...tasks, [dk]: dayTasks });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-700">Tareas Semanales</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("prev")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-slate-600 min-w-[180px] text-center capitalize">
            {formatWeekRange(currentDate)}
          </span>
          <button
            onClick={() => navigate("next")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Days grid */}
      <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {days.map((day) => {
          const dk = dateKey(day);
          const dayTasks = tasks[dk] || [];
          const today = isToday(day);

          return (
            <div
              key={dk}
              className={cn(
                "p-4 flex flex-col min-h-[200px] transition-colors rounded-xl border",
                today
                  ? "bg-indigo-50/60 border-indigo-200 shadow-sm"
                  : "bg-slate-50/50 border-slate-200"
              )}
            >
              {/* Day header */}
              <div className="flex items-center gap-2 mb-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    today
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 text-slate-600"
                  )}
                >
                  {formatDayNumber(day)}
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold capitalize",
                    today ? "text-indigo-600" : "text-slate-500"
                  )}
                >
                  {formatDayShort(day)}
                </span>
              </div>

              {/* Tasks list */}
              <div className="flex-1 space-y-2 mb-3">
                {dayTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-2 group"
                  >
                    <label className="flex items-center cursor-pointer mt-0.5">
                      <input
                        type="checkbox"
                        checked={task.done}
                        onChange={() => toggleTask(day, task.id)}
                        className="sr-only peer"
                      />
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0",
                          task.done
                            ? "bg-emerald-500 border-emerald-500"
                            : "border-slate-300 hover:border-indigo-400 bg-white"
                        )}
                      >
                        {task.done && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </label>
                    <span
                      className={cn(
                        "text-sm flex-1 leading-tight transition-all",
                        task.done
                          ? "line-through text-slate-400"
                          : "text-slate-700"
                      )}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => removeTask(day, task.id)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-slate-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {dayTasks.length === 0 && (
                  <p className="text-xs text-slate-300 italic">Sin tareas</p>
                )}
              </div>

              {/* Add task */}
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Agregar..."
                  value={newTaskInputs[dk] || ""}
                  onChange={(e) =>
                    setNewTaskInputs({ ...newTaskInputs, [dk]: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && addTask(day)}
                  className="flex-1 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => addTask(day)}
                  className="p-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
