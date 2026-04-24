import { fmt } from '../utils.js';

export default function PrintView({
  customer,
  lineItems,
  laborItems,
  partsCost,
  laborCost,
  total,
  notes,
  estimateNum,
  onBack,
}) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      {/* Screen-only controls */}
      <div className="print:hidden bg-blue-700 text-white px-4 py-3 flex items-center gap-3 shadow">
        <button
          onClick={onBack}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
        >
          ← Back to Editor
        </button>
        <button
          onClick={() => window.print()}
          className="px-4 py-1.5 bg-white text-blue-700 hover:bg-blue-50 rounded-lg text-sm font-bold transition-colors"
        >
          Print / Save as PDF
        </button>
        <span className="text-blue-200 text-sm hidden sm:block">
          Use your browser's print dialog → "Save as PDF"
        </span>
      </div>

      {/* Printable estimate */}
      <div className="max-w-2xl mx-auto bg-white my-6 p-8 shadow-md print:shadow-none print:my-0 print:p-6">
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-blue-700 pb-5 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-blue-700 tracking-tight">HVAC SERVICE ESTIMATE</h1>
            <p className="text-gray-500 text-sm mt-1">Valid for 30 days from date of issue</p>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div className="font-bold text-gray-900 text-base">{estimateNum}</div>
            <div className="mt-0.5">{dateStr}</div>
          </div>
        </div>

        {/* Customer info */}
        {customer && (customer.name || customer.address) && (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Prepared For
            </h2>
            <div className="text-base font-semibold text-gray-900">{customer.name}</div>
            {customer.address && (
              <div className="text-sm text-gray-600 mt-0.5">{customer.address}</div>
            )}
            {customer.phone && <div className="text-sm text-gray-600">{customer.phone}</div>}
            <div className="text-sm text-gray-600 mt-1 flex flex-wrap gap-x-4">
              {customer.propertyType && (
                <span className="capitalize">
                  <span className="text-gray-400">Property:</span> {customer.propertyType}
                  {customer.squareFootage
                    ? ` · ${Number(customer.squareFootage).toLocaleString()} sq ft`
                    : ''}
                </span>
              )}
              {customer.systemType && (
                <span>
                  <span className="text-gray-400">Current system:</span> {customer.systemType}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Line items table */}
        <table className="w-full text-sm mb-6 border-collapse">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2 font-semibold text-gray-700">Description</th>
              <th className="text-center py-2 font-semibold text-gray-700 w-14">Qty</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-24">Unit Price</th>
              <th className="text-right py-2 font-semibold text-gray-700 w-24">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lineItems.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={4}
                    className="pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-widest"
                  >
                    Parts &amp; Equipment
                  </td>
                </tr>
                {lineItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.name}</td>
                    <td className="py-2 text-center text-gray-600">{item.qty}</td>
                    <td className="py-2 text-right text-gray-600">
                      {fmt(item.unitCost * (1 + item.markup / 100))}
                    </td>
                    <td className="py-2 text-right font-medium text-gray-800">
                      {fmt(item.qty * item.unitCost * (1 + item.markup / 100))}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-gray-200">
                  <td colSpan={3} className="py-2 text-right text-xs font-semibold text-gray-500">
                    Parts Subtotal
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-800">{fmt(partsCost)}</td>
                </tr>
              </>
            )}

            {laborItems.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan={4}
                    className="pt-4 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-widest"
                  >
                    Labor
                  </td>
                </tr>
                {laborItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-2 text-gray-800">{item.description}</td>
                    <td className="py-2 text-center text-gray-600">{item.hours}h</td>
                    <td className="py-2 text-right text-gray-600">
                      {fmt(item.hourlyRate)}/hr
                    </td>
                    <td className="py-2 text-right font-medium text-gray-800">
                      {fmt(item.hourlyRate * item.hours)}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-gray-200">
                  <td colSpan={3} className="py-2 text-right text-xs font-semibold text-gray-500">
                    Labor Subtotal
                  </td>
                  <td className="py-2 text-right font-semibold text-gray-800">{fmt(laborCost)}</td>
                </tr>
              </>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="py-4 text-right text-base font-bold text-gray-900">
                TOTAL ESTIMATE
              </td>
              <td className="py-4 text-right text-2xl font-bold text-blue-700">{fmt(total)}</td>
            </tr>
          </tfoot>
        </table>

        {/* Notes */}
        {notes && (
          <div className="mb-6 border-t border-gray-100 pt-4">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Notes
            </h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{notes}</p>
          </div>
        )}

        {/* Footer: terms + signature */}
        <div className="border-t border-gray-200 pt-5 mt-4">
          <div className="grid grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Terms &amp; Conditions
              </p>
              <p className="text-xs leading-relaxed">
                Payment due upon completion. This estimate is valid for 30 days. Prices are subject
                to change if additional issues are discovered during service. All workmanship
                guaranteed for 90 days.
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
                Customer Approval
              </p>
              <div className="border-b border-gray-500 mb-1.5 h-10" />
              <p className="text-xs text-gray-400">Signature &amp; Date</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
