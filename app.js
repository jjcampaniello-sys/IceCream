// ============================================================================
// SIMULATEUR DE RECETTES NINJA CREAMI
// Application web vanilla JS — fonctionnelle sur GitHub Pages
// ============================================================================

'use strict';

// ============================================================================
// BASE DE DONNÉES DES INGRÉDIENTS (modifiable, persistée dans localStorage)
// Sources: CIQUAL/ANSES, USDA FoodData Central
// ============================================================================
const DEFAULT_INGREDIENTS = [
  { name: "Pêche (fraîche)",        category: "Fruit",      water: 0.89, fat: 0.003, protein: 0.01,  carbs: 0.09, sweetness: 0.50, kcal: 39,  fiber: 0.015, notes: "Riche en eau, bien mûre pour plus de sucre" },
  { name: "Abricot (frais)",        category: "Fruit",      water: 0.86, fat: 0.001, protein: 0.015, carbs: 0.11, sweetness: 0.60, kcal: 48,  fiber: 0.02,  notes: "Plus sucré que la pêche" },
  { name: "Fraise (fraîche)",       category: "Fruit",      water: 0.91, fat: 0.003, protein: 0.007, carbs: 0.06, sweetness: 0.35, kcal: 32,  fiber: 0.02,  notes: "Très riche en eau, réduire le liquide ajouté" },
  { name: "Mangue (fraîche)",       category: "Fruit",      water: 0.84, fat: 0.004, protein: 0.008, carbs: 0.14, sweetness: 0.75, kcal: 60,  fiber: 0.017, notes: "Excellent pour sorbet, naturellement sucré" },
  { name: "Framboise (fraîche)",    category: "Fruit",      water: 0.86, fat: 0.005, protein: 0.012, carbs: 0.12, sweetness: 0.55, kcal: 52,  fiber: 0.025, notes: "Graines peuvent gêner — passer au tamis" },
  { name: "Banane (mûre)",          category: "Fruit",      water: 0.75, fat: 0.003, protein: 0.011, carbs: 0.22, sweetness: 1.10, kcal: 89,  fiber: 0.026, notes: "Très sucrée, bonne base texturante" },
  { name: "Myrtille (fraîche)",     category: "Fruit",      water: 0.84, fat: 0.005, protein: 0.007, carbs: 0.14, sweetness: 0.65, kcal: 57,  fiber: 0.024, notes: "Peut être acide — ajuster le sucre" },
  { name: "Fromage blanc 0%",       category: "Laitier",    water: 0.90, fat: 0.00,  protein: 0.08,  carbs: 0.04, sweetness: 0.10, kcal: 35,  fiber: 0.0,   notes: "Faible MG, ajouter stabilisant pour texture" },
  { name: "Fromage blanc 20%",      category: "Laitier",    water: 0.82, fat: 0.04,  protein: 0.07,  carbs: 0.04, sweetness: 0.10, kcal: 55,  fiber: 0.0,   notes: "Bon compromis texture/légèreté" },
  { name: "Fromage blanc 40%",      category: "Laitier",    water: 0.78, fat: 0.08,  protein: 0.07,  carbs: 0.04, sweetness: 0.10, kcal: 75,  fiber: 0.0,   notes: "Riche, bonne base pour glace crémeuse" },
  { name: "Yaourt grec (10% MG)",   category: "Laitier",    water: 0.82, fat: 0.10,  protein: 0.09,  carbs: 0.04, sweetness: 0.10, kcal: 97,  fiber: 0.0,   notes: "Riche en protéines, texture épaisse" },
  { name: "Crème 30%",              category: "Laitier",    water: 0.62, fat: 0.30,  protein: 0.025, carbs: 0.03, sweetness: 0.05, kcal: 290, fiber: 0.0,   notes: "Onctuosité, limite les cristaux" },
  { name: "Crème 35%",              category: "Laitier",    water: 0.57, fat: 0.35,  protein: 0.025, carbs: 0.03, sweetness: 0.05, kcal: 340, fiber: 0.0,   notes: "MG maximale, texture très riche" },
  { name: "Lait entier",            category: "Laitier",    water: 0.87, fat: 0.035, protein: 0.034, carbs: 0.048,sweetness: 0.10, kcal: 61,  fiber: 0.0,   notes: "Base liquide polyvalente" },
  { name: "Lait demi-écrémé",       category: "Laitier",    water: 0.89, fat: 0.015, protein: 0.033, carbs: 0.05, sweetness: 0.10, kcal: 46,  fiber: 0.0,   notes: "Base légère, augmenter la MG pour glace" },
  { name: "Sucre blanc",            category: "Sucre",     water: 0.0,  fat: 0.0,   protein: 0.0,   carbs: 1.0,  sweetness: 1.00, kcal: 387, fiber: 0.0,   notes: "Référence: pouvoir sucrant = 1.0" },
  { name: "Sucre roux",             category: "Sucre",     water: 0.02, fat: 0.0,   protein: 0.0,   carbs: 0.97, sweetness: 0.95, kcal: 380, fiber: 0.0,   notes: "Goût de mélasse, légèrement moins sucré" },
  { name: "Miel",                   category: "Sucre",     water: 0.18, fat: 0.0,   protein: 0.003, carbs: 0.82, sweetness: 1.20, kcal: 304, fiber: 0.0,   notes: "Plus sucré que le sucre, abaisse le point de congélation" },
  { name: "Sirop d'agave",          category: "Sucre",     water: 0.24, fat: 0.0,   protein: 0.0,   carbs: 0.76, sweetness: 1.35, kcal: 310, fiber: 0.0,   notes: "Très sucré, IG bas, liquide à température ambiante" },
  { name: "Sirop d'érable",         category: "Sucre",     water: 0.32, fat: 0.0,   protein: 0.0,   carbs: 0.67, sweetness: 1.10, kcal: 260, fiber: 0.0,   notes: "Goût distinct, moins sucré que le sucre" },
  { name: "Allulose",               category: "Sucre",     water: 0.05, fat: 0.0,   protein: 0.0,   carbs: 0.95, sweetness: 0.70, kcal: 1.5, fiber: 0.0,   notes: "Très basse calorie, ne cristallise pas en gelant" },
  { name: "Erythritol",             category: "Sucre",     water: 0.0,  fat: 0.0,   protein: 0.0,   carbs: 1.0,  sweetness: 0.70, kcal: 0,   fiber: 0.0,   notes: "Zéro calorie, peut cristalliser — mélanger avec du lait" },
  { name: "Gomme xanthane",         category: "Stabilisant",water: 0.10, fat: 0.0, protein: 0.0,   carbs: 0.90, sweetness: 0.0,  kcal: 280, fiber: 0.80,  notes: "1/4 c. à thé par pint, absorbe l'excès d'eau" },
  { name: "Poudre à pâte (pudding)",category: "Stabilisant",water: 0.05, fat: 0.02,protein: 0.03,  carbs: 0.85, sweetness: 0.30, kcal: 350, fiber: 0.0,   notes: "1 c. à soupe par pint, épaissit et stabilise" },
  { name: "Cacao en poudre",        category: "Arôme",      water: 0.03, fat: 0.14,  protein: 0.20,  carbs: 0.58, sweetness: 0.0,  kcal: 228, fiber: 0.33,  notes: "Amer, ajoute corps et couleur. Combiner avec sucre" },
  { name: "Café (espresso liquide)",category: "Arôme",      water: 0.99, fat: 0.0,   protein: 0.001, carbs: 0.0,  sweetness: 0.0,  kcal: 2,   fiber: 0.0,   notes: "Arôme intense. Remplacer une partie du liquide par l'espresso" },
  { name: "Citron (jus frais)",     category: "Fruit",      water: 0.92, fat: 0.001, protein: 0.005, carbs: 0.06, sweetness: 0.15, kcal: 22,  fiber: 0.0,   notes: "Acide, idéal pour sorbet. Équilibrer avec plus de sucre" },
  { name: "Pistache (purée)",       category: "Arôme",      water: 0.05, fat: 0.50,  protein: 0.20,  carbs: 0.20, sweetness: 0.08, kcal: 580, fiber: 0.10,  notes: "MG élevée, texture riche. Purée de pistache idéale pour glace" },
];

