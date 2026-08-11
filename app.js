============================================================================
// SIMULATEUR DE RECETTES NINJA CREAMI — ARCHITECTURE SÉCURISÉE COMPLÈTE
// ============================================================================

'use strict';

// 1. BASE DE DONNÉES DES INGRÉDIENTS (Ratios pour 1g, Kcal pour 100g)
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
  { name: "Cacao en poudre",        category: "Arôme",      water: 0.03, fat: 0.14,  protein: 0.20,  carbs: 0.58, sweetness: 0.0,  kcal: 228, fiber: 0.33,  notes: "Amer, ajoute corps et couleur." },
  { name: "Café (espresso liquide)",category: "Arôme",      water: 0.99, fat: 0.0,   protein: 0.001, carbs: 0.0,  sweetness: 0.0,  kcal: 2,   fiber: 0.0,   notes: "Arôme intense." },
  { name: "Citron (jus frais)",     category: "Fruit",      water: 0.92, fat: 0.001, protein: 0.005, carbs: 0.06, sweetness: 0.15, kcal: 22,  fiber: 0.0,   notes: "Acide, idéal pour sorbet." },
  { name: "Pistache (purée)",       category: "Arôme",      water: 0.05, fat: 0.50,  protein: 0.20,  carbs: 0.20, sweetness: 0.08, kcal: 580, fiber: 0.10,  notes: "MG élevée, texture riche." },
];

// 2. DONNÉES DE DÉPANNAGE TEXTURE
const TROUBLESHOOT = [
  { symptom: "Texture sableuse / poudreuse", cause: "Base trop sèche, manque de liquide ou de matière grasse. Premier cycle uniquement.", fixNow: "Creuser un puits au centre, ajouter 1-2 c. à soupe de liquide, puis Re-spin.", fixNext: "Augmenter le liquide, ajouter 1 c. à soupe de matière grasse." },
  { symptom: "Texture glacée / dure (cristaux)", cause: "Trop d'eau, pas assez de matière grasse ou de sucre. Fruit trop aqueux.", fixNow: "Ajouter 1 c. à soupe de crème ou fromage blanc, puis Re-spin.", fixNext: "Réduire l'eau, augmenter la MG ou le sucre, ajouter un stabilisant." },
  { symptom: "Texture trop molle / liquide", cause: "Trop de sucre ou trop de liquide.", fixNow: "Remettre au congélateur 2-4h, puis re-spiner.", fixNext: "Réduire le sucre équivalent sous 25%, réduire le liquide." },
  { symptom: "Texture trop grasse / lourde", cause: "Excès de crème ou de matière grasse (>20%).", fixNow: "Ajouter 1-2 c. à soupe de lait ou jus de fruit, puis Re-spin.", fixNext: "Remplacer une partie de la crème par du fromage blanc." },
  { symptom: "Texture granuleuse / chalky", cause: "Protéine mal hydratée.", fixNow: "Ajouter 1 c. à soupe de crème, puis Re-spin.", fixNext: "Hydrater la poudre 30 min avant congélation." },
  { symptom: "Texture inégale (bordures dures)", cause: "Contenant congelé en biais.", fixNow: "Laisser reposer 5-10 min, racler les bords, puis Re-spin.", fixNext: "Congeler toujours à plat." },
  { symptom: "Ne spin pas du tout (trop dur)", cause: "Pas assez congelé ou congélateur trop froid.", fixNow: "Laisser reposer 10 min sur le comptoir, puis retenter.", fixNext: "Congeler au moins 24h à plat." }
];

// 3. CONSEILS PRO TEXTUELS
const TIPS = [
  "L'eau gèle en cristaux: trop d'eau = texture dure. La matière grasse et le sucre empêchent la formation de gros cristaux.",
  "Le sucre abaisse le point de congélation: un batch trop sucré ne gèlera pas correctement et restera mou.",
  "La matière grasse enrobe les cristaux de glace: elle crée une texture lisse et onctueuse.",
  "L'extrait sec (protéines, fibres, minéraux) donne du corps à la préparation. Plus d'extrait sec = texture plus dense.",
  "La gomme xanthane (1/4 c. à thé par pint) stabilise la texture en absorbant l'excès d'eau.",
  "Pour les sorbets (sans lait), viser 20-25% de sucre équivalent pour éviter une texture trop dure.",
  "Pour les glaces légères (Lite Ice Cream), un apport minimal en matière grasse (3-5%) suffit.",
  "Pour les glaces riches (Ice Cream), viser 10-18% de matière grasse.",
  "Le re-spin est normal après le premier cycle, surtout pour les bases faibles en MG.",
  "Toujours ajuster par petites quantités: commencer par 1 c. à soupe de liquide."
];

