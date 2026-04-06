import { useState } from "react";
import { cn } from "../lib/utils";
import {
  getMonthDays,
  getWeekDays,
  formatMonthYear,
  formatWeekRange,
  formatDayShort,
  formatDayNumber,
  dateKey,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "../lib/dateUtils";
import {
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  CalendarRange,
} from "lucide-react";

export function HabitBoard({ habits, setHabits, checks, setChecks, thresholds }) {
  const [view, setView] = useState("monthly"); // "monthly" | "weekly"
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newHabit, setNewHabit] = useState("");

  const days = view === "monthly" ? getMonthDays(currentDate) : getWeekDays(currentDate);

  const navigate = (dir) => {
    if (view === "monthly") {
      setCurrentDate(dir === "next" ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
    } else {
      setCurrentDate(dir === "next" ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1));
    }
  };

  const addHabit = () => {
    const name = newHabit.trim();
    if (!name) return;
    if (habits.includes(name)) return;
    setHabits([...habits, name]);
    setNewHabit("");
  };

  const removeHabit = (habit) => {
    setHabits(habits.filter((h) => h !== habit));
    const updated = { ...checks };
    Object.keys(updated).forEach((key) => {
      if (key.startsWith(habit + "::")) delete updated[key];
    });
    setChecks(updated);
  };

  const toggleCheck = (habit, day) => {
    const key = `${habit}::${dateKey(day)}`;
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getPercentage = (habit) => {
    const total = days.length;
    const checked = days.filter((d) => checks[`${habit}::${dateKey(d)}`]).length;
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  const getRowColor = (pct) => {
    if (pct <= thresholds.low) return "bg-red-50 border-red-200";
    if (pct >= thresholds.high) return "bg-emerald-50 border-emerald-200";
    return "bg-white border-slate-100";
  };

  const getPctBadgeColor = (pct) => {
    if (pct <= thresholds.low) return "bg-red-100 text-red-700";
    if (pct >= thresholds.high) return "bg-emerald-100 text-emerald-700";
    return "bg-slate-100 text-slate-600";
  };

  const title = view === "monthly" ? formatMonthYear(currentDate) : formatWeekRange(currentDate);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("prev")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-slate-700 capitalize min-w-[200px] text-center">
            {title}
          </h2>
          <button
            onClick={() => navigate("next")}
            className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("monthly")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
              view === "monthly"
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <CalendarDays className="w-4 h-4" />
            Mensual
          </button>
          <button
            onClick={() => setView("weekly")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all",
              view === "weekly"
                ? "bg-indigo-100 text-indigo-700"
                : "text-slate-500 hover:bg-slate-100"
            )}
          >
            <CalendarRange className="w-4 h-4" />
            Semanal
          </button>
        </div>
      </div>

      {/* Add habit */}
      <div className="p-4 border-b border-slate-100 flex gap-2">
        <input
          type="text"
          placeholder="Nuevo hábito..."
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addHabit()}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
        />
        <button
          onClick={addHabit}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left text-sm font-semibold text-slate-500 px-4 py-3 sticky left-0 bg-slate-50 z-10 min-w-[160px]">
                Hábito
              </th>
              {days.map((d) => (
                <th
                  key={dateKey(d)}
                  className={cn(
                    "text-center text-xs px-1 py-3 min-w-[38px]",
                    isToday(d)
                      ? "text-indigo-600 font-bold"
                      : "text-slate-400 font-medium"
                  )}
                >
                  <div>{formatDayShort(d)}</div>
                  <div className={cn(
                    "text-sm mt-0.5",
                    isToday(d)
                      ? "bg-indigo-500 text-white w-7 h-7 rounded-full flex items-center justify-center mx-auto font-bold"
                      : "text-slate-600"
                  )}>
                    {formatDayNumber(d)}
                  </div>
                </th>
              ))}
              <th className="text-center text-sm font-semibold text-slate-500 px-4 py-3 min-w-[70px]">
                %
              </th>
              <th className="px-3 py-3 min-w-[40px]"></th>
            </tr>
          </thead>
          <tbody>
            {habits.length === 0 && (
              <tr>
                <td
                  colSpan={days.length + 3}
                  className="text-center py-12 text-slate-400 text-sm"
                >
                  Aún no has agregado ningún hábito. ¡Empieza ahora! 🚀
                </td>
              </tr>
            )}
            {habits.map((habit) => {
              const pct = getPercentage(habit);
              return (
                <tr
                  key={habit}
                  className={cn(
                    "border-t transition-colors",
                    getRowColor(pct)
                  )}
                >
                  <td className={cn(
                    "px-4 py-3 text-sm font-medium text-slate-700 sticky left-0 z-10",
                    getRowColor(pct)
                  )}>
                    {habit}
                  </td>
                  {days.map((d) => {
                    const checked = !!checks[`${habit}::${dateKey(d)}`];
                    return (
                      <td key={dateKey(d)} className="text-center px-1 py-3">
                        <label className="inline-flex items-center justify-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCheck(habit, d)}
                            className="sr-only peer"
                          />
                          <div
                            className={cn(
                              "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200",
                              checked
                                ? "bg-indigo-500 border-indigo-500 shadow-sm"
                                : "border-slate-300 hover:border-indigo-400 bg-white"
                            )}
                          >
                            {checked && (
                              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                        </label>
                      </td>
                    );
                  })}
                  <td className="text-center px-3 py-3">
                    <span className={cn(
                      "inline-block text-xs font-bold px-2.5 py-1 rounded-full",
                      getPctBadgeColor(pct)
                    )}>
                      {pct}%
                    </span>
                  </td>
                  <td className="text-center px-3 py-3">
                    <button
                      onClick={() => removeHabit(habit)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
