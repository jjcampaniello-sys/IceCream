// ============================================================================
// SIMULATEUR DE RECETTES NINJA CREAMI — VERSION FINALE PRODUCTION VERCEL
// ============================================================================

'use strict';

const DEFAULT_INGREDIENTS = [
  { name: "Fève de tonka", category: "Arôme", water: 0.05, fat: 0.20, protein: 0.05, carbs: 0.40, sweetness: 0.0, kcal: 300, fiber: 0.15 },
  { name: "Pâte de pistache (100%)", category: "Arôme", water: 0.05, fat: 0.45, protein: 0.20, carbs: 0.28, sweetness: 0.0, kcal: 570, fiber: 0.10 },
  { name: "Protéine de Whey (poudre)", category: "Complément", water: 0.05, fat: 0.03, protein: 0.80, carbs: 0.06, sweetness: 0.20, kcal: 360, fiber: 0.0 },
  { name: "Lait d'amande (sans sucre)", category: "Végétal", water: 0.97, fat: 0.01, protein: 0.005, carbs: 0.002, sweetness: 0.0, kcal: 13, fiber: 0.002 },
  { name: "Pêche (fraîche)",        category: "Fruit",      water: 0.89, fat: 0.003, protein: 0.01,  carbs: 0.09, sweetness: 0.50, kcal: 39,  fiber: 0.015 },
  { name: "Abricot (frais)",        category: "Fruit",      water: 0.86, fat: 0.001, protein: 0.015, carbs: 0.11, sweetness: 0.60, kcal: 48,  fiber: 0.02 },
  { name: "Fraise (fraîche)",       category: "Fruit",      water: 0.91, fat: 0.003, protein: 0.007, carbs: 0.06, sweetness: 0.35, kcal: 32,  fiber: 0.02 },
  { name: "Mangue (fraîche)",       category: "Fruit",      water: 0.84, fat: 0.004, protein: 0.008, carbs: 0.14, sweetness: 0.75, kcal: 60,  fiber: 0.017 },
  { name: "Framboise (fraîche)",    category: "Fruit",      water: 0.86, fat: 0.005, protein: 0.012, carbs: 0.12, sweetness: 0.55, kcal: 52,  fiber: 0.025 },
  { name: "Banane (mûre)",          category: "Fruit",      water: 0.75, fat: 0.003, protein: 0.011, carbs: 0.22, sweetness: 1.10, kcal: 89,  fiber: 0.026 },
  { name: "Myrtille (fraîche)",     category: "Fruit",      water: 0.84, fat: 0.005, protein: 0.007, carbs: 0.14, sweetness: 0.65, kcal: 57,  fiber: 0.024 },
  { name: "Fromage blanc 0%",       category: "Laitier",    water: 0.90, fat: 0.00,  protein: 0.08,  carbs: 0.04, sweetness: 0.10, kcal: 35,  fiber: 0.0 },
  { name: "Fromage blanc 20%",      category: "Laitier",    water: 0.82, fat: 0.04,  protein: 0.07,  carbs: 0.04, sweetness: 0.10, kcal: 55,  fiber: 0.0 },
  { name: "Fromage blanc 40%",      category: "Laitier",    water: 0.78, fat: 0.08,  protein: 0.07,  carbs: 0.04, sweetness: 0.10, kcal: 75,  fiber: 0.0 },
  { name: "Yaourt grec (10% MG)",   category: "Laitier",    water: 0.82, fat: 0.10,  protein: 0.09,  carbs: 0.04, sweetness: 0.10, kcal: 97,  fiber: 0.0 },
  { name: "Crème 30%",              category: "Laitier",    water: 0.62, fat: 0.30,  protein: 0.025, carbs: 0.03, sweetness: 0.05, kcal: 290, fiber: 0.0 },
  { name: "Crème 35%",              category: "Laitier",    water: 0.57, fat: 0.35,  protein: 0.025, carbs: 0.03, sweetness: 0.05, kcal: 340, fiber: 0.0 },
  { name: "Lait entier",            category: "Laitier",    water: 0.87, fat: 0.035, protein: 0.034, carbs: 0.048,sweetness: 0.10, kcal: 61,  fiber: 0.0 },
  { name: "Lait demi-écrémé",       category: "Laitier",    water: 0.89, fat: 0.015, protein: 0.033, carbs: 0.05, sweetness: 0.10, kcal: 46,  fiber: 0.0 },
  { name: "Sucre blanc",            category: "Sucre",     water: 0.0,  fat: 0.0,   protein: 0.0,   carbs: 1.0,  sweetness: 1.00, kcal: 387, fiber: 0.0 },
  { name: "Sucre roux",             category: "Sucre",     water: 0.02, fat: 0.0,   protein: 0.0,   carbs: 0.97, sweetness: 0.95, kcal: 380, fiber: 0.0 },
  { name: "Miel",                   category: "Sucre",     water: 0.18, fat: 0.0,   protein: 0.003, carbs: 0.82, sweetness: 1.20, kcal: 304, fiber: 0.0 },
  { name: "Sirop d'agave",          category: "Sucre",     water: 0.24, fat: 0.0,   protein: 0.0,   carbs: 0.76, sweetness: 1.35, kcal: 310, fiber: 0.0 },
  { name: "Sirop d'érable",         category: "Sucre",     water: 0.32, fat: 0.0,   protein: 0.0,   carbs: 0.67, sweetness: 1.10, kcal: 260, fiber: 0.0 },
  { name: "Allulose",               category: "Sucre",     water: 0.05, fat: 0.0,   protein: 0.0,   carbs: 0.95, sweetness: 0.70, kcal: 1.5, fiber: 0.0 },
  { name: "Erythritol",             category: "Sucre",     water: 0.0,  fat: 0.0,   protein: 0.0,   carbs: 1.0,  sweetness: 0.70, kcal: 0,   fiber: 0.0 },
  { name: "Gomme xanthane",         category: "Stabilisant",water: 0.10, fat: 0.0, protein: 0.0,   carbs: 0.90, sweetness: 0.0,  kcal: 280, fiber: 0.80 },
  { name: "Poudre à pâte (pudding)",category: "Stabilisant",water: 0.05, fat: 0.02,protein: 0.03,  carbs: 0.85, sweetness: 0.30, kcal: 350, fiber: 0.0 },
];

