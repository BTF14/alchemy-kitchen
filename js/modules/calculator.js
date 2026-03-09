// js/modules/calculator.js — Alchemy Kitchen refinement calculator

import { recipes, getRecipesByTier, getRecipeById } from '../../data/recipes.js';
import { t, getLang } from './i18n.js';

// Material icons mapping (unicode symbols for visual flair)
const MATERIAL_ICONS = {
  wheat:        '🌾',
  butter:       '🧈',
  turnip:       '🥬',
  carrot:       '🥕',
  cabbage:      '🥦',
  beans:        '🫘',
  goose_eggs:   '🥚',
  pumpkin:      '🎃',
  garlic:       '🧄',
  saffron:      '🌺',
  mutton:       '🐑',
  goat_milk:    '🥛',
  pork:         '🥩',
  beef:         '🥩',
  avalonian_beef: '⚔️',
  potato:       '🥔',
  default:      '◈'
};

// ── State ────────────────────────────────────────────────
let currentRecipe = null;
let currentQty    = 1;
let materialPrices = {}; // { [material.id]: number }
let sellPrice      = 0;
let usageFee       = 0;
let marketTax      = 6;

/**
 * Initialises the calculator and binds all controls.
 */
export function initCalculator() {
  const tierSelect   = document.getElementById('tier-select');
  const recipeSelect = document.getElementById('recipe-select');
  const qtyInput     = document.getElementById('qty-input');
  const feeInput     = document.getElementById('fee-input');

  if (!tierSelect || !recipeSelect) return;

  // Initial population
  populateRecipeSelect('all');

  // Bind tier select
  tierSelect.addEventListener('change', () => {
    populateRecipeSelect(tierSelect.value);
    setRecipe(recipeSelect.value);
  });

  // Bind recipe select
  recipeSelect.addEventListener('change', () => {
    setRecipe(recipeSelect.value);
  });

  // Bind quantity input
  if (qtyInput) {
    qtyInput.addEventListener('input', () => {
      currentQty = Math.max(1, parseInt(qtyInput.value, 10) || 1);
      updateCalculations();
    });
  }

  // Bind usage fee
  if (feeInput) {
    feeInput.addEventListener('input', () => {
      usageFee = parseFloat(feeInput.value) || 0;
      updateCalculations();
    });
  }

  // Bind market tax and sell price (delegated — inputs added dynamically)
  document.getElementById('pricing-panel')?.addEventListener('input', (e) => {
    if (e.target.id === 'sell-price') {
      sellPrice = parseFloat(e.target.value) || 0;
    }
    if (e.target.id === 'tax-input') {
      marketTax = parseFloat(e.target.value) || 0;
    }
    if (e.target.classList.contains('mat-price-input')) {
      const matId = e.target.getAttribute('data-mat-id');
      if (matId) {
        materialPrices[matId] = parseFloat(e.target.value) || 0;
        updateMatTotal(matId);
      }
    }
    updateCalculations();
  });

  // Language change: refresh all labels
  document.addEventListener('langchange', () => {
    if (currentRecipe) {
      renderRecipeInfo(currentRecipe);
      renderPricingPanel(currentRecipe);
    }
    populateRecipeSelect(tierSelect.value, currentRecipe?.id);
  });

  // Select first recipe by default
  if (recipeSelect.options.length > 0) {
    setRecipe(recipeSelect.value);
  }
}

