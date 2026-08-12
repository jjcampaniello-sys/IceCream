/* ==========================================================================
   SIMULATEUR NINJA CREAMI - APP.JS
   ========================================================================== */

// --- CLEFS DE STOCKAGE LOCAL ---
const STORAGE_KEYS = {
  recipe: 'creami_recipe',
  mode: 'creami_mode',
  journal: 'creami_journal',
  ingredients: 'creami_ingredients'
};

// --- BASE DE DONNÉES DE RÉFÉRENCE PAR DÉFAUT ---
const DEFAULT_INGREDIENTS = [
  { name: 'Lait entier 3.5%', category: 'Laitier', water: 88, fat: 3.5, protein: 3.2, carbs: 4.8, sweetness: 15, kcal: 64, fiber: 0, notes: 'Base classique' },
  { name: 'Lait demi-écrémé', category: 'Laitier', water: 90, fat: 1.5, protein: 3.3, carbs: 4.9, sweetness: 15, kcal: 46, fiber: 0, notes: 'Base allégée' },
  { name: 'Crème entière 30%', category: 'Laitier', water: 63, fat: 30, protein: 2.3, carbs: 3.2, sweetness: 10, kcal: 292, fiber: 0, notes: 'Richesse et onctuosité' },
  { name: 'Crème liquide 15%', category: 'Laitier', water: 76, fat: 15, protein: 2.8, carbs: 4.0, sweetness: 10, kcal: 161, fiber: 0, notes: 'Équilibre moyen' },
  { name: 'Yaourt nature 0%', category: 'Laitier', water: 89, fat: 0.1, protein: 4.0, carbs: 4.5, sweetness: 10, kcal: 35, fiber: 0, notes: 'Base Frozen Yogurt' },
  { name: 'Yaourt grec 10%', category: 'Laitier', water: 79, fat: 10, protein: 3.5, carbs: 3.8, sweetness: 10, kcal: 120, fiber: 0, notes: 'Onctueux et acide' },
  { name: 'Fromage blanc 0%', category: 'Laitier', water: 87, fat: 0.2, protein: 8.0, carbs: 3.8, sweetness: 10, kcal: 49, fiber: 0, notes: 'Riche en protéines' },
  { name: 'Sucre blanc (Sucrose)', category: 'Sucrant', water: 0, fat: 0, protein: 0, carbs: 100, sweetness: 100, kcal: 400, fiber: 0, notes: 'Anti-gel standard' },
  { name: 'Miel', category: 'Sucrant', water: 18, fat: 0, protein: 0.3, carbs: 82, sweetness: 130, kcal: 304, fiber: 0, notes: 'Anti-gel fort, arôme' },
  { name: 'Sirop d\'agave', category: 'Sucrant', water: 22, fat: 0, protein: 0, carbs: 76, sweetness: 140, kcal: 310, fiber: 0, notes: 'Pouvoir sucrant élevé' },
  { name: 'Erythritol', category: 'Édulcorant', water: 0, fat: 0, protein: 0, carbs: 100, sweetness: 70, kcal: 0, fiber: 0, notes: '0 kcal, fort effet anti-gel' },
  { name: 'Fruits frais (Fraise/Framboise)', category: 'Fruit', water: 88, fat: 0.4, protein: 0.8, carbs: 7.0, sweetness: 20, kcal: 33, fiber: 2, notes: 'Base sorbet' },
  { name: 'Banane', category: 'Fruit', water: 75, fat: 0.3, protein: 1.1, carbs: 20.0, sweetness: 35, kcal: 89, fiber: 2.6, notes: 'Apporte du corps' }
];

// --- ÉTAT GLOBAL ---
let ingredientsDB = loadFromStorage(STORAGE_KEYS.ingredients, DEFAULT_INGREDIENTS);
let recipeLines = loadFromStorage(STORAGE_KEYS.recipe, [
  { name: 'Lait entier 3.5%', grams: 250 },
  { name: 'Crème entière 30%', grams: 100 },
  { name: 'Sucre blanc (Sucrose)', grams: 40 }
]);
let journal = loadFromStorage(STORAGE_KEYS.journal, []);