// 4. DONNÉES DES MODES ET ÉTAPES
const MODES = [
  { mode: "Lite Ice Cream", desc: "Pour les bases légères, faibles en MG ou en sucre. Premier cycle souvent poudreux — re-spin nécessaire.", mg: "3-8%", sugar: "10-18%" },
  { mode: "Ice Cream",      desc: "Pour les bases riches en matière grasse et sucre. Texture dense et crémeuse.", mg: "10-20%", sugar: "15-25%" },
  { mode: "Sorbet",         desc: "Pour les bases exclusivement fruitières sans produits laitiers. Cible: 20-25% de sucre.", mg: "0-3%", sugar: "18-28%" },
  { mode: "Frozen Yogurt",  desc: "Pour les bases au yaourt ou fromage blanc. Texture intermédiaire.", mg: "2-8%", sugar: "12-20%" },
  { mode: "Gelato",         desc: "Texture italienne onctueuse, moins aérée que Ice Cream. Base riche en sucre.", mg: "6-12%", sugar: "18-28%" }
];

const STEPS = [
  { title: "Préparation", desc: "Mixer tous les ingrédients au blender jusqu'à obtenir un liquide homogène." },
  { title: "Remplissage", desc: "Verser dans le pint Creami sans dépasser la ligne max." },
  { title: "Congélation", desc: "Congeler à plat pendant minimum 24h à -18°C." },
Use code with caution.
{ title: "Tempérage", desc: "Sortir le pint 5-10 min avant le traitement." },
{ title: "Premier cycle", desc: "Placer le pint dans le bol externe, sélectionner le mode et lancer." },
{ title: "Évaluation", desc: "Vérifier la texture. Si poudreux: creuser un puits, ajouter 1-2 c.s. de liquide, puis Re-spin." },
{ title: "Re-spin", desc: "Le re-spin affine les cristaux et réincorpore l'humidité." },
{ title: "Mix-in (optionnel)", desc: "Ajouter les mix-ins (noix, chocolat), puis lancer le cycle Mix-in." },
{ title: "Service", desc: "Servir immédiatement. La glace Creami est meilleure fraîchement spinée." }
];
// 5. ÉTAT DE L'APPLICATION ET VARIABLES GLOBALLES
let ingredientsDB = [];
let recipeLines = [];
let journal = [];
const STORAGE_KEYS = {
ingredients: 'creami_ingredients_db',
recipe: 'creami_recipe',
journal: 'creami_journal',
mode: 'creami_mode',
};
// 6. PERSISTANCE SÉCURISÉE (localStorage)
function loadFromStorage(key, fallback) {
try {
const data = localStorage.getItem(key);
return data ? JSON.parse(data) : fallback;
} catch (e) { return fallback; }
}
function saveToStorage(key, data) {
try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
}
// 7. FONCTIONS DE CALCUL NUTRITIONNEL
function findIngredient(name) {
return ingredientsDB.find(i => i.name === name) || DEFAULT_INGREDIENTS.find(i => i.name === name) || null;
}
function calcIngredientLine(line) {
const ing = findIngredient(line.name);
if (!ing) return { water: 0, fat: 0, sugarEquiv: 0, solids: 0, kcal: 0, category: '' };
const grams = Math.max(0, line.grams || 0);
return {
water: grams * ing.water,
fat: grams * ing.fat,
sugarEquiv: grams * ing.carbs * (ing.sweetness || 1.0),
solids: grams * (1 - ing.water),
kcal: (grams * ing.kcal) / 100,
category: ing.category
};
}
function calcTotals(lines) {
let weight = 0, water = 0, fat = 0, sugar = 0, solids = 0, kcal = 0;
let fruitG = 0, dairyG = 0, sweetenerG = 0;
lines.forEach(line => {
const c = calcIngredientLine(line);
const g = Math.max(0, line.grams || 0);
weight += g;
water += c.water;
fat += c.fat;
sugar += c.sugarEquiv;
solids += c.solids;
kcal += c.kcal;
if (c.category === 'Fruit') fruitG += g;
if (c.category === 'Laitier') dairyG += g;
if (c.category === 'Sucre') sweetenerG += g;
});
return {
totalWeight: weight, totalWater: water, totalFat: fat, totalSugar: sugar, totalSolids: solids, totalKcal: kcal,
waterPct: weight > 0 ? water / weight : 0,
fatPct: weight > 0 ? fat / weight : 0,
sugarPct: weight > 0 ? sugar / weight : 0,
solidsPct: weight > 0 ? solids / weight : 0,
fruitPct: weight > 0 ? fruitG / weight : 0,
dairyPct: weight > 0 ? dairyG / weight : 0,
sweetenerPct: weight > 0 ? sweetenerG / weight : 0
};
}
function evaluateFat(fatPct) {
if (fatPct < 0.05) return { text: "Faible — texture légère, risque de cristaux de glace ❄️", level: 'warn' };
if (fatPct < 0.12) return { text: "Moyen — bon équilibre pour une glace classique 👍", level: 'good' };
return { text: "Élevé — texture très riche et onctueuse 🍨", level: 'good' };
}
function evaluateSugar(sugarPct) {
if (sugarPct < 0.12) return { text: "Faible — risque de bloc dur (attention au moteur !) ⚠️", level: 'bad' };
if (sugarPct < 0.22) return { text: "Optimal — bon équilibre anti-congélation ✅", level: 'good' };
return { text: "Élevé — la préparation risque de rester trop molle 🫠", level: 'warn' };
}
function evaluateFruit(fruitPct) {
if (fruitPct < 0.20) return { text: "Faible — profil à dominance lactée.", level: 'good' };
return { text: "Très élevé — profil pur sorbet fruité.", level: 'warn' };
}
function recommendMode(dairyPct, fatPct, lines, totals) {
if (totals.totalWeight === 0) return '—';
const pEau = totals.totalWater / totals.totalWeight;
const pSucre = totals.totalSugar / totals.totalWeight;
const categories = lines.map(l => { const ing = findIngredient(l.name); return ing ? ing.category : ''; });
if (pEau >= 0.70 && fatPct < 0.025 && (categories.includes('Fruit') || pSucre >= 0.08)) return 'Sorbet';
if (fatPct >= 0.11) return 'Gelato';
if (categories.includes('Fruit') && pEau < 0.68) return 'Smoothie Bowl';
if (fatPct < 0.045) return 'Lite Ice Cream';
if (categories.includes('Laitier') && fatPct < 0.09 && fatPct >= 0.03) return 'Frozen Yogurt';
return 'Ice Cream';
}
// 8. FORMATAGE DE L'AFFICHAGE (NORMES FR)
function fmt0(n) { return Math.round(n).toLocaleString('fr-FR'); }
function fmt1(n) { return n.toFixed(1).replace('.', ','); }
function fmtPct(n) { return (n * 100).toFixed(1).replace('.', ',') + '%'; }
// 9. RENDU GRAPHIQUE — TABLEAU SIMULATEUR
function renderIngredientRows() {
const tbody = document.getElementById('ingredient-rows');
if (!tbody) return; tbody.innerHTML = '';
recipeLines.forEach((line, idx) => {
const tr = document.createElement('tr');
const ing = findIngredient(line.name);
const c = calcIngredientLine(line);
const options = ingredientsDB.map(i => <option value="${i.name}" ${i.name === line.name ? 'selected' : ''}>${i.name}</option>).join('');
tr.innerHTML = <td><select data-idx="${idx}" data-field="name">${options}</select></td> <td class="num"><input type="number" min="0" value="${line.grams}" data-idx="${idx}" data-field="grams"></td> <td class="num">${fmt1(c.water)}g</td> <td class="num">${fmt1(c.fat)}g</td> <td class="num">${fmt1(c.sugarEquiv)}g</td> <td class="num">${fmt1(c.solids)}g</td> <td class="num">${fmt0(c.kcal)} kcal</td> <td>${ing ? ing.category : ''}</td> <td><button class="row-delete" data-idx="${idx}" data-action="delete">✕</button></td>;
tbody.appendChild(tr);
});
tbody.querySelectorAll('select, input').forEach(el => el.addEventListener('input', onIngredientChange));
tbody.querySelectorAll('[data-action="delete"]').forEach(btn => btn.addEventListener('click', () => {
recipeLines.splice(parseInt(btn.dataset.idx), 1);
saveToStorage(STORAGE_KEYS.recipe, recipeLines); renderSimulator();
}));
}
function onIngredientChange(e) {
const idx = parseInt(e.target.dataset.idx);
const field = e.target.dataset.field;
if (field === 'grams') recipeLines[idx].grams = Math.max(0, parseInt(e.target.value) || 0);
else recipeLines[idx][field] = e.target.value;
saveToStorage(STORAGE_KEYS.recipe, recipeLines);
const t = renderTotals(); renderAnalysis(t); renderEvaluations(t);
}
function renderTotals() {
const t = calcTotals(recipeLines);
document.getElementById('total-weight').textContent = fmt0(t.totalWeight) + ' g';
document.getElementById('total-water').textContent = fmt1(t.totalWater) + ' g';
document.getElementById('total-fat').textContent = fmt1(t.totalFat) + ' g';
document.getElementById('total-sugar').textContent = fmt1(t.totalSugar) + ' g';
document.getElementById('total-solids').textContent = fmt1(t.totalSolids) + ' g';
const tk = document.getElementById('total-kcal');
if (tk) tk.textContent = fmt0(t.totalKcal) + ' kcal';
return t;
}
function renderAnalysis(totals) {
const grid = document.getElementById('analysis-stats'); if (!grid) return;
const stats = [
{ label: 'Poids total', value: fmt0(totals.totalWeight) + ' g', note: 'Préparation' },
{ label: 'Part de fruits', value: fmtPct(totals.fruitPct), note: 'Fruit frais' },
{ label: 'Part de laitiers', value: fmtPct(totals.dairyPct), note: 'Lacté' },
{ label: 'Part de sucrants', value: fmtPct(totals.sweetenerPct), note: 'Sucres' },
{ label: 'MG globale', value: fmtPct(totals.fatPct), note: 'Matière grasse' },
{ label: 'Sucre éq. (%)', value: fmtPct(totals.sugarPct), note: 'Sucre total' },
{ label: 'Extrait sec (%)', value: fmtPct(totals.solidsPct), note: 'Matières solides' }
];
grid.innerHTML = stats.map(s => <div class="stat-item"><div class="stat-label">${s.label}</div><div class="stat-value">${s.value}</div><div class="stat-note">${s.note}</div></div>).join('');
}
function renderEvaluations(totals) {
const f = evaluateFat(totals.fatPct), s = evaluateSugar(totals.sugarPct), fr = evaluateFruit(totals.fruitPct);
const grid = document.getElementById('eval-grid'); if (!grid) return;
grid.innerHTML = [
{ label: 'Matière grasse', value: f.text, level: f.level },
{ label: 'Sucre équivalent', value: s.text, level: s.level },
{ label: 'Part de fruits', value: fr.text, level: fr.level }
].map(e => <div class="eval-item ${e.level}"><div class="eval-label">${e.label}</div><div class="eval-value">${e.value}</div></div>).join('');
const displayElement = document.getElementById('recommended-mode');
if (displayElement) displayElement.textContent = recommendMode(totals.dairyPct, totals.fatPct, recipeLines, totals);
}
// 10. RENDU AUTRES ONGLETS (TEXTURE, MODES, JOURNAL)
function renderTroubleshoot() {
const tb = document.getElementById('troubleshoot-rows'); if (tb) tb.innerHTML = TROUBLESHOOT.map(t => <tr><td><strong>${t.symptom}</strong></td><td>${t.cause}</td><td>${t.fixNow}</td><td>${t.fixNext}</td></tr>).join('');
const tl = document.getElementById('tips-list'); if (tl) tl.innerHTML = TIPS.map(tip => <li>${tip}</li>).join('');
}
// Fixed to accurately fill elements matching your HTML structure without freezing
function renderModes() {
const mr = document.getElementById('modes-rows'); if (mr) mr.innerHTML = MODES.map(m => <tr><td><strong>${m.mode}</strong></td><td>${m.desc}</td><td class="num">${m.mg}</td><td class="num">${m.sugar}</td></tr>).join('');
const sl = document.getElementById('steps-list'); if (sl) sl.innerHTML = STEPS.map(s => <li><div class="step-title">${s.title}</div><div class="step-desc">${s.desc}</div></li>).join('');
}
function renderJournal() {
const tbody = document.getElementById('journal-rows'); if (!tbody) return; tbody.innerHTML = '';
journal.forEach((entry, idx) => {
const tr = document.createElement('tr');
tr.innerHTML = <td><input type="date" value="${entry.date}" data-jidx="${idx}" data-field="date"></td> <td><input type="text" value="${entry.recipe || ''}" data-jidx="${idx}" data-field="recipe"></td> <td class="num"><input type="number" value="${entry.fruit || 0}" data-jidx="${idx}" data-field="fruit"></td> <td class="num"><input type="number" value="${entry.fb || 0}" data-jidx="${idx}" data-field="fb"></td> <td class="num"><input type="number" value="${entry.cream || 0}" data-jidx="${idx}" data-field="cream"></td> <td class="num"><input type="number" value="${entry.sugar || 0}" data-jidx="${idx}" data-field="sugar"></td> <td class="num"><input type="number" value="${entry.honey || 0}" data-jidx="${idx}" data-field="honey"></td> <td class="num"><input type="number" value="${entry.agave || 0}" data-jidx="${idx}" data-field="agave"></td> <td><select data-jidx="${idx}" data-field="mode">${MODES.map(m=><option ${m.mode===entry.mode?'selected':''}>${m.mode}).join('')}</select></td> <td class="num"><input type="number" value="${entry.spins || 1}" data-jidx="${idx}" data-field="spins"></td> <td><input type="text" value="${entry.liquid || ''}" data-jidx="${idx}" data-field="liquid"></td> <td class="num"><span class="score-cell score-${entry.scoreTexture||3}">${entry.scoreTexture||3}</span></td> <td class="num"><span class="score-cell score-${entry.scoreSweet||3}">${entry.scoreSweet||3}</span></td> <td class="num"><span class="score-cell score-${entry.scoreIcy||3}">${entry.scoreIcy||3}</span></td> <td><input type="text" value="${entry.notes || ''}" data-jidx="${idx}" data-field="notes"></td> <td><input type="text" value="${entry.adjustment || ''}" data-jidx="${idx}" data-field="adjustment"></td> <td><button class="row-delete" data-jidx="${idx}" data-action="jdelete">✕</button></td> ;
tbody.appendChild(tr);
});
// Safe validation on analytics dashboard inside the journal log
const js = document.getElementById('journal-stats');
if (js) { js.innerHTML = <div class="stat-item"><div class="stat-label">Essais cumulés</div><div class="stat-value">${journal.length}</div></div>; }
}
function renderIngredientsDB() {
const tbody = document.getElementById('ingredients-db-rows'); if (!tbody) return; tbody.innerHTML = '';
ingredientsDB.forEach((ing, idx) => {
const tr = document.createElement('tr');
tr.innerHTML = <td><input type="text" value="${ing.name}" data-iidx="${idx}" data-ifield="name"></td> <td><input type="text" value="${ing.category}" data-iidx="${idx}" data-ifield="category"></td> <td class="num"><input type="number" step="0.01" value="${ing.water}" data-iidx="${idx}" data-ifield="water"></td> <td class="num"><input type="number" step="0.01" value="${ing.fat}" data-iidx="${idx}" data-ifield="fat"></td> <td class="num"><input type="number" step="0.01" value="${ing.protein}" data-iidx="${idx}" data-ifield="protein"></td> <td class="num"><input type="number" step="0.01" value="${ing.carbs}" data-iidx="${idx}" data-ifield="carbs"></td> <td class="num"><input type="number" step="0.1" value="${ing.sweetness}" data-iidx="${idx}" data-ifield="sweetness"></td> <td class="num"><input type="number" value="${ing.kcal}" data-iidx="${idx}" data-ifield="kcal"></td> <td class="num"><input type="number" step="0.01" value="${ing.fiber}" data-iidx="${idx}" data-ifield="fiber"></td> <td><input type="text" value="${ing.notes || ''}" data-iidx="${idx}" data-ifield="notes"></td>;
tbody.appendChild(tr);
});
}
function renderSimulator() { renderIngredientRows(); const t = renderTotals(); renderAnalysis(t); renderEvaluations(t); }
// 11. NAVIGATION ET ACTIONS BOUTONS (SÉCURISÉES ANTI-CRASH)
function setupTabs() {
const tabs = document.querySelectorAll('.tab'), panels = document.querySelectorAll('.tab-content');
tabs.forEach(tab => tab.addEventListener('click', () => {
tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
tab.classList.add('active'); tab.setAttribute('aria-selected', 'true');
panels.forEach(p => p.classList.remove('active'));
const p = document.getElementById('tab-' + tab.dataset.tab); if (p) p.classList.add('active');
}));
}
function setupTheme() {
const toggle = document.querySelector('[data-theme-toggle]'), root = document.documentElement; if (!toggle) return;
let theme = 'light'; root.setAttribute('data-theme', theme);
toggle.addEventListener('click', () => { theme = theme === 'dark' ? 'light' : 'dark'; root.setAttribute('data-theme', theme); });
}
function setupActions() {
const addIng = document.getElementById('add-ingredient');
if (addIng) addIng.addEventListener('click', () => {
const firstIngredient = (ingredientsDB && ingredientsDB.length > 0) ? ingredientsDB[0].name : "Sucre blanc";
recipeLines.push({ name: firstIngredient, grams: 0 });
saveToStorage(STORAGE_KEYS.recipe, recipeLines); renderSimulator();
});
const addJ = document.getElementById('add-journal');
if (addJ) addJ.addEventListener('click', () => {
journal.push({ date: new Date().toISOString().split('T')[0], recipe: 'Nouveau test', fruit: 0, fb: 0, cream: 0, sugar: 0, honey: 0, agave: 0, mode: 'Lite Ice Cream', spins: 1, liquid: '', scoreTexture: 3, scoreSweet: 3, scoreIcy: 3, notes: '', adjustment: '' });
saveToStorage(STORAGE_KEYS.journal, journal); renderJournal();
});
const resetI = document.getElementById('reset-ingredients');
if (resetI) resetI.addEventListener('click', () => {
if (confirm('Réinitialiser la base d'ingrédients ?')) {
ingredientsDB = JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS));
saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB); renderIngredientsDB(); renderSimulator();
}
});
['export-journal', 'import-journal', 'clear-journal'].forEach(id => {
const el = document.getElementById(id); if (!el) return;
if (id === 'clear-journal') el.addEventListener('click', () => { if (confirm('Effacer le journal ?')) { journal = []; saveToStorage(STORAGE_KEYS.journal, journal); renderJournal(); } });
});
}
// 12. FONCTION INITIALE AU DEMARRAGE (INIT)
function init() {
ingredientsDB = loadFromStorage(STORAGE_KEYS.ingredients, null) || JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS));
if (!localStorage.getItem(STORAGE_KEYS.ingredients)) saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB);
recipeLines = loadFromStorage(STORAGE_KEYS.recipe, [
{ name: "Pêche (fraîche)", grams: 250 },
{ name: "Fromage blanc 40%", grams: 100 },
{ name: "Crème 30%", grams: 50 },
{ name: "Sucre blanc", grams: 40 }
]);
journal = loadFromStorage(STORAGE_KEYS.journal, []);
setupTheme();
setupTabs();
setupActions();
renderSimulator();
renderTroubleshoot();
renderModes();
renderJournal();
renderIngredientsDB();
}
document.addEventListener('DOMContentLoaded', init);

