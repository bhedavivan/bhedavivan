import { useState } from 'react';
import { fmt, capitalize, uid } from '../utils.js';

export default function LaborPanel({ laborRates, laborItems, onAddLabor, onRemoveLabor, onUpdateHours }) {
  const jobTypes = [...new Set(laborRates.map((r) => r.jobType))];

  const [jobType, setJobType] = useState(jobTypes[0]);
  const [level, setLevel] = useState(() => laborRates.find((r) => r.jobType === jobTypes[0])?.level ?? '');
  const [hours, setHours] = useState(() => {
    const r = laborRates.find((r) => r.jobType === jobTypes[0]);
    return r ? (r.estimatedHours.min + r.estimatedHours.max) / 2 : 1;
  });

  const levelsForType = laborRates.filter((r) => r.jobType === jobType);
  const selectedRate = laborRates.find((r) => r.jobType === jobType && r.level === level);

  const handleJobTypeChange = (jt) => {
    setJobType(jt);
    const levels = laborRates.filter((r) => r.jobType === jt);
    const firstLevel = levels[0]?.level ?? '';
    setLevel(firstLevel);
    const rate = laborRates.find((r) => r.jobType === jt && r.level === firstLevel);
    if (rate) setHours((rate.estimatedHours.min + rate.estimatedHours.max) / 2);
  };

  const handleLevelChange = (lv) => {
    setLevel(lv);
    const rate = laborRates.find((r) => r.jobType === jobType && r.level === lv);
    if (rate) setHours((rate.estimatedHours.min + rate.estimatedHours.max) / 2);
  };

  const handleAdd = () => {
    if (selectedRate && hours > 0) {
      onAddLabor(selectedRate, hours);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          3
        </span>
        Labor
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5 font-medium">Job Type</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={jobType}
            onChange={(e) => handleJobTypeChange(e.target.value)}
          >
            {jobTypes.map((jt) => (
              <option key={jt} value={jt}>
                {capitalize(jt)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5 font-medium">Level</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={level}
            onChange={(e) => handleLevelChange(e.target.value)}
          >
            {levelsForType.map((r) => (
              <option key={r.level} value={r.level}>
                {capitalize(r.level)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedRate && (
        <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 mb-3 border border-gray-100">
          <span className="font-semibold text-gray-700">{fmt(selectedRate.hourlyRate)}/hr</span>
          <span className="text-gray-400 mx-1">·</span>
          Typical range:{' '}
          <span className="font-medium">
            {selectedRate.estimatedHours.min}–{selectedRate.estimatedHours.max} hrs
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs text-gray-500 block mb-1.5 font-medium">Hours</label>
          <input
            type="number"
            min="0.5"
            step="0.5"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={hours}
            onChange={(e) => setHours(Math.max(0.5, Number(e.target.value)))}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1.5 font-medium">Subtotal</label>
          <div className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 font-semibold text-gray-700">
            {selectedRate ? fmt(selectedRate.hourlyRate * hours) : '$0.00'}
          </div>
        </div>
      </div>

      <button
        onClick={handleAdd}
        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
      >
        Add Labor
      </button>

      {/* Added labor items */}
      {laborItems.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Added Labor ({laborItems.length})
          </div>
          <div className="space-y-1.5">
            {laborItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800">{item.description}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {fmt(item.hourlyRate)}/hr × {item.hours}h ={' '}
                    <span className="font-semibold text-gray-700">
                      {fmt(item.hourlyRate * item.hours)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    className="w-14 border border-gray-300 rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={item.hours}
                    onChange={(e) =>
                      onUpdateHours(item.id, Math.max(0.5, Number(e.target.value)))
                    }
                  />
                  <button
                    onClick={() => onRemoveLabor(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm leading-none px-1"
                    aria-label="Remove labor"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
