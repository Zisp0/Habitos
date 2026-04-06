import { Settings } from "lucide-react";

export function ThresholdSettings({ thresholds, setThresholds }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-slate-400" />
        <h2 className="text-lg font-semibold text-slate-700">Ajustar Límites de Progreso</h2>
      </div>
      <div className="flex gap-6 items-center flex-wrap">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">Límite Bajo (Rojo) &lt;= %</span>
          <input
            type="number"
            className="border border-slate-200 rounded-lg px-3 py-2 w-24 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={thresholds.low}
            onChange={(e) => setThresholds({ ...thresholds, low: Number(e.target.value) })}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-slate-500">Límite Alto (Verde) &gt;= %</span>
          <input
            type="number"
            className="border border-slate-200 rounded-lg px-3 py-2 w-24 text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={thresholds.high}
            onChange={(e) => setThresholds({ ...thresholds, high: Number(e.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}
