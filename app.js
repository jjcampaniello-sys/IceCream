/* ==========================================================================
   SIMULATEUR NINJA CREAMI - APP.JS (VERSION COMPLÈTE RESTAURÉE)
   ========================================================================== */

const STORAGE_KEYS = {
  recipe: 'creami_recipe',
  mode: 'creami_mode',
  journal: 'creami_journal',
  ingredients: 'creami_ingredients'
};

const DEFAULT_INGREDIENTS = [
  { name: 'Lait entier 3.5%', category: 'Produits laitiers', water: 88, fat: 3.5, protein: 3.2, carbs: 4.8, sweetness: 15, kcal: 64, fiber: 0, notes: 'Base classique' },
  { name: 'Lait demi-écrémé', category: 'Produits laitiers', water: 90, fat: 1.5, protein: 3.3, carbs: 4.9, sweetness: 15, kcal: 46, fiber: 0, notes: 'Base allégée' },
  { name: 'Crème entière 30%', category: 'Produits laitiers', water: 63, fat: 30, protein: 2.3, carbs: 3.2, sweetness: 10, kcal: 292, fiber: 0, notes: 'Onctuosité' },
  { name: 'Crème liquide 15%', category: 'Produits laitiers', water: 76, fat: 15, protein: 2.8, carbs: 4, sweetness: 10, kcal: 161, fiber: 0, notes: 'Équilibre moyen' },
  { name: 'Mascarpone', category: 'Produits laitiers', water: 45, fat: 40, protein: 4.5, carbs: 3, sweetness: 10, kcal: 395, fiber: 0, notes: 'Enrichit gelato' },
  { name: 'Fromage blanc 0%', category: 'Produits laitiers', water: 87, fat: 0.2, protein: 8, carbs: 3.8, sweetness: 10, kcal: 49, fiber: 0, notes: 'Riche en protéines' },
  { name: 'Yaourt nature 0%', category: 'Produits laitiers', water: 89, fat: 0.1, protein: 4, carbs: 4.5, sweetness: 10, kcal: 35, fiber: 0, notes: 'Base Frozen Yogurt' },
  { name: 'Yaourt grec 10%', category: 'Produits laitiers', water: 79, fat: 10, protein: 3.5, carbs: 3.8, sweetness: 10, kcal: 120, fiber: 0, notes: 'Onctueux et acide' },
  { name: 'Sucre blanc', category: 'Sucres', water: 0, fat: 0, protein: 0, carbs: 100, sweetness: 100, kcal: 400, fiber: 0, notes: 'Sucrose standard' },
  { name: 'Miel', category: 'Sucres', water: 18, fat: 0, protein: 0.3, carbs: 82, sweetness: 130, kcal: 304, fiber: 0, notes: 'Anti-gel fort' },
  { name: 'Sirop d\'agave', category: 'Sucres', water: 22, fat: 0, protein: 0, carbs: 76, sweetness: 140, kcal: 310, fiber: 0, notes: 'Pouvoir sucrant élevé' },
  { name: 'Erythritol', category: 'Édulcorants', water: 0, fat: 0, protein: 0, carbs: 100, sweetness: 70, kcal: 0, fiber: 0, notes: '0 kcal' },
  { name: 'Banane', category: 'Fruits', water: 75, fat: 0.3, protein: 1.1, carbs: 20, sweetness: 35, kcal: 89, fiber: 2.6, notes: 'Texture et liant' },
  { name: 'Fraise / Fruits rouges', category: 'Fruits', water: 88, fat: 0.4, protein: 0.8, carbs: 7, sweetness: 20, kcal: 33, fiber: 2, notes: 'Base sorbet' },
  { name: 'Mangue', category: 'Fruits', water: 83, fat: 0.4, protein: 0.8, carbs: 15, sweetness: 40, kcal: 60, fiber: 1.6, notes: 'Riche en pectine' }
];