// --- UTILITAIRES DE STOCKAGE ---
function loadFromStorage(key, defaultValue) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error("Erreur de lecture LocalStorage:", e);
    return defaultValue;
  }
}

function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Erreur d'écriture LocalStorage:", e);
  }
}

// --- LOGIQUE D'AJUSTEMENT DU MODE ---
function applyModeAdjustment(selectedMode) {
  if (!Array.isArray(recipeLines)) return;

  const findInRecipe = (keyword) => 
    recipeLines.findIndex(line => line.name.toLowerCase().includes(keyword.toLowerCase()));

  const findInDB = (keyword) => 
    ingredientsDB.find(ing => ing.name.toLowerCase().includes(keyword.toLowerCase())) || ingredientsDB[0];

  switch (selectedMode) {
    case 'Frozen Yogurt': {
      let yogurtIdx = findInRecipe('yaourt');
      if (yogurtIdx === -1) yogurtIdx = findInRecipe('yogurt');

      if (yogurtIdx === -1) {
        const dbYogurt = findInDB('yaourt');
        recipeLines.push({ name: dbYogurt.name, grams: 350 });
      } else {
        recipeLines[yogurtIdx].grams = 350;
      }

      const creamIdx = findInRecipe('crème');
      if (creamIdx !== -1) recipeLines[creamIdx].grams = 20;
      
      const milkIdx = findInRecipe('lait');
      if (milkIdx !== -1) recipeLines[milkIdx].grams = 0;
      break;
    }

    case 'Sorbet': {
      let fruitIdx = findInRecipe('fruit');
      if (fruitIdx === -1) fruitIdx = findInRecipe('fraise');
      if (fruitIdx === -1) fruitIdx = findInRecipe('mangue');
      if (fruitIdx === -1) fruitIdx = findInRecipe('banane');

      if (fruitIdx === -1) {
        const dbFruit = findInDB('fruit');
        recipeLines.push({ name: dbFruit.name, grams: 300 });
      } else {
        recipeLines[fruitIdx].grams = 300;
      }

      const creamIdx = findInRecipe('crème');
      if (creamIdx !== -1) recipeLines[creamIdx].grams = 0;
      
      const milkIdx = findInRecipe('lait');
      if (milkIdx !== -1) recipeLines[milkIdx].grams = 0;
      break;
    }

    case 'Ice Cream':
    case 'Gelato': {
      let creamIdx = findInRecipe('crème');
      if (creamIdx === -1) {
        const dbCream = findInDB('crème');
        recipeLines.push({ name: dbCream.name, grams: 120 });
      } else {
        recipeLines[creamIdx].grams = 120;
      }

      let milkIdx = findInRecipe('lait');
      if (milkIdx === -1) {
        const dbMilk = findInDB('lait');
        recipeLines.push({ name: dbMilk.name, grams: 250 });
      } else {
        recipeLines[milkIdx].grams = 250;
      }
      break;
    }

    case 'Lite Ice Cream': {
      let milkIdx = findInRecipe('lait');
      if (milkIdx === -1) {
        const dbMilk = findInDB('lait');
        recipeLines.push({ name: dbMilk.name, grams: 300 });
      } else {
        recipeLines[milkIdx].grams = 300;
      }

      const creamIdx = findInRecipe('crème');
      if (creamIdx !== -1) recipeLines[creamIdx].grams = 30;
      break;
    }
  }

  // Filtrer les ingrédients tombés à 0g si nécessaire
  recipeLines = recipeLines.filter(line => line.grams > 0);
  saveToStorage(STORAGE_KEYS.recipe, recipeLines);
}