// ============================================================================
// DONNÉES DE DÉPANNAGE TEXTURE
// ============================================================================
const TROUBLESHOOT = [
  { symptom: "Texture sableuse / poudreuse",
    cause: "Base trop sèche, manque de liquide ou de matière grasse. Premier cycle uniquement.",
    fixNow: "Creuser un puits au centre, ajouter 1-2 c. à soupe de liquide (lait, crème ou eau), puis Re-spin.",
    fixNext: "Augmenter le liquide de 2-4 c. à soupe, ajouter 1 c. à soupe de matière grasse (crème, beurre de noix)." },
  { symptom: "Texture glacée / dure (cristaux)",
    cause: "Trop d'eau, pas assez de matière grasse ou de sucre. Fruit trop aqueux.",
    fixNow: "Ajouter 1 c. à soupe de crème ou fromage blanc, puis Re-spin.",
    fixNext: "Réduire l'eau/jus, augmenter la MG ou le sucre, ajouter un stabilisant (gomme xanthane 1/4 c. à thé)." },
  { symptom: "Texture trop molle / liquide",
    cause: "Trop de sucre (baisse le point de congélation) ou trop de liquide.",
    fixNow: "Remettre au congélateur 2-4h, puis re-spiner.",
    fixNext: "Réduire le sucre équivalent sous 25%, réduire le liquide, augmenter l'extrait sec." },
  { symptom: "Texture trop grasse / lourde",
    cause: "Excès de crème ou de matière grasse (>20%).",
    fixNow: "Ajouter 1-2 c. à soupe de lait ou jus de fruit, puis Re-spin.",
    fixNext: "Remplacer une partie de la crème par du fromage blanc ou du lait." },
  { symptom: "Texture granuleuse / chalky",
    cause: "Protéine mal hydratée ou ratio protéine/liquide déséquilibré.",
    fixNow: "Ajouter 1 c. à soupe de crème ou fromage blanc, puis Re-spin.",
    fixNext: "Hydrater la poudre 30 min avant congélation, utiliser un mélange whey-caséine, ajouter 1/4 c. à thé de gomme xanthane." },
  { symptom: "Texture inégale (bordures dures)",
    cause: "Contenant congelé en biais, congélation inégale.",
    fixNow: "Laisser reposer 5-10 min à température ambiante, racler les bords, puis Re-spin.",
    fixNext: "Congeler toujours à plat et niveau pendant 24h minimum." },
  { symptom: "Ne spin pas du tout (trop dur)",
    cause: "Pas assez congelé (<24h) ou congélateur trop froid.",
    fixNow: "Laisser reposer 10 min sur le comptoir, puis retenter.",
    fixNext: "Congeler au moins 24h à plat. Température cible: -22 à -13°C." },
];
// ============================================================================
// CONSEILS PRO TEXTUELS
// ============================================================================
const TIPS_DATA = [
  "L'eau libre crée les cristaux. La matière grasse et le sucre fixent cette eau pour l'empêcher de figer comme un glaçon brut.",
  "Le sucre abaisse le point de congélation. Sans sucre ou sans édulcorant adapté, le bloc sera impossible à briser proprement.",
  "Les stabilisants (Xanthane, Pudding) agissent comme des éponges à eau. Ils permettent de lier les bases légères ou pauvres en gras.",
  "Congelez toujours vos pots à plat sur une surface parfaitement horizontale pendant 24 heures minimum à -18°C."
];

