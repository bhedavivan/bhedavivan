import { useState, useMemo } from 'react';
import { fmt } from '../utils.js';

export default function EquipmentPanel({
  equipment,
  lineItems,
  partsMarkup,
  onPartsMarkupChange,
  onAddEquipment,
  onRemoveItem,
  onUpdateItem,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = useMemo(
    () => ['All', ...new Set(equipment.map((e) => e.category))],
    [equipment]
  );

  const filtered = useMemo(
    () =>
      equipment.filter((e) => {
        const matchCat = category === 'All' || e.category === category;
        const q = search.toLowerCase();
        const matchSearch =
          !q ||
          e.name.toLowerCase().includes(q) ||
          e.brand.toLowerCase().includes(q) ||
          e.modelNumber.toLowerCase().includes(q);
        return matchCat && matchSearch;
      }),
    [equipment, search, category]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          2
        </span>
        Equipment &amp; Parts
      </h2>

      {/* Markup setting */}
      <div className="flex items-center gap-2 mb-4 bg-gray-50 rounded-lg px-3 py-2 text-sm">
        <span className="text-gray-600 whitespace-nowrap">Parts markup:</span>
        <input
          type="number"
          min="0"
          max="300"
          className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-center text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={partsMarkup}
          onChange={(e) => onPartsMarkupChange(Math.max(0, Number(e.target.value)))}
        />
        <span className="text-gray-600">%</span>
        <span className="text-gray-400 text-xs ml-auto">applied to all parts</span>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by name, brand, or model..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Category chips */}
      <div className="flex gap-1.5 flex-wrap mb-3">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
              category === cat
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Equipment list */}
      <div className="max-h-52 overflow-y-auto border border-gray-100 rounded-lg divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400 text-sm">No equipment found</div>
        ) : (
          filtered.map((e) => (
            <div
              key={e.id}
              className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 truncate">{e.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {e.brand} · {e.modelNumber} ·{' '}
                  <span className="font-medium text-gray-700">{fmt(e.baseCost)}</span>
                </div>
              </div>
              <button
                onClick={() => onAddEquipment(e, 1)}
                className="shrink-0 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                + Add
              </button>
            </div>
          ))
        )}
      </div>

      {/* Added line items */}
      {lineItems.length > 0 && (
        <div className="mt-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Added Items ({lineItems.length})
          </div>
          <div className="space-y-1.5">
            {lineItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-gray-800 truncate">{item.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {fmt(item.unitCost)} × {item.qty} + {item.markup}% ={' '}
                    <span className="font-semibold text-gray-700">
                      {fmt(item.qty * item.unitCost * (1 + item.markup / 100))}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <label className="text-xs text-gray-500 sr-only">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="w-12 border border-gray-300 rounded-lg px-1.5 py-1 text-xs text-center focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={item.qty}
                    onChange={(e) =>
                      onUpdateItem(item.id, 'qty', Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-400 hover:text-red-600 text-sm leading-none px-1"
                    aria-label="Remove item"
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
