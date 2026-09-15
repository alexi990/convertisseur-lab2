# Convertisseur d'unites

Application de conversion d'unites developpee dans le cadre du **Laboratoire 02 -
Exploration de nouvelles technologies**, puis reprise en equipe de deux au
**Laboratoire 03** pour pratiquer Git, GitHub et le travail collaboratif
(branches, pull requests, revue de code).

- **Backend** : Node.js + Express (API REST)
- **Frontend** : React (Vite) + Material UI

Categories supportees : longueur, volume, masse, temperature et vitesse.

## Fonctionnalites ajoutees au Laboratoire 03

- **Validation des donnees** : une valeur vide ou negative est refusee (sauf
  pour la temperature, ou le negatif est valide). L'erreur s'affiche en
  direct sous le champ et le bouton Convertir se desactive tant que la
  valeur est invalide.
- **Categorie vitesse** : conversion entre metre par seconde (m/s),
  kilometre par heure (km/h), mille par heure (mph) et noeud (kn).

## Prerequis

- Node.js 18 ou plus recent (teste avec Node.js 24)
- npm

## Installation

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Demarrage

Ouvrir deux terminaux.

**Terminal 1 - backend (port 4000)**

```bash
cd backend
npm start
```

**Terminal 2 - frontend (port 5173)**

```bash
cd frontend
npm run dev
```

Puis ouvrir http://localhost:5173 dans un navigateur.

En developpement, Vite redirige automatiquement les requetes `/api/*` vers le
backend (`http://localhost:4000`).

## API

| Methode | Route              | Description                                   |
| ------- | ------------------ | --------------------------------------------- |
| GET     | `/api/health`      | Verification de sante                         |
| GET     | `/api/categories`  | Liste des categories et de leurs unites       |
| POST    | `/api/convert`     | Conversion `{ category, from, to, value }`    |

Exemple :

```bash
curl -X POST http://localhost:4000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"category":"longueur","from":"pied","to":"metre","value":10}'
# => {"category":"longueur","from":"pied","to":"metre","value":10,"result":3.048}
```

## Structure

```
convertisseur-lab2/
  backend/
    src/
      server.js        # serveur Express et routes
      conversions.js   # categories, unites et logique de conversion
  frontend/
    src/
      main.jsx
      App.jsx
      api.js
      components/
        ConverterCard.jsx
```