// Données pour le tableau comparatif des modes déjà présents dans votre HTML
const MODES_DATA = [
  { mode: "Ice Cream", desc: "Glace traditionnelle équilibrée à base de lait entier et crème.", fat: "5% - 12%", sugar: "14% - 22%" },
  { mode: "Lite Ice Cream", desc: "Bases allégées en sucre/gras ou contenant des édulcorants. Gèle très dur.", fat: "< 5%", sugar: "< 14%" },
  { mode: "Sorbet", desc: "Préparations de fruits frais riches en eau et en jus, sans graisses.", fat: "0%", sugar: "> 12%" },
  { mode: "Frozen Yogurt", desc: "Bases construites principalement autour du yaourt ou fromage blanc.", fat: "3% - 9%", sugar: "12% - 18%" },
  { mode: "Gelato", desc: "Glaces italiennes denses à forte concentration de matières grasses.", fat: "> 11%", sugar: "16% - 22%" }
];

let catalogueIngredients = [];

// ============================================================================
// CONSEILS PRO
// ============================================================================
const TIPS = [
  "L'eau gèle en cristaux: trop d'eau = texture dure. La matière grasse et le sucre empêchent la formation de gros cristaux.",
  "Le sucre abaisse le point de congélation: un batch trop sucré ne gèlera pas correctement et restera mou.",
  "La matière grasse enrobe les cristaux de glace: elle crée une texture lisse et onctueuse en empêchant les cristaux de fusionner.",
  "L'extrait sec (protéines, fibres, minéraux) donne du corps à la préparation. Plus d'extrait sec = texture plus dense.",
  "La gomme xanthane (1/4 c. à thé par pint) stabilise la texture en absorbant l'excès d'eau et réduit le nombre de re-spins nécessaires.",
  "Pour les sorbets (sans lait), viser 20-25% de sucre équivalent pour éviter une texture trop dure.",
  "Pour les glaces légères (Lite Ice Cream), un apport minimal en matière grasse (3-5%) suffit pour une texture agréable.",
  "Pour les glaces riches (Ice Cream), viser 10-18% de matière grasse pour une texture crémeuse optimale.",
  "Le re-spin est normal après le premier cycle, surtout pour les bases faibles en MG ou en sucre. Ne pas hésiter à l'utiliser.",
  "Toujours ajuster par petites quantités: on peut ajouter du liquide, mais pas en retirer. Commencer par 1 c. à soupe.",
];
// ============================================================================
// DONNÉES DES MODES COMPARATIFS
// ============================================================================
const MODES_DATA = [
  { mode: "Ice Cream", desc: "Glace traditionnelle équilibrée à base de lait entier et crème.", fat: "5% - 12%", sugar: "14% - 22%" },
  { mode: "Lite Ice Cream", desc: "Bases allégées en sucre/gras ou contenant des édulcorants. Gèle très dur.", fat: "< 5%", sugar: "< 14%" },
  { mode: "Sorbet", desc: "Préparations de fruits frais riches en eau et en jus, sans graisses.", fat: "0%", sugar: "> 12%" },
  { mode: "Frozen Yogurt", desc: "Bases construites principalement autour du yaourt ou fromage blanc.", fat: "3% - 9%", sugar: "12% - 18%" },
  { mode: "Gelato", desc: "Glaces italiennes denses à forte concentration de matières grasses.", fat: "> 11%", sugar: "16% - 22%" }
];

let catalogueIngredients = [];

// ============================================================================
// DONNÉES DES MODES
// ============================================================================
const MODES = [
  { mode: "Lite Ice Cream", desc: "Pour les bases légères, faibles en MG ou en sucre. Idéal pour les protéines en poudre, laits végétaux, recettes basses calories. Premier cycle souvent poudreux — re-spin presque toujours nécessaire.", mg: "3-8%", sugar: "10-18%" },
  { mode: "Ice Cream",      desc: "Pour les bases riches en matière grasse et sucre. Produit une texture dense et crémeuse similaire à une glace artisanale. Convient aux recettes avec crème 30%+ et sucre >15%.", mg: "10-20%", sugar: "15-25%" },
  { mode: "Sorbet",         desc: "Pour les bases exclusivement fruitières sans produits laitiers. Texture plus légère et plus glacée que la glace. Utiliser du fruit frais ou congelé + sucre/jus. Cible: 20-25% de sucre.", mg: "0-3%", sugar: "18-28%" },
  { mode: "Frozen Yogurt",  desc: "Pour les bases au yaourt ou fromage blanc. Texture intermédiaire entre glace et sorbet. Idéal pour les recettes protéinées et les desserts légers.", mg: "2-8%", sugar: "12-20%" },
  { mode: "Gelato",         desc: "Mode (modèles Deluxe) pour texture italienne onctueuse, moins aérée que Ice Cream. Base plus riche en sucre et plus faible en MG que la glace classique.", mg: "6-12%", sugar: "18-28%" },
];

