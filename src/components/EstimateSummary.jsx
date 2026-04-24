import { fmt } from '../utils.js';

export default function EstimateSummary({
  lineItems,
  laborItems,
  partsCost,
  laborCost,
  total,
  notes,
  onNotesChange,
  onPrint,
}) {
  const isEmpty = lineItems.length === 0 && laborItems.length === 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 lg:sticky lg:top-4">
      <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          4
        </span>
        Estimate Summary
      </h2>

      {isEmpty ? (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm mb-4">
          Add equipment and labor to see the running total
        </div>
      ) : (
        <div className="mb-4 space-y-1">
          {/* Parts section */}
          {lineItems.length > 0 && (
            <>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-1 pb-0.5">
                Parts &amp; Equipment
              </div>
              {lineItems.map((item) => (
                <div key={item.id} className="flex justify-between items-baseline text-sm py-0.5">
                  <span className="text-gray-700 truncate flex-1 mr-3">
                    {item.qty > 1 ? `${item.qty}× ` : ''}
                    {item.name}
                  </span>
                  <span className="font-medium text-gray-800 shrink-0">
                    {fmt(item.qty * item.unitCost * (1 + item.markup / 100))}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-1.5 text-gray-700">
                <span>Parts Subtotal</span>
                <span>{fmt(partsCost)}</span>
              </div>
            </>
          )}

          {/* Labor section */}
          {laborItems.length > 0 && (
            <>
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide pt-3 pb-0.5">
                Labor
              </div>
              {laborItems.map((item) => (
                <div key={item.id} className="flex justify-between items-baseline text-sm py-0.5">
                  <span className="text-gray-700 flex-1 mr-3">
                    {item.description}
                    <span className="text-gray-400 text-xs"> ({item.hours}h)</span>
                  </span>
                  <span className="font-medium text-gray-800 shrink-0">
                    {fmt(item.hourlyRate * item.hours)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-1.5 text-gray-700">
                <span>Labor Subtotal</span>
                <span>{fmt(laborCost)}</span>
              </div>
            </>
          )}

          {/* Grand total */}
          <div className="flex justify-between items-baseline border-t-2 border-gray-800 pt-3 mt-2">
            <span className="text-base font-bold text-gray-900">TOTAL</span>
            <span className="text-2xl font-bold text-blue-700">{fmt(total)}</span>
          </div>
        </div>
      )}

      {/* Notes */}
      <div className="mb-4">
        <label className="text-xs text-gray-500 block mb-1.5 font-medium">
          Notes / Special Instructions
        </label>
        <textarea
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={3}
          placeholder="Add any notes for the customer..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
        />
      </div>

      <button
        onClick={onPrint}
        disabled={isEmpty}
        className={`w-full py-3 rounded-xl text-white font-bold text-sm transition-colors ${
          isEmpty
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
        }`}
      >
        Generate Estimate
      </button>

      {!isEmpty && (
        <p className="text-xs text-center text-gray-400 mt-2">
          Opens a print-ready view — save as PDF from your browser
        </p>
      )}
    </div>
  );
}
