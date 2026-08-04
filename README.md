# Simulateur de Recettes Ninja Creami

Outil web de simulation et calcul de ratios pour recettes Ninja Creami. Permet de calculer les ratios optimaux entre fruits frais, produits laitiers et agents sucrants, d'ajuster la texture selon la teneur en matières grasses, et de suivre les résultats après chaque re-spin.

## Fonctionnalités

- **Simulateur**: saisie d'ingrédients avec calcul automatique des ratios, composition nutritionnelle, et recommandations de mode
- **Guide texture**: tableau de dépannage pour 7 problèmes courants + 10 conseils pro sur l'équilibre eau/sucre/MG/extrait sec
- **Modes**: comparatif des 5 modes Creami (Lite Ice Cream, Ice Cream, Sorbet, Frozen Yogurt, Gelato) + procédure standard en 9 étapes
- **Journal**: suivi des essais avec scores (1-5), statistiques automatiques, export/import JSON
- **Base d'ingrédients**: 24 ingrédients pré-configurés avec valeurs nutritionnelles modifiables (CIQUAL/ANSES, USDA)

## Déploiement sur GitHub Pages

1. Créez un nouveau dépôt sur GitHub
2. Copiez les fichiers `index.html`, `styles.css`, `app.js` et `README.md` à la racine
3. Allez dans **Settings > Pages**
4. Dans **Source**, sélectionnez la branche `main` et le dossier `/root`
5. Cliquez sur **Save** — votre application sera disponible à l'adresse `https://votre-utilisateur.github.io/votre-depot/`

## Développement local

Aucune installation requise. Ouvrez simplement `index.html` dans un navigateur, ou servez le dossier avec:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx)
npx serve
```

Puis ouvrez `http://localhost:8000` dans votre navigateur.

## Technologies

- HTML5, CSS3, JavaScript vanilla (aucune dépendance, aucun build)
- Persistance via `localStorage`
- Design responsive avec mode sombre
- Sources nutritionnelles: [CIQUAL/ANSES](https://ciqual.anses.fr/), [USDA FoodData Central](https://fdc.nal.usda.gov/)