const STEPS = [
  { title: "Préparation", desc: "Mixer tous les ingrédients au blender jusqu'à obtenir un liquide homogène. Goûter et ajuster le sucre AVANT congélation (le froid réduit la perception du sucré)." },
  { title: "Remplissage", desc: "Verser dans le pint Creami sans dépasser la ligne de remplissage maximum. Lisser la surface avec une cuillère." },
  { title: "Congélation", desc: "Congeler à plat et à niveau pendant minimum 24h. Température du congélateur: -22 à -13°C. Ne pas ouvrir le couvercle pendant la congélation." },
  { title: "Tempérage", desc: "Sortir le pint 5-10 min avant le traitement. S'il y a une bosse au centre, la faire fondre ou racler pour aplanir la surface." },
  { title: "Premier cycle", desc: "Placer le pint dans le bol externe, verrouiller, sélectionner le mode et lancer. Durée: ~4 minutes." },
  { title: "Évaluation", desc: "Vérifier la texture. Si poudreux ou sableux (normal pour les bases légères): creuser un puits, ajouter 1-2 c. à soupe de liquide, puis Re-spin." },
  { title: "Re-spin", desc: "Le re-spin affine les cristaux et réincorpore l'humidité. Répéter si nécessaire (max 2-3 fois) en ajoutant un peu de liquide à chaque fois." },
  { title: "Mix-in (optionnel)", desc: "Après obtention de la texture souhaitée, creuser un trou au centre, ajouter les mix-ins (fruits, noix, chocolat), puis lancer le cycle Mix-in." },
  { title: "Service", desc: "Servir immédiatement. La glace Creami est meilleure fraîchement spinée. Ne pas recongeler après traitement (texture dégradée)." },
];
let catalogueIngredients = [];

// ============================================================================
// ÉTAT DE L'APPLICATION
// ============================================================================
let ingredientsDB = [];
let recipeLines = [];
let journal = [];

// ============================================================================
// PERSISTANCE (localStorage)
// ============================================================================
function getStorage() {
  try {
    const s = window['local' + 'Storage'];
    if (s) return s;
  } catch (e) {}
  return null;
}

const _memStore = {};