const TROUBLESHOOT = [
  { symptom: "Texture sableuse / poudreuse", cause: "Base trop sèche, manque de liquide ou de matière grasse. Premier cycle uniquement.", fixNow: "Creuser un puits au centre, ajouter 1-2 c. à soupe de liquide, puis Re-spin.", fixNext: "Augmenter le liquide, ajouter 1 c. à soupe de matière grasse." },
  { symptom: "Texture glacée / dure (cristaux)", cause: "Trop d'eau, pas assez de matière grasse ou de sucre.", fixNow: "Ajouter 1 c. à soupe de crème ou fromage blanc, puis Re-spin.", fixNext: "Réduire l'eau, augmenter la MG ou le sucre, ajouter un stabilisant." },
  { symptom: "Texture trop molle / liquide", cause: "Trop de sucre ou trop de liquide.", fixNow: "Remettre au congélateur 2-4h, puis re-spiner.", fixNext: "Réduire le sucre sous 25%, réduire le liquide." }
];

const MODES_DATA = [
  { mode: "Ice Cream", desc: "Glace traditionnelle équilibrée à base de lait entier et crème.", fat: "5% - 12%", sugar: "14% - 22%" },
  { mode: "Lite Ice Cream", desc: "Bases allégées en sucre/gras ou contenant des édulcorants. Gèle très dur.", fat: "< 5%", sugar: "< 14%" },
  { mode: "Sorbet", desc: "Préparations de fruits frais riches en eau et en jus, sans graisses.", fat: "0%", sugar: "> 12%" },
  { mode: "Frozen Yogurt", desc: "Bases construites principalement autour du yaourt ou fromage blanc.", fat: "3% - 9%", sugar: "12% - 18%" },
  { mode: "Gelato", desc: "Glaces italiennes denses à forte concentration de matières grasses.", fat: "> 11%", sugar: "16% - 22%" }
];