// ─────────────────────────────────────────────────────────
// Populate recipe <select>
// ─────────────────────────────────────────────────────────
function populateRecipeSelect(tier, selectedId) {
  const select     = document.getElementById('recipe-select');
  const filteredRecipes = getRecipesByTier(tier);
  const lang       = getLang();

  select.innerHTML = '';
  filteredRecipes.forEach(r => {
    const opt = document.createElement('option');
    opt.value = r.id;
    opt.textContent = `T${r.tier} — ${lang === 'en' ? r.nameEn : r.nameEs}`;
    if (selectedId && r.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  });
}

// ─────────────────────────────────────────────────────────
// Set active recipe
// ─────────────────────────────────────────────────────────
function setRecipe(id) {
  const recipe = getRecipeById(id);
  if (!recipe) return;

  currentRecipe = recipe;
  // Reset material prices when recipe changes
  materialPrices = {};
  sellPrice = 0;

  renderRecipeInfo(recipe);
  renderPricingPanel(recipe);
  updateCalculations();
}

// ─────────────────────────────────────────────────────────
// Render recipe info panel
// ─────────────────────────────────────────────────────────
function renderRecipeInfo(recipe) {
  const lang         = getLang();
  const tierDisplay  = document.getElementById('recipe-tier-display');
  const nameDisplay  = document.getElementById('recipe-name-display');
  const outputQtyEl  = document.getElementById('recipe-output-qty');
  const outputNameEl = document.getElementById('recipe-output-name');
  const materialsGrid = document.getElementById('materials-grid');

  if (tierDisplay)  tierDisplay.textContent  = `T${recipe.tier}`;
  if (nameDisplay)  nameDisplay.textContent  = lang === 'en' ? recipe.nameEn : recipe.nameEs;
  if (outputQtyEl)  outputQtyEl.textContent  = `${recipe.outputQty}x`;
  if (outputNameEl) outputNameEl.textContent = lang === 'en' ? recipe.nameEn : recipe.nameEs;

  if (!materialsGrid) return;
  materialsGrid.innerHTML = '';

  recipe.materials.forEach(mat => {
    const chip = document.createElement('div');
    chip.className = 'material-chip';
    chip.innerHTML = `
      <div class="mat-icon" aria-hidden="true">${MATERIAL_ICONS[mat.id] || MATERIAL_ICONS.default}</div>
      <div class="mat-info">
        <div class="mat-name">${lang === 'en' ? mat.nameEn : mat.nameEs}</div>
        <div class="mat-qty">× ${mat.qty}</div>
      </div>
    `;
    materialsGrid.appendChild(chip);
  });
}

// ─────────────────────────────────────────────────────────
// Render pricing panel (dynamic material price inputs)
// ─────────────────────────────────────────────────────────
function renderPricingPanel(recipe) {
  const lang         = getLang();
  const pricingInputs = document.getElementById('pricing-inputs');
  if (!pricingInputs) return;

  pricingInputs.innerHTML = '';

  // Title row
  const header = document.createElement('div');
  header.innerHTML = `
    <div class="materials-title" style="margin-bottom:0.5rem;">${t('calc.matPrice')}</div>
  `;
  pricingInputs.appendChild(header);

  recipe.materials.forEach(mat => {
    const row = document.createElement('div');
    row.className = 'pricing-input-row';

    const totalQty = mat.qty * currentQty;
    const matName  = lang === 'en' ? mat.nameEn : mat.nameEs;

    row.innerHTML = `
      <label for="price-${mat.id}" class="pricing-mat-label" title="${matName} × ${totalQty}">
        ${matName} <span style="opacity:0.5;font-size:0.6rem;">× ${totalQty}</span>
      </label>
      <div style="display:flex;align-items:center;gap:4px;">
        <input
          type="number"
          id="price-${mat.id}"
          class="calc-input mat-price-input"
          data-mat-id="${mat.id}"
          min="0"
          placeholder="0"
          value="${materialPrices[mat.id] || ''}"
          aria-label="${matName} price"
          style="width:90px;text-align:right;"
        >
        <span id="mat-total-${mat.id}" class="pricing-mat-total" style="min-width:70px;text-align:right;font-size:0.62rem;color:var(--text-muted);">
          ${formatSilver((materialPrices[mat.id] || 0) * totalQty)}
        </span>
      </div>
    `;
    pricingInputs.appendChild(row);
  });
}

// ─────────────────────────────────────────────────────────
// Update individual material total display
// ─────────────────────────────────────────────────────────
function updateMatTotal(matId) {
  if (!currentRecipe) return;
  const mat     = currentRecipe.materials.find(m => m.id === matId);
  if (!mat) return;
  const totalEl = document.getElementById(`mat-total-${matId}`);
  if (!totalEl) return;
  const total = (materialPrices[matId] || 0) * mat.qty * currentQty;
  totalEl.textContent = formatSilver(total);
}

// ─────────────────────────────────────────────────────────
// Core calculation logic
// ─────────────────────────────────────────────────────────
function updateCalculations() {
  if (!currentRecipe) return;

  const qtyInput = document.getElementById('qty-input');
  if (qtyInput) currentQty = Math.max(1, parseInt(qtyInput.value, 10) || 1);

  // Rebuild pricing panel quantities if qty changed
  renderPricingPanel(currentRecipe);

  // Restore material prices (renderPricingPanel clears values)
  Object.entries(materialPrices).forEach(([id, price]) => {
    const input = document.querySelector(`[data-mat-id="${id}"]`);
    if (input) input.value = price || '';
    updateMatTotal(id);
  });

  // Total material cost
  let totalCost = 0;
  currentRecipe.materials.forEach(mat => {
    const price = materialPrices[mat.id] || 0;
    totalCost += price * mat.qty * currentQty;
  });

  // Add usage fee
  const feeAmount = totalCost * (usageFee / 100);
  totalCost += feeAmount;

  // Output: qty produced
  const outputTotal = currentRecipe.outputQty * currentQty;

  // Revenue (after market tax)
  const taxFactor    = 1 - (marketTax / 100);
  const grossRevenue = sellPrice * outputTotal;
  const netRevenue   = grossRevenue * taxFactor;

  // Net profit
  const profit = netRevenue - totalCost;

  // ROI
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  // Update display
  const costEl    = document.getElementById('result-cost');
  const revenueEl = document.getElementById('result-revenue');
  const profitEl  = document.getElementById('result-profit');
  const roiEl     = document.getElementById('result-roi');
  const barFill   = document.getElementById('result-bar-fill');

  if (costEl)    costEl.innerHTML    = `${formatSilver(totalCost)} <span>${t('calc.silver')}</span>`;
  if (revenueEl) revenueEl.innerHTML = `${formatSilver(netRevenue)} <span>${t('calc.silver')}</span>`;

  if (profitEl) {
    const isPos = profit > 0;
    const isNeg = profit < 0;
    profitEl.textContent = `${isPos ? '+' : ''}${formatSilver(profit)} ${t('calc.silver')}`;
    profitEl.className   = `result-value result-profit ${isPos ? 'positive' : isNeg ? 'negative' : 'neutral'}`;
  }

  if (roiEl) {
    const sign = roi > 0 ? '+' : '';
    roiEl.textContent = `${sign}${roi.toFixed(1)}%`;
    roiEl.style.color = roi > 0 ? '#7CD992' : roi < 0 ? '#E87070' : 'var(--text-muted)';
  }

  // Progress bar
  if (barFill) {
    const barPct = Math.min(Math.abs(roi), 200) / 2; // Cap at 200% ROI = full bar
    barFill.style.width = `${Math.max(0, barPct)}%`;
    barFill.className   = `result-bar-fill${profit < 0 ? ' negative' : ''}`;
  }
}

// ─────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────
function formatSilver(value) {
  if (!isFinite(value) || isNaN(value)) return '—';
  return new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(Math.round(value));
}