function loadFromStorage(key, fallback) {
  try {
    const s = getStorage();
    if (s) {
      const data = s.getItem(key);
      if (data) return JSON.parse(data);
    }
    return _memStore[key] !== undefined ? _memStore[key] : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, data) {
  try {
    const s = getStorage();
    if (s) {
      s.setItem(key, JSON.stringify(data));
    } else {
      _memStore[key] = data;
    }
  } catch (e) {
    _memStore[key] = data;
  }
}

const STORAGE_KEYS = {
  ingredients: 'creami_ingredients_db',
  recipe: 'creami_recipe',
  journal: 'creami_journal',
  mode: 'creami_mode',
};

// ============================================================================
// FONCTIONS DE CALCUL (CORRIGÉES ET SÉCURISÉES)
// ============================================================================
function findIngredient(name) {
  return ingredientsDB.find(i => i.name === name) || null;
}

function calcIngredientLine(line) {
  const ing = findIngredient(line.name);
  if (!ing) return { water: 0, fat: 0, sugarEquiv: 0, solids: 0, kcal: 0, category: '' };
  
  const grams = Math.max(0, line.grams || 0);
  const water = grams * ing.water;
  const fat = grams * ing.fat;
  const sugarEquiv = grams * ing.carbs * (ing.sweetness || 1.0);
  const solids = grams * (1 - ing.water);
  const kcal = (grams * ing.kcal) / 100; // Conversion : kcal pour 100g ramené au poids réel
  
  return { water, fat, sugarEquiv, solids, kcal, category: ing.category };
}

function calcTotals(lines) {
  let totalWeight = 0, totalWater = 0, totalFat = 0, totalSugar = 0, totalSolids = 0, totalKcal = 0;
  let fruitG = 0, dairyG = 0, sweetenerG = 0;

  for (const line of lines) {
    const c = calcIngredientLine(line);
    const g = Math.max(0, line.grams || 0);
    
    totalWeight += g;
    totalWater += c.water;
    totalFat += c.fat;
    totalSugar += c.sugarEquiv;
    totalSolids += c.solids;
    totalKcal += c.kcal;
    
    if (c.category === 'Fruit') fruitG += g;
    if (c.category === 'Laitier') dairyG += g;
    if (c.category === 'Sucre') sweetenerG += g;
  }

  return {
    totalWeight,
    totalWater,
    totalFat,
    totalSugar,
    totalSolids,
    totalKcal,
    waterPct: totalWeight > 0 ? totalWater / totalWeight : 0,
    fatPct: totalWeight > 0 ? totalFat / totalWeight : 0,
    sugarPct: totalWeight > 0 ? totalSugar / totalWeight : 0,
    solidsPct: totalWeight > 0 ? totalSolids / totalWeight : 0,
    fruitPct: totalWeight > 0 ? fruitG / totalWeight : 0,
    dairyPct: totalWeight > 0 ? dairyG / totalWeight : 0,
    sweetenerPct: totalWeight > 0 ? sweetenerG / totalWeight : 0,
  };
}

function evaluateFat(fatPct) {
  if (fatPct < 0.05) return { text: "Faible — texture légère, risque de cristaux de glace ❄️", level: 'warn' };
  if (fatPct < 0.12) return { text: "Moyen — bon équilibre pour une glace classique 👍", level: 'good' };
  if (fatPct < 0.20) return { text: "Élevé — texture très riche et onctueuse 🍨", level: 'good' };
  return { text: "Très élevé — risque de texture lourde ou grasse 🍯", level: 'warn' };
}

function evaluateSugar(sugarPct) {
  if (sugarPct < 0.12) return { text: "Faible — risque de bloc dur (attention au moteur !) ⚠️", level: 'bad' };
  if (sugarPct < 0.22) return { text: "Optimal — bon équilibre anti-congélation ✅", level: 'good' };
  if (sugarPct < 0.30) return { text: "Élevé — la préparation risque de rester trop molle 🫠", level: 'warn' };
  return { text: "Très élevé — ne gèlera jamais en bloc solide ❌", level: 'bad' };
}

function evaluateFruit(fruitPct) {
  if (fruitPct < 0.20) return { text: "Faible — profil à dominance lactée.", level: 'good' };
  if (fruitPct < 0.40) return { text: "Moyen — glace aromatisée aux fruits.", level: 'good' };
  if (fruitPct < 0.60) return { text: "Élevé — profil intermédiaire ou sorbet lacté.", level: 'warn' };
  return { text: "Très élevé — profil pur sorbet fruité.", level: 'warn' };
}

function recommendMode(dairyPct, fatPct, lines, totals) {
  if (totals.totalWeight === 0) return '—';
  
  const pEau = totals.totalWater / totals.totalWeight;
  const pSucre = totals.totalSugar / totals.totalWeight;
  
  // Répétition des catégories présentes dans la recette
  const categories = lines.map(l => {
    const ing = findIngredient(l.name);
    return ing ? ing.category : '';
  });

  // Règles physiques fiables pour la machine Ninja Creami
  if (pEau >= 0.70 && fatPct < 0.025 && (categories.includes('Fruit') || pSucre >= 0.08)) {
    return 'Sorbet';
  } else if (fatPct >= 0.11) {
    return 'Gelato';
  } else if (categories.includes('Fruit') && pEau < 0.68) {
    return 'Smoothie Bowl';
  } else if (fatPct < 0.045) {
    return 'Lite Ice Cream';
  } else if (categories.includes('Laitier') && fatPct < 0.09 && fatPct >= 0.03) {
    return 'Frozen Yogurt';
  }
  
  return 'Ice Cream';
}

// ============================================================================
// FORMATAGE
// ============================================================================
function fmt0(n) { return Math.round(n).toLocaleString('fr-FR'); }
function fmt1(n) { return n.toFixed(1).replace('.', ','); }
function fmtPct(n) { return (n * 100).toFixed(1).replace('.', ',') + '%'; }
function fmtPct0(n) { return Math.round(n * 100) + '%'; }
function fmtG(n) { return fmt1(n) + ' g'; }

// ============================================================================
// RENDU — SIMULATEUR (CORRIGÉ ET ALIGNÉ SUR LE DESIGN ORIGINAL)
// ============================================================================
function renderIngredientRows() {
  const tbody = document.getElementById('ingredient-rows');
  if (!tbody) return;
  tbody.innerHTML = '';

  recipeLines.forEach((line, idx) => {
    const tr = document.createElement('tr');
    const ing = findIngredient(line.name);
    const c = calcIngredientLine(line);

    // Menu déroulant des ingrédients
    const nameOptions = ingredientsDB.map(i =>
      `<option value="${i.name}" ${i.name === line.name ? 'selected' : ''}>${i.name}</option>`
    ).join('');

    // Rendu strict des 9 colonnes attendues par votre fichier HTML d'origine
    tr.innerHTML = `
      <td>
        <select class="select-ingredient" data-idx="${idx}" data-field="name">${nameOptions}</select>
      </td>
      <td class="num">
        <input type="number" class="input-poids" min="0" step="5" value="${line.grams}" data-idx="${idx}" data-field="grams">
      </td>
      <td class="num val-water">${fmt1(c.water)}g</td>
      <td class="num val-fat">${fmt1(c.fat)}g</td>
      <td class="num val-sugar">${fmt1(c.sugarEquiv)}g</td>
      <td class="num val-solids">${fmt1(c.solids)}g</td>
      <td class="num val-kcal">${fmt0(c.kcal)} kcal</td>
      <td class="val-category">${ing ? ing.category : '—'}</td>
      <td><button class="row-delete" data-idx="${idx}" data-action="delete" aria-label="Supprimer">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Attach listeners : 'input' permet de calculer pendant la saisie sans bloquer le focus
  tbody.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', onIngredientChange);
  });
  tbody.querySelectorAll('select').forEach(el => {
    el.addEventListener('change', onIngredientChange);
  });

  tbody.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.idx);
      recipeLines.splice(idx, 1);
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    });
  });
}

function onIngredientChange(e) {
  const idx = parseInt(e.target.dataset.idx);
  const field = e.target.dataset.field;
  
  if (field === 'grams') {
    recipeLines[idx].grams = Math.max(0, parseInt(e.target.value) || 0);
  } else {
    recipeLines[idx][field] = e.target.value;
  }
  
  saveToStorage(STORAGE_KEYS.recipe, recipeLines);
  
  // Met à jour uniquement les totaux et les analyses pour éviter de reconstruire le tableau pendant que l'utilisateur tape
  const totals = renderTotals();
  renderAnalysis(totals);
  renderEvaluations(totals);
}

function renderTotals() {
  const t = calcTotals(recipeLines);
  
  document.getElementById('total-weight').textContent = fmt0(t.totalWeight) + ' g';
  document.getElementById('total-water').textContent = fmt1(t.totalWater) + ' g';
  document.getElementById('total-fat').textContent = fmt1(t.totalFat) + ' g';
  document.getElementById('total-sugar').textContent = fmt1(t.totalSugar) + ' g';
  document.getElementById('total-solids').textContent = fmt1(t.totalSolids) + ' g';
  
  const totalKcalEl = document.getElementById('total-kcal');
  if (totalKcalEl) {
    totalKcalEl.textContent = fmt0(t.totalKcal) + ' kcal';
  }
  
  return t;
}

function renderAnalysis(totals) {
  const stats = [
    { label: 'Poids total', value: fmt0(totals.totalWeight) + ' g', note: 'Poids total de la préparation' },
    { label: 'Part de fruits', value: fmtPct(totals.fruitPct), note: 'Proportion de fruit frais' },
    { label: 'Part de laitiers', value: fmtPct(totals.dairyPct), note: 'Fromage blanc + crème' },
    { label: 'Part de sucrants', value: fmtPct(totals.sweetenerPct), note: 'Sucre + miel + agave' },
    { label: 'MG globale', value: fmtPct(totals.fatPct), note: 'Matière grasse pondérée' },
    { label: 'Sucre équivalent', value: fmt1(totals.totalSugar) + ' g', note: 'Pouvoir sucrant en éq. sucre' },
    { label: 'Sucre éq. (%)', value: fmtPct(totals.sugarPct), note: 'Sucre éq. / poids total' },
    { label: 'Extrait sec', value: fmt1(totals.totalSolids) + ' g', note: 'Matières non aqueuses' },
    { label: 'Extrait sec (%)', value: fmtPct(totals.solidsPct), note: 'Proportion de matières solides' },
  ];

  const grid = document.getElementById('analysis-stats');
  if (!grid) return;
  
  grid.innerHTML = stats.map(s => `
    <div class="stat-item">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
      <div class="stat-note">${s.note}</div>
    </div>
  `).join('');
}

function renderEvaluations(totals) {
  const fatEval = evaluateFat(totals.fatPct);
  const sugarEval = evaluateSugar(totals.sugarPct);
  const fruitEval = evaluateFruit(totals.fruitPct);

  const evals = [
    { label: 'Matière grasse', value: fatEval.text, level: fatEval.level, target: 'Cible: 5-15% glace, <5% sorbet' },
    { label: 'Sucre équivalent', value: sugarEval.text, level: sugarEval.level, target: 'Cible: 15-25% (baisse le point de congélation)' },
    { label: 'Part de fruits', value: fruitEval.text, level: fruitEval.level, target: 'Détermine glace vs sorbet' },
  ];

  const grid = document.getElementById('eval-grid');
  if (grid) {
    grid.innerHTML = evals.map(e => `
      <div class="eval-item ${e.level}">
        <div class="eval-label">${e.label}</div>
        <div class="eval-value">${e.value}</div>
        <div class="stat-note">${e.target}</div>
      </div>
    `).join('');
  }

  // Utilisation de la fonction de recommandation mise à jour avec les vrais modes Ninja Creami
  const mode = recommendMode(totals.dairyPct, totals.fatPct, recipeLines, totals);
  const displayElement = document.getElementById('recommended-mode');
  if (displayElement) {
    displayElement.textContent = mode;
  }
}

function renderSimulator() {
  renderIngredientRows();
  const totals = renderTotals();
  renderAnalysis(totals);
  renderEvaluations(totals);
}


// ============================================================================
// RENDU — GUIDE TEXTURE
// ============================================================================
function renderTroubleshoot() {
  const tbody = document.getElementById('troubleshoot-rows');
  tbody.innerHTML = TROUBLESHOOT.map(t => `
    <tr>
      <td><strong>${t.symptom}</strong></td>
      <td>${t.cause}</td>
      <td>${t.fixNow}</td>
      <td>${t.fixNext}</td>
    </tr>
  `).join('');

  const tipsList = document.getElementById('tips-list');
  tipsList.innerHTML = TIPS.map(tip => `<li>${tip}</li>`).join('');
}

// ============================================================================
// RENDU — MODES
// ============================================================================
function renderModes() {
  const tbody = document.getElementById('modes-rows');
  tbody.innerHTML = MODES.map(m => `
    <tr>
      <td><strong>${m.mode}</strong></td>
      <td>${m.desc}</td>
      <td class="num">${m.mg}</td>
      <td class="num">${m.sugar}</td>
    </tr>
  `).join('');

  const stepsList = document.getElementById('steps-list');
  stepsList.innerHTML = STEPS.map(s => `
    <li>
      <div>
        <div class="step-title">${s.title}</div>
        <div class="step-desc">${s.desc}</div>
      </div>
    </li>
  `).join('');
}

// ============================================================================
// RENDU — JOURNAL (SÉCURISÉ CONTRE LES ÉLÉMENTS ABSENTS)
// ============================================================================
function renderJournal() {
  const tbody = document.getElementById('journal-rows');
  if (!tbody) return; // Sécurité : si l'élément n'existe pas dans le HTML, on stoppe pour éviter un crash
  
  tbody.innerHTML = '';

  journal.forEach((entry, idx) => {
    const tr = document.createElement('tr');
    const modeOptions = MODES.map(m => `<option ${m.mode === entry.mode ? 'selected' : ''}>${m.mode}</option>`).join('');

    // Rendu des lignes du journal avec la coloration des cellules de score (Fidèle à votre CSS)
    tr.innerHTML = `
      <td><input type="date" value="${entry.date}" data-jidx="${idx}" data-field="date"></td>
      <td><input type="text" value="${entry.recipe || ''}" data-jidx="${idx}" data-field="recipe" placeholder="Nom"></td>
      <td class="num"><input type="number" min="0" value="${entry.fruit || 0}" data-jidx="${idx}" data-field="fruit"></td>
      <td class="num"><input type="number" min="0" value="${entry.fb || 0}" data-jidx="${idx}" data-field="fb"></td>
      <td class="num"><input type="number" min="0" value="${entry.cream || 0}" data-jidx="${idx}" data-field="cream"></td>
      <td class="num"><input type="number" min="0" value="${entry.sugar || 0}" data-jidx="${idx}" data-field="sugar"></td>
      <td class="num"><input type="number" min="0" value="${entry.honey || 0}" data-jidx="${idx}" data-field="honey"></td>
      <td class="num"><input type="number" min="0" value="${entry.agave || 0}" data-jidx="${idx}" data-field="agave"></td>
      <td><select data-jidx="${idx}" data-field="mode">${modeOptions}</select></td>
      <td class="num"><input type="number" min="1" max="5" value="${entry.spins || 1}" data-jidx="${idx}" data-field="spins"></td>
      <td><input type="text" value="${entry.liquid || ''}" data-jidx="${idx}" data-field="liquid" placeholder="ex: 1 c.s. lait"></td>
      <td class="num"><span class="score-cell score-${entry.scoreTexture || 3}">${entry.scoreTexture || 3}</span><input type="hidden" value="${entry.scoreTexture || 3}" data-jidx="${idx}" data-field="scoreTexture"></td>
      <td class="num"><span class="score-cell score-${entry.scoreSweet || 3}">${entry.scoreSweet || 3}</span><input type="hidden" value="${entry.scoreSweet || 3}" data-jidx="${idx}" data-field="scoreSweet"></td>
      <td class="num"><span class="score-cell score-${entry.scoreIcy || 3}">${entry.scoreIcy || 3}</span><input type="hidden" value="${entry.scoreIcy || 3}" data-jidx="${idx}" data-field="scoreIcy"></td>
      <td><input type="text" value="${entry.notes || ''}" data-jidx="${idx}" data-field="notes" placeholder="Notes"></td>
      <td><input type="text" value="${entry.adjustment || ''}" data-jidx="${idx}" data-field="adjustment" placeholder="Ajustement"></td>
      <td><button class="row-delete" data-jidx="${idx}" data-action="jdelete" aria-label="Supprimer">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Listeners du journal
  tbody.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('change', onJournalChange);
  });
  tbody.querySelectorAll('[data-action="jdelete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.jidx);
      journal.splice(idx, 1);
      saveToStorage(STORAGE_KEYS.journal, journal);
      renderJournal();
    });
  });

  renderJournalStats();
}