let catalogueIngredients = [];

document.addEventListener("DOMContentLoaded", () => {
  chargerCatalogueIngredients();
  initTabs();
  initThemeToggle();
  initTroubleshootTable();
  initModesTable();
  initSimulator();
});

function chargerCatalogueIngredients() {
  const custom = JSON.parse(localStorage.getItem("custom_ingredients")) || [];
  catalogueIngredients = [...DEFAULT_INGREDIENTS, ...custom];
}

function initTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const contents = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      tab.classList.add("active");
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) target.classList.add("active");
    });
  });
}

function initThemeToggle() {
  const toggle = document.querySelector("[data-theme-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
  });
}

function initTroubleshootTable() {
  const tbody = document.getElementById("troubleshoot-rows");
  if (!tbody) return;
  tbody.innerHTML = "";
  TROUBLESHOOT.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${item.symptom}</strong></td><td>${item.cause}</td><td>${item.fixNow}</td><td>${item.fixNext}</td>`;
    tbody.appendChild(tr);
  });
}

function initModesTable() {
  const tbody = document.getElementById("modes-rows");
  if (!tbody) return;
  tbody.innerHTML = "";
  MODES_DATA.forEach(m => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><strong>${m.mode}</strong></td><td>${m.desc}</td><td class="num">${m.fat}</td><td class="num">${m.sugar}</td>`;
    tbody.appendChild(tr);
  });
}

function initSimulator() {
  const btnAdd = document.getElementById("add-ingredient");
  if (btnAdd) btnAdd.addEventListener("click", () => ajouterLigneIngredient());
  
  ajouterLigneIngredient("Lait entier", 300);
  ajouterLigneIngredient("Sucre blanc", 50);
}

function genererOptionsSelect(selectedName = "") {
  let options = catalogueIngredients.map(ing => 
    `<option value="${ing.name}" ${ing.name === selectedName ? 'selected' : ''}>${ing.name}</option>`
  ).join("");
  options += `<option value="ADD_NEW_CUSTOM">➕ [Créer un ingrédient...]</option>`;
  return options;
}

function gererSaisieNouvelIngredient(selectElement) {
  if (selectElement.value !== "ADD_NEW_CUSTOM") return;

  const nom = prompt("Nom de votre nouvel ingrédient :");
  if (!nom) { selectElement.selectedIndex = 0; return; }

  const kcal = parseFloat(prompt("Calories (pour 100g) :", "0")) || 0;
  const eau = (parseFloat(prompt("Taux d'eau en % (ex: 85) :", "0")) || 0) / 100;
  const gras = (parseFloat(prompt("Taux de matières grasses en % :", "0")) || 0) / 100;
  const sucre = (parseFloat(prompt("Taux de sucre en % :", "0")) || 0) / 100;
  const cat = prompt("Catégorie (Fruit, Laitier, Sucre, Autre) :", "Autre") || "Autre";

  const nouvelIng = { name: nom, category: cat, water: eau, fat: gras, protein: 0.0, carbs: sucre, sweetness: 1.0, kcal: kcal };

  const customList = JSON.parse(localStorage.getItem("custom_ingredients")) || [];
  customList.push(nouvelIng);
  localStorage.setItem("custom_ingredients", JSON.stringify(customList));

  chargerCatalogueIngredients();
  
  document.querySelectorAll(".select-ingredient").forEach(sel => {
    const val = sel.value;
    sel.innerHTML = genererOptionsSelect(val === "ADD_NEW_CUSTOM" ? nom : val);
  });
  
  calculerRatios();
}


