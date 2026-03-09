// data/recipes.js — Albion Online Alchemy Kitchen Recipes
// All qty values represent materials needed per 1 output unit

export const recipes = [
  // ── TIER 3 ──
  {
    id: 'bread', tier: 3,
    nameEs: 'Pan', nameEn: 'Bread',
    outputQty: 1,
    materials: [
      { id: 'wheat',  nameEs: 'Trigo',        nameEn: 'Wheat',  qty: 16 },
      { id: 'butter', nameEs: 'Mantequilla',  nameEn: 'Butter', qty: 8  },
    ]
  },
  {
    id: 'turnip_soup', tier: 3,
    nameEs: 'Sopa de Nabo', nameEn: 'Turnip Soup',
    outputQty: 1,
    materials: [
      { id: 'turnip', nameEs: 'Nabo',         nameEn: 'Turnip', qty: 16 },
      { id: 'butter', nameEs: 'Mantequilla',  nameEn: 'Butter', qty: 8  },
    ]
  },

  // ── TIER 4 ──
  {
    id: 'carrot_soup', tier: 4,
    nameEs: 'Sopa de Zanahoria', nameEn: 'Carrot Soup',
    outputQty: 1,
    materials: [
      { id: 'carrot', nameEs: 'Zanahoria',    nameEn: 'Carrot', qty: 16 },
      { id: 'butter', nameEs: 'Mantequilla',  nameEn: 'Butter', qty: 8  },
    ]
  },
  {
    id: 'bean_salad', tier: 4,
    nameEs: 'Ensalada de Frijoles', nameEn: 'Bean Salad',
    outputQty: 1,
    materials: [
      { id: 'cabbage', nameEs: 'Col',         nameEn: 'Cabbage', qty: 16 },
      { id: 'beans',   nameEs: 'Frijoles',    nameEn: 'Beans',   qty: 8  },
    ]
  },
  {
    id: 'goose_egg_omelette', tier: 4,
    nameEs: 'Tortilla de Huevo de Ganso', nameEn: 'Goose Egg Omelette',
    outputQty: 1,
    materials: [
      { id: 'goose_eggs', nameEs: 'Huevos de Ganso', nameEn: 'Goose Eggs', qty: 8 },
      { id: 'butter',     nameEs: 'Mantequilla',     nameEn: 'Butter',     qty: 8 },
    ]
  },

  // ── TIER 5 ──
  {
    id: 'pumpkin_soup', tier: 5,
    nameEs: 'Sopa de Calabaza', nameEn: 'Pumpkin Soup',
    outputQty: 1,
    materials: [
      { id: 'pumpkin', nameEs: 'Calabaza',    nameEn: 'Pumpkin', qty: 16 },
      { id: 'butter',  nameEs: 'Mantequilla', nameEn: 'Butter',  qty: 8  },
      { id: 'garlic',  nameEs: 'Ajo',         nameEn: 'Garlic',  qty: 4  },
    ]
  },
  {
    id: 'herb_salad', tier: 5,
    nameEs: 'Ensalada de Hierbas', nameEn: 'Herb Salad',
    outputQty: 1,
    materials: [
      { id: 'saffron', nameEs: 'Azafrán', nameEn: 'Saffron', qty: 8  },
      { id: 'cabbage', nameEs: 'Col',     nameEn: 'Cabbage', qty: 16 },
    ]
  },
  {
    id: 'mutton_stew', tier: 5,
    nameEs: 'Estofado de Cordero', nameEn: 'Mutton Stew',
    outputQty: 1,
    materials: [
      { id: 'mutton', nameEs: 'Cordero', nameEn: 'Mutton', qty: 8  },
      { id: 'turnip', nameEs: 'Nabo',   nameEn: 'Turnip', qty: 16 },
    ]
  },

  // ── TIER 6 ──
  {
    id: 'goat_sandwich', tier: 6,
    nameEs: 'Sándwich de Cabra', nameEn: 'Goat Sandwich',
    outputQty: 1,
    materials: [
      { id: 'goat_milk', nameEs: 'Leche de Cabra', nameEn: 'Goat Milk', qty: 8  },
      { id: 'wheat',     nameEs: 'Trigo',          nameEn: 'Wheat',     qty: 16 },
      { id: 'butter',    nameEs: 'Mantequilla',    nameEn: 'Butter',    qty: 8  },
    ]
  },
  {
    id: 'pork_omelette', tier: 6,
    nameEs: 'Tortilla de Cerdo', nameEn: 'Pork Omelette',
    outputQty: 1,
    materials: [
      { id: 'pork',       nameEs: 'Cerdo',          nameEn: 'Pork',       qty: 8 },
      { id: 'goose_eggs', nameEs: 'Huevos de Ganso', nameEn: 'Goose Eggs', qty: 4 },
      { id: 'garlic',     nameEs: 'Ajo',            nameEn: 'Garlic',     qty: 4 },
    ]
  },
  {
    id: 'beef_salad', tier: 6,
    nameEs: 'Ensalada de Ternera', nameEn: 'Beef Salad',
    outputQty: 1,
    materials: [
      { id: 'beef',    nameEs: 'Ternera', nameEn: 'Beef',    qty: 4  },
      { id: 'cabbage', nameEs: 'Col',     nameEn: 'Cabbage', qty: 16 },
      { id: 'saffron', nameEs: 'Azafrán', nameEn: 'Saffron', qty: 4  },
    ]
  },

  // ── TIER 7 ──
  {
    id: 'beef_stew', tier: 7,
    nameEs: 'Estofado de Ternera', nameEn: 'Beef Stew',
    outputQty: 1,
    materials: [
      { id: 'beef',   nameEs: 'Ternera', nameEn: 'Beef',   qty: 8  },
      { id: 'turnip', nameEs: 'Nabo',   nameEn: 'Turnip', qty: 16 },
      { id: 'garlic', nameEs: 'Ajo',    nameEn: 'Garlic', qty: 4  },
      { id: 'potato', nameEs: 'Papa',   nameEn: 'Potato', qty: 8  },
    ]
  },
  {
    id: 'goat_pie', tier: 7,
    nameEs: 'Empanada de Cabra', nameEn: 'Goat Pie',
    outputQty: 1,
    materials: [
      { id: 'goat_milk', nameEs: 'Leche de Cabra', nameEn: 'Goat Milk', qty: 8  },
      { id: 'pumpkin',   nameEs: 'Calabaza',       nameEn: 'Pumpkin',   qty: 8  },
      { id: 'wheat',     nameEs: 'Trigo',          nameEn: 'Wheat',     qty: 16 },
      { id: 'butter',    nameEs: 'Mantequilla',    nameEn: 'Butter',    qty: 8  },
    ]
  },

  // ── TIER 8 ──
  {
    id: 'avalonian_beef_stew', tier: 8,
    nameEs: 'Estofado de Ternera Avalónico', nameEn: 'Avalonian Beef Stew',
    outputQty: 1,
    materials: [
      { id: 'avalonian_beef', nameEs: 'Ternera Avalónica', nameEn: 'Avalonian Beef', qty: 8  },
      { id: 'turnip',         nameEs: 'Nabo',              nameEn: 'Turnip',         qty: 16 },
      { id: 'garlic',         nameEs: 'Ajo',               nameEn: 'Garlic',         qty: 8  },
      { id: 'potato',         nameEs: 'Papa',              nameEn: 'Potato',         qty: 16 },
      { id: 'saffron',        nameEs: 'Azafrán',           nameEn: 'Saffron',        qty: 4  },
    ]
  },
];

/**
 * Returns recipes filtered by tier.
 * @param {number|'all'} tier
 * @returns {Array}
 */
export function getRecipesByTier(tier) {
  if (tier === 'all') return recipes;
  return recipes.filter(r => r.tier === Number(tier));
}

/**
 * Returns a recipe by ID.
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getRecipeById(id) {
  return recipes.find(r => r.id === id);
}