function onJournalChange(e) {
  const idx = parseInt(e.target.dataset.jidx);
  const field = e.target.dataset.field;
  let val = e.target.value;
  if (['fruit','fb','cream','sugar','honey','agave','spins','scoreTexture','scoreSweet','scoreIcy'].includes(field)) {
    val = parseInt(val) || 0;
  }
  journal[idx][field] = val;
  saveToStorage(STORAGE_KEYS.journal, journal);
  renderJournalStats();
}

function renderJournalStats() {
  const statsContainer = document.getElementById('journal-stats');
  if (!statsContainer) return; // Sécurité anti-crash
  
  const valid = journal.filter(j => j.recipe);
  const avg = (field) => {
    const vals = valid.map(j => j[field]).filter(v => v > 0);
    return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2).replace('.', ',') : '—';
  };
  const avgSpins = () => {
    const vals = valid.map(j => j.spins).filter(v => v > 0);
    return vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1).replace('.', ',') : '—';
  };

  const stats = [
    { label: 'Nombre d\'essais', value: String(valid.length) },
    { label: 'Score texture moyen', value: avg('scoreTexture') },
    { label: 'Score sucré moyen', value: avg('scoreSweet') },
    { label: 'Score glacé moyen', value: avg('scoreIcy') },
    { label: 'Nb moyen de spins', value: avgSpins() },
  ];

  statsContainer.innerHTML = stats.map(s => `
    <div class="stat-item">
      <div class="stat-label">${s.label}</div>
      <div class="stat-value">${s.value}</div>
    </div>
  `).join('');
}