const DEFAULT_TROUBLESHOOT = [
  { symptom: 'Sableux / Fritable (Crumble)', cause: 'Manque de matière grasse ou de sucre (mélange trop dur)', fix: 'Ajouter un Re-spin avec 1 à 2 c.à.s de liquide (lait, crème)', future: 'Augmenter la crème ou le sucre dans le mix de base' },
  { symptom: 'Trop dur / Impossible à cuillérer', cause: 'Exces d\'eau ou manque d\'agents anti-gel (sucre, alcool)', fix: 'Laisser réchauffer 5-10 min à température ambiante', future: 'Ajouter du sucre, du miel ou du sirop d\'agave' },
  { symptom: 'Gommeux / Trop collant', cause: 'Excès de gomme (xanthane, guar) ou trop de protéines', fix: 'Mélanger avec un peu de lait froid', future: 'Réduire les stabilisants à moins de 1g par bol' },
  { symptom: 'Pellicule glacée sur les bords', cause: 'Froid extrême du bol Ninja Creami', fix: 'Gratter les bords avec une cuillère après le 1er spin', future: 'Passer le bol sous l\'eau tiède 30s avant de spiner' }
];

const DEFAULT_TIPS = [
  '<strong>Eau (60-70%) :</strong> L\'élément le plus abondant. Trop d\'eau crée une texture pailletée de glace.',
  '<strong>Matière Grasse (5-15%) :</strong> Donne l\'onctuosité et le nappe en bouche. Trop peu rend la glace cassante.',
  '<strong>Équivalent Sucre (12-20%) :</strong> Abaisser le point de congélation pour éviter un bloc de glace massif.',
  '<strong>Extrait Sec (30-40%) :</strong> Tout ce qui n\'est pas de l\'eau. Garantit une structure solide mais crémeuse.'
];

const DEFAULT_MODES_INFO = [
  { mode: 'Lite Ice Cream', desc: 'Pour recettes allégées en sucre et en gras.', fat: '3 - 6%', sugar: '10 - 14%' },
  { mode: 'Ice Cream', desc: 'Pour glaces traditionnelles équilibrées.', fat: '8 - 12%', sugar: '14 - 18%' },
  { mode: 'Gelato', desc: 'Glace dense à forte teneur en matière grasse.', fat: '10 - 16%', sugar: '16 - 20%' },
  { mode: 'Sorbet', desc: 'Mix de fruits et eau sans aucune matière grasse.', fat: '0 - 2%', sugar: '15 - 22%' },
  { mode: 'Frozen Yogurt', desc: 'Base de yaourt nature ou grec, légèrement sucrée.', fat: '1 - 6%', sugar: '12 - 16%' }
];

const DEFAULT_STEPS = [
  'Préparer et mixer les ingrédients jusqu\'à dissolution complète des sucres.',
  'Verser dans le bol Ninja Creami jusqu\'à la ligne MAX FILL.',
  'Placer au congélateur à **-18°C pendant au moins 24 heures** à plat.',
  'Sélectionner le mode adapté sur la machine (ex: Lite Ice Cream).',
  'Si la texture est effritée après le 1er passage, ajouter 1 c.à.s de liquide et lancer un **Re-spin**.'
];

// État local
let ingredientsDB = loadFromStorage(STORAGE_KEYS.ingredients, DEFAULT_INGREDIENTS);
let recipeLines = loadFromStorage(STORAGE_KEYS.recipe, [
  { name: 'Lait entier 3.5%', grams: 250 },
  { name: 'Crème entière 30%', grams: 100 },
  { name: 'Sucre blanc', grams: 40 }
]);
let journal = loadFromStorage(STORAGE_KEYS.journal, []);

function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
}

function saveToStorage(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
}

