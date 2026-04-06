import { useState, useMemo } from "react";
import { cn } from "../lib/utils";
import {
  getMonthDays,
  getWeekDays,
  formatMonthYear,
  formatWeekRange,
  dateKey,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
} from "../lib/dateUtils";
import {
  BarChart3,
  CalendarDays,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const LINE_COLORS = [
  "#6366f1", "#f43f5e", "#10b981", "#f59e0b", "#8b5cf6",
  "#06b6d4", "#ec4899", "#14b8a6", "#f97316", "#3b82f6",
];

const PERIODS_TO_SHOW = 6;

export function HabitStats({ habits, checks, thresholds }) {
  const [view, setView] = useState("monthly");
  const [baseDate, setBaseDate] = useState(new Date());

  // Build an array of N periods ending at baseDate
  const periods = useMemo(() => {
    const result = [];

    for (let i = PERIODS_TO_SHOW - 1; i >= 0; i--) {
      const ref = view === "monthly" ? subMonths(baseDate, i) : subWeeks(baseDate, i);
      const days = view === "monthly" ? getMonthDays(ref) : getWeekDays(ref);
      const label = view === "monthly" ? formatMonthYear(ref) : formatWeekRange(ref);
      result.push({ ref, days, label });
    }
    return result;
  }, [view, baseDate]);

  const navigateChart = (dir) => {
    if (view === "monthly") {
      setBaseDate(dir === "next" ? addMonths(baseDate, 1) : subMonths(baseDate, 1));
    } else {
      setBaseDate(dir === "next" ? addWeeks(baseDate, 1) : subWeeks(baseDate, 1));
    }
  };

  // Build chart data: one point per period, with each habit's % for that period
  const chartData = useMemo(() => {
    return periods.map(({ days, label }) => {
      const point = { name: label };
      habits.forEach((habit) => {
        const total = days.length;
        const checked = days.filter((d) => checks[`${habit}::${dateKey(d)}`]).length;
        point[habit] = total === 0 ? 0 : Math.round((checked / total) * 100);
      });
      return point;
    });
  }, [periods, habits, checks]);

  // Current period summary (last item)
  const currentPeriod = periods[periods.length - 1];
  const summaries = useMemo(() => {
    return habits.map((habit) => {
      const total = currentPeriod.days.length;
      const checked = currentPeriod.days.filter(
        (d) => checks[`${habit}::${dateKey(d)}`]
      ).length;
      const pct = total === 0 ? 0 : Math.round((checked / total) * 100);
      return { habit, checked, total, pct };
    });
  }, [currentPeriod, habits, checks]);

  const overall =
    summaries.length === 0
      ? 0
      : Math.round(summaries.reduce((sum, s) => sum + s.pct, 0) / summaries.length);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload) return null;
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-xs font-semibold text-slate-500 mb-2 capitalize">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-sm">
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600">{entry.name}:</span>
            <span className="font-bold text-slate-800">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-8">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-700">Estadísticas</h2>
          <div className="flex items-center gap-1 ml-4 border border-slate-200 rounded-lg p-0.5">
            <button
              onClick={() => navigateChart("prev")}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter px-1 min-w-[70px] text-center">
              {PERIODS_TO_SHOW} {view === "monthly" ? "MESES" : "SEMANAS"}
            </span>
            <button
              onClick={() => navigateChart("next")}
              className="p-1 rounded-md hover:bg-slate-100 text-slate-500"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
          <button
            onClick={() => setView("monthly")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              view === "monthly"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Mensual
          </button>
          <button
            onClick={() => setView("weekly")}
            className={cn(
              "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
              view === "weekly"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            Semanal
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {habits.length === 0 ? (
          <p className="text-center text-slate-400 text-sm py-8">
            Agrega hábitos para ver tus estadísticas 📊
          </p>
        ) : (
          <>
            {/* Summary card */}
            <div className="flex justify-center mb-6">
              <div className="px-8 py-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 text-center shadow-sm">
                <p className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest">
                  Promedio de este Período
                </p>
                <p className="text-4xl font-black text-indigo-700 mt-1">{overall}%</p>
                <p className="text-xs text-indigo-400 font-medium mt-1 capitalize">{currentPeriod.label}</p>
              </div>
            </div>

            {/* Line chart */}
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={{ stroke: "#e2e8f0" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
                    iconType="circle"
                    iconSize={8}
                  />
                  {habits.map((habit, i) => (
                    <Line
                      key={habit}
                      type="monotone"
                      dataKey={habit}
                      stroke={LINE_COLORS[i % LINE_COLORS.length]}
                      strokeWidth={2.5}
                      dot={{
                        r: 4,
                        fill: LINE_COLORS[i % LINE_COLORS.length],
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                      activeDot={{
                        r: 6,
                        fill: LINE_COLORS[i % LINE_COLORS.length],
                        strokeWidth: 2,
                        stroke: "#fff",
                      }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
