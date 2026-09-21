'use strict';

const express = require('express');
const cors = require('cors');
const { convert, listCategories } = require('./conversions');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Journalisation : date ISO, methode et URL de chaque requete.
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
});

// Verification de sante (utile pour les tests et le debogage).
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
});

// Liste des categories et unites disponibles.
app.get('/api/categories', (req, res) => {
  res.json(listCategories());
});

// Conversion : { category, from, to, value } -> { result }
app.post('/api/convert', (req, res) => {
  const { category, from, to, value } = req.body || {};

  if (
    category == null ||
    from == null ||
    to == null ||
    value == null ||
    value === ''
  ) {
    return res.status(400).json({
      error: 'Les champs category, from, to et value sont obligatoires.',
    });
  }

  try {
    const result = convert({ category, from, to, value });
    return res.json({ category, from, to, value: Number(value), result });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API de conversion demarree sur http://localhost:${PORT}`);
});

module.exports = app;