// Logique intelligente pour le bouton "Réappliquer"
function applyModeAdjustment(selectedMode) {
  if (!Array.isArray(recipeLines)) return;

  const findInRecipe = (kw) => recipeLines.findIndex(l => l.name.toLowerCase().includes(kw.toLowerCase()));
  const findInDB = (kw) => ingredientsDB.find(i => i.name.toLowerCase().includes(kw.toLowerCase())) || ingredientsDB[0];

  switch (selectedMode) {
    case 'Frozen Yogurt': {
      let yIdx = findInRecipe('yaourt');
      if (yIdx === -1) {
        const dbYogurt = findInDB('yaourt');
        recipeLines.push({ name: dbYogurt.name, grams: 350 });
      } else {
        recipeLines[yIdx].grams = 350;
      }
      const cIdx = findInRecipe('crème');
      if (cIdx !== -1) recipeLines[cIdx].grams = 20;
      const mIdx = findInRecipe('lait');
      if (mIdx !== -1) recipeLines[mIdx].grams = 0;
      break;
    }
    case 'Sorbet': {
      let fIdx = findInRecipe('fraise');
      if (fIdx === -1) fIdx = findInRecipe('fruit');
      if (fIdx === -1) fIdx = findInRecipe('mangue');
      if (fIdx === -1) {
        const dbFruit = findInDB('fraise') || findInDB('fruit');
        recipeLines.push({ name: dbFruit.name, grams: 300 });
      } else {
        recipeLines[fIdx].grams = 300;
      }
      const cIdx = findInRecipe('crème');
      if (cIdx !== -1) recipeLines[cIdx].grams = 0;
      const mIdx = findInRecipe('lait');
      if (mIdx !== -1) recipeLines[mIdx].grams = 0;
      break;
    }
    case 'Ice Cream':
    case 'Gelato': {
      let cIdx = findInRecipe('crème');
      if (cIdx === -1) {
        recipeLines.push({ name: findInDB('crème').name, grams: 120 });
      } else {
        recipeLines[cIdx].grams = 120;
      }
      let mIdx = findInRecipe('lait');
      if (mIdx === -1) {
        recipeLines.push({ name: findInDB('lait').name, grams: 250 });
      } else {
        recipeLines[mIdx].grams = 250;
      }
      break;
    }
    case 'Lite Ice Cream': {
      let mIdx = findInRecipe('lait');
      if (mIdx === -1) {
        recipeLines.push({ name: findInDB('lait').name, grams: 300 });
      } else {
        recipeLines[mIdx].grams = 300;
      }
      const cIdx = findInRecipe('crème');
      if (cIdx !== -1) recipeLines[cIdx].grams = 30;
      break;
    }
  }

  recipeLines = recipeLines.filter(l => l.grams > 0);
  saveToStorage(STORAGE_KEYS.recipe, recipeLines);
}

// Rendu des jauges de couleur d'évaluation
function renderEvaluationBar(label, valuePct, minIdeal, maxIdeal) {
  let statusClass = 'good';
  let advice = 'Équilibré';

  if (valuePct < minIdeal) {
    statusClass = 'low';
    advice = 'Un peu bas';
  } else if (valuePct > maxIdeal) {
    statusClass = 'high';
    advice = 'Un peu élevé';
  }

  return `
    <div class="eval-card ${statusClass}">
      <div class="eval-header">
        <span class="eval-label">${label}</span>
        <span class="eval-val">${valuePct.toFixed(1)}%</span>
      </div>
      <div class="eval-bar-bg">
        <div class="eval-bar-fill" style="width: ${Math.min(valuePct * 3, 100)}%;"></div>
      </div>
      <div class="eval-status">${advice} (Cible : ${minIdeal}-${maxIdeal}%)</div>
    </div>
  `;
}

