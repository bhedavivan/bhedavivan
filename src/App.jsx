import { useState, useMemo } from 'react';
import equipmentData from '../data/equipment.json';
import laborRatesData from '../data/labor_rates.json';
import customersData from '../data/customers.json';

import CustomerPanel from './components/CustomerPanel.jsx';
import EquipmentPanel from './components/EquipmentPanel.jsx';
import LaborPanel from './components/LaborPanel.jsx';
import EstimateSummary from './components/EstimateSummary.jsx';
import PrintView from './components/PrintView.jsx';
import { uid } from './utils.js';

const BLANK_CUSTOM_CUSTOMER = {
  name: '',
  address: '',
  phone: '',
  propertyType: 'residential',
  squareFootage: '',
  systemType: '',
};

function makeEstimateNum() {
  return `EST-${Date.now().toString().slice(-6)}`;
}

export default function App() {
  const [estimateNum] = useState(makeEstimateNum);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customCustomer, setCustomCustomer] = useState(BLANK_CUSTOM_CUSTOMER);
  const [useCustomCustomer, setUseCustomCustomer] = useState(false);

  const [lineItems, setLineItems] = useState([]);
  const [laborItems, setLaborItems] = useState([]);
  const [partsMarkup, setPartsMarkup] = useState(30);
  const [notes, setNotes] = useState('');
  const [showPrint, setShowPrint] = useState(false);

  // Derived customer object
  const customer = useCustomCustomer ? customCustomer : selectedCustomer;

  // Equipment actions
  const addEquipment = (equip, qty) => {
    setLineItems((prev) => {
      const existing = prev.find((i) => i.equipId === equip.id);
      if (existing) {
        return prev.map((i) =>
          i.equipId === equip.id ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [
        ...prev,
        {
          id: uid(),
          equipId: equip.id,
          name: equip.name,
          unitCost: equip.baseCost,
          qty,
          markup: partsMarkup,
        },
      ];
    });
  };

  const removeLineItem = (id) => setLineItems((prev) => prev.filter((i) => i.id !== id));

  const updateLineItem = (id, field, value) =>
    setLineItems((prev) => prev.map((i) => (i.id === id ? { ...i, [field]: value } : i)));

  // Labor actions
  const addLabor = (laborRate, hours) => {
    setLaborItems((prev) => [
      ...prev,
      {
        id: uid(),
        jobType: laborRate.jobType,
        level: laborRate.level,
        hourlyRate: laborRate.hourlyRate,
        hours,
        description: `${laborRate.jobType.charAt(0).toUpperCase() + laborRate.jobType.slice(1)} — ${laborRate.level.charAt(0).toUpperCase() + laborRate.level.slice(1)}`,
      },
    ]);
  };

  const removeLabor = (id) => setLaborItems((prev) => prev.filter((i) => i.id !== id));

  const updateLaborHours = (id, hours) =>
    setLaborItems((prev) => prev.map((i) => (i.id === id ? { ...i, hours } : i)));

  // Totals
  const partsCost = useMemo(
    () => lineItems.reduce((sum, i) => sum + i.qty * i.unitCost * (1 + i.markup / 100), 0),
    [lineItems]
  );

  const laborCost = useMemo(
    () => laborItems.reduce((sum, i) => sum + i.hours * i.hourlyRate, 0),
    [laborItems]
  );

  const total = partsCost + laborCost;

  const resetEstimate = () => {
    setSelectedCustomer(null);
    setCustomCustomer(BLANK_CUSTOM_CUSTOMER);
    setUseCustomCustomer(false);
    setLineItems([]);
    setLaborItems([]);
    setNotes('');
    setShowPrint(false);
  };

  if (showPrint) {
    return (
      <PrintView
        customer={customer}
        lineItems={lineItems}
        laborItems={laborItems}
        partsCost={partsCost}
        laborCost={laborCost}
        total={total}
        notes={notes}
        estimateNum={estimateNum}
        onBack={() => setShowPrint(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-lg font-bold leading-tight">HVAC Field Estimator</h1>
            <p className="text-blue-300 text-xs">
              {estimateNum} &middot; {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={resetEstimate}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium transition-colors"
            >
              New
            </button>
            <button
              onClick={() => setShowPrint(true)}
              disabled={lineItems.length === 0 && laborItems.length === 0}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                lineItems.length === 0 && laborItems.length === 0
                  ? 'bg-blue-500 text-blue-300 cursor-not-allowed'
                  : 'bg-white text-blue-700 hover:bg-blue-50'
              }`}
            >
              Generate Estimate
            </button>
          </div>
        </div>
      </header>

      {/* Main 3-column grid */}
      <main className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Column 1: Customer */}
        <CustomerPanel
          customers={customersData}
          selectedCustomer={selectedCustomer}
          customCustomer={customCustomer}
          useCustomCustomer={useCustomCustomer}
          onSelectCustomer={setSelectedCustomer}
          onCustomCustomerChange={setCustomCustomer}
          onToggleCustom={setUseCustomCustomer}
        />

        {/* Column 2: Equipment + Labor */}
        <div className="space-y-5">
          <EquipmentPanel
            equipment={equipmentData}
            lineItems={lineItems}
            partsMarkup={partsMarkup}
            onPartsMarkupChange={setPartsMarkup}
            onAddEquipment={addEquipment}
            onRemoveItem={removeLineItem}
            onUpdateItem={updateLineItem}
          />
          <LaborPanel
            laborRates={laborRatesData}
            laborItems={laborItems}
            onAddLabor={addLabor}
            onRemoveLabor={removeLabor}
            onUpdateHours={updateLaborHours}
          />
        </div>

        {/* Column 3: Estimate Summary */}
        <EstimateSummary
          lineItems={lineItems}
          laborItems={laborItems}
          partsCost={partsCost}
          laborCost={laborCost}
          total={total}
          notes={notes}
          onNotesChange={setNotes}
          onPrint={() => setShowPrint(true)}
        />
      </main>
    </div>
  );
}
