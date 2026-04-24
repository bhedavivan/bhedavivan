# HVAC Field Estimate Tool — Write-Up

## What I Built

A React single-page application that lets HVAC technicians build a complete, itemized estimate in under 2 minutes, right on their phone or tablet, while standing in front of the customer.

**Live workflow:**
1. **Customer** — search existing customer records or enter a walk-in. Relevant context (property type, system age, last service date) surfaces automatically so the tech can spot an aging system at a glance.
2. **Equipment & Parts** — filterable catalog of all 30 items. Category filter chips narrow the list fast; search works by name, brand, or model number. Hitting "Add" immediately increments quantity if the item is already on the estimate. Parts markup is a single global field (default 30%) that applies to all parts.
3. **Labor** — job type + level dropdowns auto-select a rate and pre-fill hours from the typical range (average of min/max). The tech can adjust hours before adding. Multiple labor lines are supported.
4. **Summary** — running total updates in real time as items are added. An optional notes field feeds directly into the printed estimate.
5. **Generate** — one tap opens a print-ready view formatted for letter-size paper or PDF export via the browser's native print dialog. Includes customer info, itemized table with unit prices, subtotals, grand total, terms, and a signature line.

## Technology Choices

| Decision | Rationale |
|---|---|
| **React + Vite** | Fast development, excellent DX, small production bundle. No complex routing needed — a single page is the right fit for a tool techs open and close on every job. |
| **Tailwind CSS** | Utility-first styling means no context-switching to write CSS. Responsive layout (3-column desktop, single-column mobile) implemented in ~10 lines of grid classes. |
| **JSON imports (no API)** | The data files are small and static. Bundling them at build time means the app works offline — critical when a tech is in a basement with no signal. |
| **No global state library** | `useState` + `useMemo` in a single App component covers all state. Adding Redux or Zustand would be premature complexity for a tool of this scope. |
| **No authentication** | Out of scope for a field estimate tool; a real deployment would sit behind the company's SSO or a simple PIN screen. |

## Data Normalization

CUST008 (`James & Tonya Mitchell`) in the source data uses different field names (`property_type` instead of `propertyType`, `sqft` instead of `squareFootage`). The `normalizeCustomer()` utility in `src/utils.js` handles this transparently so the UI always has a consistent shape, and the cleaned data is written back into `data/customers.json` so downstream tools see consistent records too.

## Pricing Logic

- **Parts cost** = `quantity × baseCost × (1 + markup / 100)` — markup is per-estimate and visible to the tech.
- **Labor cost** = `hourlyRate × hours` — hours are editable after being pre-filled from the data range.
- **Total** = parts cost + labor cost. No tax is added by default (varies by jurisdiction); a tech can note it manually.

## What I'd Do With More Time

1. **PDF generation server-side.** Browser print-to-PDF is good enough in the field but produces slightly inconsistent output. A lightweight PDF service (e.g., Puppeteer on a small Lambda) would give branded, pixel-perfect output every time.

2. **Offline-first with Service Worker.** The app already works offline once loaded (JSON is bundled), but a Service Worker would cache the shell so it loads even after the browser clears its cache.

3. **Customer record sync.** Right now the customer list is a static snapshot. Connecting to the company's CRM or field service platform (via a small REST API) would keep it current without anyone maintaining a file.

4. **Per-item markup overrides.** Currently markup is global. Sometimes a tech wants to hold margin on a commodity part and add more on a specialty item. A per-line override would handle this.

5. **Estimate history.** Saving estimates locally (IndexedDB) or to a backend lets techs pull up yesterday's quote if a customer calls back.

6. **System-age warnings.** The customer record includes `systemAge`. The app surfaces color coding (green/amber/red) in the customer card already — a next step would be proactive suggestions ("System is 22 years old — consider adding a full replacement option to this estimate") to help techs upsell appropriately.

7. **E-signature.** Replacing the paper signature line with a finger-drawn signature captured on the tablet would close the loop digitally and eliminate the last bit of paperwork.