function renderSimulator() {
  const tbody = document.getElementById('ingredient-rows');
  if (!tbody) return;

  tbody.innerHTML = '';
  let totalWeight = 0, totalWater = 0, totalFat = 0, totalSugar = 0, totalSolids = 0;

  recipeLines.forEach((line, index) => {
    const dbItem = ingredientsDB.find(i => i.name === line.name) || {
      category: 'Autre', water: 0, fat: 0, carbs: 0, sweetness: 0
    };

    const grams = Number(line.grams) || 0;
    const wGrams = (grams * dbItem.water) / 100;
    const fGrams = (grams * dbItem.fat) / 100;
    const sGrams = (grams * (dbItem.carbs * (dbItem.sweetness / 100))) / 100;
    const solGrams = grams - wGrams;

    totalWeight += grams;
    totalWater += wGrams;
    totalFat += fGrams;
    totalSugar += sGrams;
    totalSolids += solGrams;

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <select class="select-input row-name" data-index="${index}">
          ${ingredientsDB.map(ing => `<option value="${ing.name}" ${ing.name === line.name ? 'selected' : ''}>${ing.name}</option>`).join('')}
        </select>
      </td>
      <td class="num"><input type="number" class="num-input row-grams" data-index="${index}" value="${grams}" min="0"></td>
      <td class="num">${wGrams.toFixed(1)}g</td>
      <td class="num">${fGrams.toFixed(1)}g</td>
      <td class="num">${sGrams.toFixed(1)}g</td>
      <td class="num">${solGrams.toFixed(1)}g</td>
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

  // Statistiques
  const fatPct = totalWeight > 0 ? (totalFat / totalWeight) * 100 : 0;
  const sugarPct = totalWeight > 0 ? (totalSugar / totalWeight) * 100 : 0;
  const solidsPct = totalWeight > 0 ? (totalSolids / totalWeight) * 100 : 0;
  const waterPct = totalWeight > 0 ? (totalWater / totalWeight) * 100 : 0;

  const analysisContainer = document.getElementById('analysis-stats');
  if (analysisContainer) {
    analysisContainer.innerHTML = `
      <div class="stat-card"><div class="stat-label">Matière Grasse</div><div class="stat-value">${fatPct.toFixed(1)}%</div></div>
      <div class="stat-card"><div class="stat-label">Équivalent Sucre</div><div class="stat-value">${sugarPct.toFixed(1)}%</div></div>
      <div class="stat-card"><div class="stat-label">Extrait Sec</div><div class="stat-value">${solidsPct.toFixed(1)}%</div></div>
      <div class="stat-card"><div class="stat-label">Eau</div><div class="stat-value">${waterPct.toFixed(1)}%</div></div>
    `;
  }

  // Barres d'évaluation avec conseils visuels
  const evalGrid = document.getElementById('eval-grid');
  if (evalGrid) {
    evalGrid.innerHTML = 
      renderEvaluationBar('Taux de Matière Grasse', fatPct, 5, 12) +
      renderEvaluationBar('Taux de Sucre éq.', sugarPct, 12, 18) +
      renderEvaluationBar('Extrait Sec Total', solidsPct, 30, 40);
  }

  // Recommandation dynamique
  let recommended = 'Lite Ice Cream';
  if (fatPct >= 8) recommended = 'Gelato';
  else if (fatPct >= 5) recommended = 'Ice Cream';
  else if (recipeLines.some(l => l.name.toLowerCase().includes('yaourt'))) recommended = 'Frozen Yogurt';
  else if (fatPct < 2 && sugarPct > 12) recommended = 'Sorbet';

  const recEl = document.getElementById('recommended-mode');
  if (recEl) recEl.textContent = recommended;

  const modeSelect = document.getElementById('mode-select-input');
  if (modeSelect) {
    modeSelect.value = loadFromStorage(STORAGE_KEYS.mode, 'Lite Ice Cream');
  }

  attachRowEvents();
}

function attachRowEvents() {
  document.querySelectorAll('.row-name').forEach(s => {
    s.onchange = (e) => {
      recipeLines[e.target.dataset.index].name = e.target.value;
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });

  document.querySelectorAll('.row-grams').forEach(i => {
    i.onchange = (e) => {
      recipeLines[e.target.dataset.index].grams = Number(e.target.value) || 0;
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });

  document.querySelectorAll('.btn-del').forEach(b => {
    b.onclick = (e) => {
      recipeLines.splice(e.target.dataset.index, 1);
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  });
}

function renderGuides() {
  const tsBody = document.getElementById('troubleshoot-rows');
  if (tsBody) {
    tsBody.innerHTML = DEFAULT_TROUBLESHOOT.map(t => `
      <tr>
        <td><strong>${t.symptom}</strong></td>
        <td>${t.cause}</td>
        <td>${t.fix}</td>
        <td>${t.future}</td>
      </tr>
    `).join('');
  }

  const tipsList = document.getElementById('tips-list');
  if (tipsList) {
    tipsList.innerHTML = DEFAULT_TIPS.map(tip => `<li>${tip}</li>`).join('');
  }

  const modesBody = document.getElementById('modes-rows');
  if (modesBody) {
    modesBody.innerHTML = DEFAULT_MODES_INFO.map(m => `
      <tr>
        <td><strong>${m.mode}</strong></td>
        <td>${m.desc}</td>
        <td class="num">${m.fat}</td>
        <td class="num">${m.sugar}</td>
      </tr>
    `).join('');
  }

  const stepsList = document.getElementById('steps-list');
  if (stepsList) {
    stepsList.innerHTML = DEFAULT_STEPS.map(s => `<li>${s}</li>`).join('');
  }
}

function renderIngredientsDB() {
  const tbody = document.getElementById('ingredients-db-rows');
  if (!tbody) return;

  tbody.innerHTML = ingredientsDB.map(i => `
    <tr>
      <td><strong>${i.name}</strong></td>
      <td><span class="badge">${i.category}</span></td>
      <td class="num">${i.water}%</td>
      <td class="num">${i.fat}%</td>
      <td class="num">${i.protein}%</td>
      <td class="num">${i.carbs}%</td>
      <td class="num">${i.sweetness}</td>
      <td class="num">${i.kcal}</td>
      <td class="num">${i.fiber}g</td>
      <td>${i.notes || '-'}</td>
    </tr>
  `).join('');
}

function setupUI() {
  document.querySelectorAll('.tab').forEach(tab => {
    tab.onclick = () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(`tab-${tab.dataset.tab}`);
      if (target) target.classList.add('active');
    };
  });

  const themeToggle = document.querySelector('[data-theme-toggle]');
  if (themeToggle) {
    themeToggle.onclick = () => document.body.classList.toggle('dark-theme');
  }
}

function setupActions() {
  const reapplyBtn = document.getElementById('reapply-mode');
  if (reapplyBtn) {
    reapplyBtn.onclick = function() {
      const selInput = document.getElementById('mode-select-input');
      const selectedMode = selInput ? selInput.value : 'Lite Ice Cream';
      saveToStorage(STORAGE_KEYS.mode, selectedMode);
      applyModeAdjustment(selectedMode);
      renderSimulator();
    };
  }

  const modeSelect = document.getElementById('mode-select-input');
  if (modeSelect) {
    modeSelect.onchange = function() {
      saveToStorage(STORAGE_KEYS.mode, modeSelect.value);
    };
  }

  const addIngBtn = document.getElementById('add-ingredient');
  if (addIngBtn) {
    addIngBtn.onclick = function() {
      recipeLines.push({ name: ingredientsDB[0].name, grams: 100 });
      saveToStorage(STORAGE_KEYS.recipe, recipeLines);
      renderSimulator();
    };
  }

  const addIngDbBtn = document.getElementById('add-ingredient-db');
  if (addIngDbBtn) {
    addIngDbBtn.onclick = function() {
      ingredientsDB.push({
        name: 'Nouveau ' + (ingredientsDB.length + 1), category: 'Divers',
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

document.addEventListener('DOMContentLoaded', () => {
  setupUI();
  setupActions();
  renderSimulator();
  renderGuides();
  renderIngredientsDB();
});