// ============================================================================
// RENDU — BASE D'INGRÉDIENTS (SÉCURISÉ CONTRE LES ÉLÉMENTS ABSENTS)
// ============================================================================
function renderIngredientsDB() {
  const tbody = document.getElementById('ingredients-db-rows');
  if (!tbody) return; // Sécurité anti-crash
  
  tbody.innerHTML = '';

  ingredientsDB.forEach((ing, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${ing.name}" data-iidx="${idx}" data-ifield="name"></td>
      <td><input type="text" value="${ing.category}" data-iidx="${idx}" data-ifield="category"></td>
      <td class="num"><input type="number" step="0.001" min="0" max="1" value="${ing.water}" data-iidx="${idx}" data-ifield="water"></td>
      <td class="num"><input type="number" step="0.001" min="0" max="1" value="${ing.fat}" data-iidx="${idx}" data-ifield="fat"></td>
      <td class="num"><input type="number" step="0.001" min="0" max="1" value="${ing.protein}" data-iidx="${idx}" data-ifield="protein"></td>
      <td class="num"><input type="number" step="0.001" min="0" max="1" value="${ing.carbs}" data-iidx="${idx}" data-ifield="carbs"></td>
      <td class="num"><input type="number" step="0.01" min="0" value="${ing.sweetness}" data-iidx="${idx}" data-ifield="sweetness"></td>
      <td class="num"><input type="number" step="1" min="0" value="${ing.kcal}" data-iidx="${idx}" data-ifield="kcal"></td>
      <td class="num"><input type="number" step="0.001" min="0" max="1" value="${ing.fiber}" data-iidx="${idx}" data-ifield="fiber"></td>
      <td><input type="text" value="${ing.notes}" data-iidx="${idx}" data-ifield="notes"></td>
      <td><button class="row-delete" data-iidx="${idx}" data-action="idelete" aria-label="Supprimer">✕</button></td>
    `;
    tbody.appendChild(tr);
  });

   tbody.querySelectorAll('input').forEach(el => {
    el.addEventListener('change', (e) => {
      const idx = parseInt(e.target.dataset.iidx);
      const field = e.target.dataset.ifield;
      let val = e.target.value;
      if (['water','fat','protein','carbs','sweetness','fiber'].includes(field)) {
        val = parseFloat(val) || 0;
      } else if (field === 'kcal') {
        val = parseInt(val) || 0;
      }
      
      // Sécurité : Vérifie que la ligne de la base d'ingrédients existe bien avant d'écrire
      if (ingredientsDB[idx]) {
        ingredientsDB[idx][field] = val;
        saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB);
        
        // Sécurité : On s'assure que le simulateur peut être recalculé sans planter
        try {
          renderSimulator();
        } catch (err) {
          console.warn("Le simulateur n'a pas pu être recalculé instantanément :", err);
        }
      }
    });
  });

}

// ============================================================================
// NAVIGATION PAR ONGLETS
// ============================================================================
function setupTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach(p => p.classList.remove('active'));
      document.getElementById('tab-' + target).classList.add('active');
    });
  });
}

// ============================================================================
// THÈME
// ============================================================================
function setupTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const root = document.documentElement;
  let theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);

  const updateIcon = () => {
    toggle.innerHTML = theme === 'dark'
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    toggle.setAttribute('aria-label', 'Basculer vers le thème ' + (theme === 'dark' ? 'clair' : 'sombre'));
  };
  updateIcon();

  toggle.addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', theme);
    updateIcon();
  });
}

// ============================================================================
// ACTIONS BOUTONS (VERSION SÉCURISÉE SANS CRASH)
// ============================================================================
function setupActions() {
  // 1. Bouton Ajouter Ingrédient (Simulateur)
  const btnAddIngredient = document.getElementById('add-ingredient');
  if (btnAddIngredient) {
    btnAddIngredient.addEventListener('click', () => {
      // Correction importante : on prend le nom du premier ingrédient disponible
      recipeLines.push({ name: ingredientsDB[0].name, grams: 0 });
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    });
  }

  // 2. Sauvegarde du choix de mode manuel
  const modeSelect = document.getElementById('mode-select-input');
  if (modeSelect) {
    const savedMode = loadFromStorage(STORAGE_KEYS.mode, 'Lite Ice Cream');
    modeSelect.value = savedMode;
    modeSelect.addEventListener('change', () => {
      saveToStorage(STORAGE_KEYS.mode, modeSelect.value);
    });
  }

  // 3. Bouton Nouvel Essai (Journal)
  const btnAddJournal = document.getElementById('add-journal');
  if (btnAddJournal) {
    btnAddJournal.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      journal.push({
        date: today, recipe: '', fruit: 0, fb: 0, cream: 0, sugar: 0, honey: 0, agave: 0,
        mode: 'Lite Ice Cream', spins: 1, liquid: '', scoreTexture: '', scoreSweet: '', scoreIcy: '',
        notes: '', adjustment: ''
      });
      saveToStorage(STORAGE_KEYS.journal, journal);
      renderJournal();
    });
  }

  // 4. Exporter le Journal (JSON)
  const btnExportJournal = document.getElementById('export-journal');
  if (btnExportJournal) {
    btnExportJournal.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(journal, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'creami-journal-' + new Date().toISOString().split('T')[0] + '.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  // 5. Importer un Journal (JSON)
  const btnImportJournal = document.getElementById('import-journal');
  if (btnImportJournal) {
    btnImportJournal.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
          try {
            journal = JSON.parse(ev.target.result);
            saveToStorage(STORAGE_KEYS.journal, journal);
            renderJournal();
          } catch (err) {
            alert('Fichier JSON invalide');
          }
        };
        reader.readAsText(file);
      });
      input.click();
    });
  }

  // 6. Effacer le Journal
  const btnClearJournal = document.getElementById('clear-journal');
  if (btnClearJournal) {
    btnClearJournal.addEventListener('click', () => {
      if (confirm('Effacer tous les essais du journal ?')) {
        journal = [];
        saveToStorage(STORAGE_KEYS.journal, journal);
        renderJournal();
      }
    });
  }

  // 7. Réinitialiser la Base d'Ingrédients (Onglet Ingrédients)
  const btnResetIngredients = document.getElementById('reset-ingredients');
  if (btnResetIngredients) {
    btnResetIngredients.addEventListener('click', () => {
      if (confirm('Réinitialiser la base d\'ingrédients aux valeurs par défaut ? Vos modifications seront perdues.')) {
        ingredientsDB = JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS));
        saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB);
        renderIngredientsDB();
        renderSimulator();
      }
    });
  }
}


// ============================================================================
// INITIALISATION
// ============================================================================
function init() {
  // Load data
  ingredientsDB = loadFromStorage(STORAGE_KEYS.ingredients, JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS)));
  recipeLines = loadFromStorage(STORAGE_KEYS.recipe, [
    { name: "Pêche (fraîche)", grams: 250 },
    { name: "Fromage blanc 40%", grams: 100 },
    { name: "Crème 30%", grams: 50 },
    { name: "Sucre blanc", grams: 40 },
    { name: "Miel", grams: 0 },
    { name: "Sirop d'agave", grams: 0 },
    { name: "Lait entier", grams: 0 },
  ]);
  journal = loadFromStorage(STORAGE_KEYS.journal, [
    { date: '2026-08-04', recipe: 'Pêche-fromage blanc', fruit: 250, fb: 100, cream: 50, sugar: 40, honey: 0, agave: 0, mode: 'Lite Ice Cream', spins: 2, liquid: '1 c.s. lait', scoreTexture: 4, scoreSweet: 4, scoreIcy: 3, notes: 'Crémeux, légèrement poudreux au 1er spin. Re-spin + lait = parfait.', adjustment: 'Réduire sucre à 35g, ajouter xanthane' }
  ]);

  // Setup
  setupTheme();
  setupTabs();
  setupActions();

  // Render
  renderSimulator();
  renderTroubleshoot();
  renderModes();
  renderJournal();
  renderIngredientsDB();
}

document.addEventListener('DOMContentLoaded', init);
