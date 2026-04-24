import { useState, useRef, useEffect } from 'react';
import { normalizeCustomer } from '../utils.js';

export default function CustomerPanel({
  customers,
  selectedCustomer,
  customCustomer,
  useCustomCustomer,
  onSelectCustomer,
  onCustomCustomerChange,
  onToggleCustom,
}) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (c) => {
    onSelectCustomer(normalizeCustomer(c));
    onToggleCustom(false);
    setSearch('');
    setShowDropdown(false);
  };

  const handleToggleCustom = () => {
    const next = !useCustomCustomer;
    onToggleCustom(next);
    if (next) onSelectCustomer(null);
  };

  const systemAgeColor = (age) => {
    if (!age) return '';
    if (age > 15) return 'text-red-600';
    if (age > 10) return 'text-amber-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <h2 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
          1
        </span>
        Customer
      </h2>

      {/* Search */}
      <div className="relative mb-3" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Search existing customers..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
        />
        {showDropdown && search && (
          <div className="absolute z-20 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-400">No customers found</div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect(c)}
                  className="w-full text-left px-4 py-2.5 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-0 transition-colors"
                >
                  <div className="font-medium text-gray-800">{c.name}</div>
                  <div className="text-gray-500 text-xs mt-0.5">{c.address}</div>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* New customer toggle */}
      <button
        onClick={handleToggleCustom}
        className={`text-xs mb-4 px-3 py-1.5 rounded-lg border font-medium transition-colors ${
          useCustomCustomer
            ? 'border-blue-500 text-blue-600 bg-blue-50'
            : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
        }`}
      >
        + New / Walk-in Customer
      </button>

      {/* Custom customer form */}
      {useCustomCustomer ? (
        <div className="space-y-2.5">
          <input
            type="text"
            placeholder="Customer Name *"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customCustomer.name}
            onChange={(e) => onCustomCustomerChange({ ...customCustomer, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customCustomer.address}
            onChange={(e) => onCustomCustomerChange({ ...customCustomer, address: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Phone"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customCustomer.phone}
            onChange={(e) => onCustomCustomerChange({ ...customCustomer, phone: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={customCustomer.propertyType}
              onChange={(e) =>
                onCustomCustomerChange({ ...customCustomer, propertyType: e.target.value })
              }
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </select>
            <input
              type="number"
              placeholder="Sq Ft"
              min="0"
              className="border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={customCustomer.squareFootage}
              onChange={(e) =>
                onCustomCustomerChange({ ...customCustomer, squareFootage: e.target.value })
              }
            />
          </div>
          <input
            type="text"
            placeholder="Current System (e.g. Central AC + Furnace)"
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={customCustomer.systemType || ''}
            onChange={(e) =>
              onCustomCustomerChange({ ...customCustomer, systemType: e.target.value })
            }
          />
        </div>
      ) : selectedCustomer ? (
        /* Selected customer card */
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 relative">
          <button
            onClick={() => onSelectCustomer(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-sm leading-none"
            aria-label="Clear customer"
          >
            ✕
          </button>
          <div className="font-semibold text-gray-900 text-base pr-5">{selectedCustomer.name}</div>
          <div className="text-sm text-gray-600 mt-0.5">{selectedCustomer.address}</div>
          {selectedCustomer.phone && (
            <div className="text-sm text-gray-600">{selectedCustomer.phone}</div>
          )}
          <div className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
            <div className="bg-white rounded-lg px-2.5 py-1.5 border border-blue-100">
              <span className="text-gray-500">Type: </span>
              <span className="font-medium capitalize">{selectedCustomer.propertyType}</span>
            </div>
            {selectedCustomer.squareFootage && (
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-blue-100">
                <span className="text-gray-500">Sq ft: </span>
                <span className="font-medium">
                  {Number(selectedCustomer.squareFootage).toLocaleString()}
                </span>
              </div>
            )}
            {selectedCustomer.systemType && (
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-blue-100 col-span-2">
                <span className="text-gray-500">System: </span>
                <span className="font-medium">{selectedCustomer.systemType}</span>
              </div>
            )}
            {selectedCustomer.systemAge != null && (
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-blue-100">
                <span className="text-gray-500">Age: </span>
                <span className={`font-medium ${systemAgeColor(selectedCustomer.systemAge)}`}>
                  {selectedCustomer.systemAge} yrs
                </span>
              </div>
            )}
            {selectedCustomer.lastServiceDate && (
              <div className="bg-white rounded-lg px-2.5 py-1.5 border border-blue-100">
                <span className="text-gray-500">Last svc: </span>
                <span className="font-medium">{selectedCustomer.lastServiceDate}</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
          Search above or add a new customer
        </div>
      )}
    </div>
  );
}