// --- SIMULATEUR ET RENDU DE LA RECETTE ---
function renderSimulator() {
  const tbody = document.getElementById('ingredient-rows');
  if (!tbody) return;

  tbody.innerHTML = '';

  let totalWeight = 0;
  let totalWater = 0;
  let totalFat = 0;
  let totalSugar = 0;
  let totalSolids = 0;

  recipeLines.forEach((line, index) => {
    const dbItem = ingredientsDB.find(i => i.name === line.name) || {
      category: 'Inconnu', water: 0, fat: 0, carbs: 0, sweetness: 0
    };

    const grams = Number(line.grams) || 0;
    const waterGrams = (grams * dbItem.water) / 100;
    const fatGrams = (grams * dbItem.fat) / 100;
    const sugarGrams = (grams * (dbItem.carbs * (dbItem.sweetness / 100))) / 100;
    const solidsGrams = grams - waterGrams;

    totalWeight += grams;
    totalWater += waterGrams;
    totalFat += fatGrams;
    totalSugar += sugarGrams;
    totalSolids += solidsGrams;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <select class="select-input row-name" data-index="${index}">
          ${ingredientsDB.map(ing => `<option value="${ing.name}" ${ing.name === line.name ? 'selected' : ''}>${ing.name}</option>`).join('')}
        </select>
      </td>
      <td class="num"><input type="number" class="num-input row-grams" data-index="${index}" value="${grams}" min="0"></td>
      <td class="num">${waterGrams.toFixed(1)}g</td>
      <td class="num">${fatGrams.toFixed(1)}g</td>
      <td class="num">${sugarGrams.toFixed(1)}g</td>
      <td class="num">${solidsGrams.toFixed(1)}g</td>
      <td><span class="badge">${dbItem.category}</span></td>
      <td><button class="btn-del" data-index="${index}">×</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Totaux
  document.getElementById('total-weight').textContent = `${totalWeight.toFixed(0)}g`;
  document.getElementById('total-water').textContent = `${totalWater.toFixed(1)}g`;
  document.getElementById('total-fat').textContent = `${totalFat.toFixed(1)}g`;
  document.getElementById('total-sugar').textContent = `${totalSugar.toFixed(1)}g`;
  document.getElementById('total-solids').textContent = `${totalSolids.toFixed(1)}g`;

  // Rendu de l'Analyse
  const fatPct = totalWeight > 0 ? (totalFat / totalWeight) * 100 : 0;
  const sugarPct = totalWeight > 0 ? (totalSugar / totalWeight) * 100 : 0;

  const analysisContainer = document.getElementById('analysis-stats');
  if (analysisContainer) {
    analysisContainer.innerHTML = `
      <div class="stat-card">
        <div class="stat-label">Matière Grasse</div>
        <div class="stat-value">${fatPct.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Équivalent Sucre</div>
        <div class="stat-value">${sugarPct.toFixed(1)}%</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Extrait Sec</div>
        <div class="stat-value">${totalWeight > 0 ? ((totalSolids / totalWeight) * 100).toFixed(1) : 0}%</div>
      </div>
    `;
  }

  // Calcul du mode conseillé
  let recommended = 'Lite Ice Cream';
  if (fatPct >= 8) recommended = 'Gelato';
  else if (fatPct >= 5) recommended = 'Ice Cream';
  else if (recipeLines.some(l => l.name.toLowerCase().includes('yaourt'))) recommended = 'Frozen Yogurt';
  else if (fatPct < 2 && sugarPct > 12) recommended = 'Sorbet';

  const recEl = document.getElementById('recommended-mode');
  if (recEl) recEl.textContent = recommended;

  // Synchronisation du sélecteur
  const modeSelect = document.getElementById('mode-select-input');
  if (modeSelect) {
    modeSelect.value = loadFromStorage(STORAGE_KEYS.mode, 'Lite Ice Cream');
  }

  attachRowEvents();
}

// --- ÉVÉNEMENTS DU TABLEAU D'INGRÉDIENTS ---
function attachRowEvents() {
  document.querySelectorAll('.row-name').forEach(select => {
    select.onchange = (e) => {
      const idx = e.target.dataset.index;
      recipeLines[idx].name = e.target.value;
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });

  document.querySelectorAll('.row-grams').forEach(input => {
    input.onchange = (e) => {
      const idx = e.target.dataset.index;
      recipeLines[idx].grams = Number(e.target.value) || 0;
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });

  document.querySelectorAll('.btn-del').forEach(btn => {
    btn.onclick = (e) => {
      const idx = e.target.dataset.index;
      recipeLines.splice(idx, 1);
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });
}

// --- GESTION DES ONGLETS ET DU THÈME ---
function setupUI() {
  // Onglets
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      const targetId = `tab-${tab.dataset.tab}`;
      const target = document.getElementById(targetId);
      if (target) target.classList.add('active');
    };
  });

  // Thème sombre/clair
  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.onclick = () => {
      document.body.classList.toggle('dark-theme');
    };
  }
}

// --- BINDING DES BOUTONS DE L'APPLICATION ---
function setupActions() {
  // --- BOUTON RÉAPPLIQUER ---
  const reapplyBtn = document.getElementById('reapply-mode');
  if (reapplyBtn) {
    reapplyBtn.onclick = function() {
      const selInput = document.getElementById('mode-select-input');
      const selectedMode = selInput ? selInput.value : 'Lite Ice Cream';

      // 1. Sauvegarder le mode choisi
      saveToStorage(STORAGE_KEYS.mode, selectedMode);

      // 2. Ajuster la recette
      applyModeAdjustment(selectedMode);

      // 3. Rafraîchir l'affichage
      renderSimulator();
    };
  }

  // --- CHANGEMENT MANUEL DU SÉLECTEUR ---
  const modeSelect = document.getElementById('mode-select-input');
  if (modeSelect) {
    modeSelect.onchange = function() {
      saveToStorage(STORAGE_KEYS.mode, modeSelect.value);
    };
  }

  // --- BOUTON AJOUTER INGRÉDIENT ---
  const addIngBtn = document.getElementById('add-ingredient');
  if (addIngBtn) {
    addIngBtn.onclick = function() {
      recipeLines.push({ name: ingredientsDB[0].name, grams: 100 });
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  }

  // --- BASE DE DONNÉES INGRÉDIENTS ---
  const addIngDbBtn = document.getElementById('add-ingredient-db');
  if (addIngDbBtn) {
    addIngDbBtn.onclick = function() {
      ingredientsDB.push({
        name: 'Nouveau ' + (ingredientsDB.length + 1), category: 'Autre',
        water: 50, fat: 0, protein: 0, carbs: 50, sweetness: 50, kcal: 200, fiber: 0, notes: ''
      });
      saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB);
      renderIngredientsDB();
    };
  }

  const resetIngBtn = document.getElementById('reset-ingredients');
  if (resetIngBtn) {
    resetIngBtn.onclick = function() {
      if (confirm("Réinitialiser la base d'ingrédients aux valeurs par défaut ?")) {
        ingredientsDB = JSON.parse(JSON.stringify(DEFAULT_INGREDIENTS));
        saveToStorage(STORAGE_KEYS.ingredients, ingredientsDB);
        renderIngredientsDB();
        renderSimulator();
      }
    };
  }
}

// --- RENDU DE LA BASE DE DONNÉES ---
function renderIngredientsDB() {
  const tbody = document.getElementById('ingredients-db-rows');
  if (!tbody) return;

  tbody.innerHTML = '';
  ingredientsDB.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>${item.name}</strong></td>
      <td>${item.category}</td>
      <td class="num">${item.water}%</td>
      <td class="num">${item.fat}%</td>
      <td class="num">${item.protein}%</td>
      <td class="num">${item.carbs}%</td>
      <td class="num">${item.sweetness}</td>
      <td class="num">${item.kcal}</td>
      <td class="num">${item.fiber}g</td>
      <td>${item.notes || '-'}</td>
    `;
    tbody.appendChild(tr);
  });
}

// --- INITIALISATION AU CHARGEMENT DU DOM ---
document.addEventListener('DOMContentLoaded', () => {
  setupUI();
  setupActions();
  renderSimulator();
  renderIngredientsDB();
});
