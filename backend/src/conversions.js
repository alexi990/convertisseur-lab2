'use strict';

/**
 * Definition des categories de conversion.
 *
 * Pour les categories "lineaires" (longueur, volume, masse), chaque unite est
 * definie par un facteur permettant de la convertir vers une unite de base :
 *   valeurEnBase = valeur * facteur
 *   valeurCible  = valeurEnBase / facteurCible
 *
 * La temperature est traitee separement car la conversion n'est pas lineaire
 * (decalage d'origine entre les echelles).
 */

const categories = {
  longueur: {
    label: 'Longueur',
    base: 'metre',
    units: {
      millimetre: { label: 'Millimetre (mm)', factor: 0.001 },
      centimetre: { label: 'Centimetre (cm)', factor: 0.01 },
      metre: { label: 'Metre (m)', factor: 1 },
      kilometre: { label: 'Kilometre (km)', factor: 1000 },
      pouce: { label: 'Pouce (in)', factor: 0.0254 },
      pied: { label: 'Pied (ft)', factor: 0.3048 },
      yard: { label: 'Yard (yd)', factor: 0.9144 },
      mille: { label: 'Mille terrestre (mi)', factor: 1609.344 },
    },
  },

  volume: {
    label: 'Volume',
    base: 'litre',
    units: {
      millilitre: { label: 'Millilitre (ml)', factor: 0.001 },
      litre: { label: 'Litre (L)', factor: 1 },
      metreCube: { label: 'Metre cube (m3)', factor: 1000 },
      tasse: { label: 'Tasse metrique (250 ml)', factor: 0.25 },
      pinteUS: { label: 'Pinte US (pt)', factor: 0.473176473 },
      gallonUS: { label: 'Gallon US (gal)', factor: 3.785411784 },
      gallonImp: { label: 'Gallon imperial (gal imp)', factor: 4.54609 },
    },
  },

  masse: {
    label: 'Masse',
    base: 'kilogramme',
    units: {
      milligramme: { label: 'Milligramme (mg)', factor: 0.000001 },
      gramme: { label: 'Gramme (g)', factor: 0.001 },
      kilogramme: { label: 'Kilogramme (kg)', factor: 1 },
      tonne: { label: 'Tonne (t)', factor: 1000 },
      once: { label: 'Once (oz)', factor: 0.028349523125 },
      livre: { label: 'Livre (lb)', factor: 0.45359237 },
    },
  },

  temperature: {
    label: 'Temperature',
    base: 'celsius',
    units: {
      celsius: { label: 'Celsius (C)' },
      fahrenheit: { label: 'Fahrenheit (F)' },
      kelvin: { label: 'Kelvin (K)' },
    },
  },

  vitesse: {
    label: 'Vitesse',
    base: 'metreParSeconde',
    units: {
      metreParSeconde: { label: 'Metre par seconde (m/s)', factor: 1 },
      kilometreParHeure: { label: 'Kilometre par heure (km/h)', factor: 1 / 3.6 },
      milleParHeure: { label: 'Mille par heure (mph)', factor: 0.44704 },
      noeud: { label: 'Noeud (kn)', factor: 0.514444444 },
    },
  },
};

function toCelsius(value, unit) {
  switch (unit) {
    case 'celsius':
      return value;
    case 'fahrenheit':
      return (value - 32) * (5 / 9);
    case 'kelvin':
      return value - 273.15;
    default:
      throw new Error(`Unite de temperature inconnue : ${unit}`);
  }
}

function fromCelsius(value, unit) {
  switch (unit) {
    case 'celsius':
      return value;
    case 'fahrenheit':
      return value * (9 / 5) + 32;
    case 'kelvin':
      return value + 273.15;
    default:
      throw new Error(`Unite de temperature inconnue : ${unit}`);
  }
}

/**
 * Convertit une valeur d'une unite vers une autre a l'interieur d'une categorie.
 * Leve une Error avec un message clair si les parametres sont invalides.
 */
function convert({ category, from, to, value }) {
  const cat = categories[category];
  if (!cat) {
    throw new Error(`Categorie inconnue : ${category}`);
  }
  if (!cat.units[from]) {
    throw new Error(`Unite de depart inconnue pour ${category} : ${from}`);
  }
  if (!cat.units[to]) {
    throw new Error(`Unite d'arrivee inconnue pour ${category} : ${to}`);
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    throw new Error(`La valeur a convertir doit etre un nombre : ${value}`);
  }

  if (category === 'temperature') {
    const celsius = toCelsius(numericValue, from);
    return fromCelsius(celsius, to);
  }

  const valueInBase = numericValue * cat.units[from].factor;
  return valueInBase / cat.units[to].factor;
}

/**
 * Retourne la liste des categories et de leurs unites, sans les facteurs
 * internes, pour alimenter le frontend.
 */
function listCategories() {
  return Object.entries(categories).map(([key, cat]) => ({
    key,
    label: cat.label,
    base: cat.base,
    units: Object.entries(cat.units).map(([unitKey, unit]) => ({
      key: unitKey,
      label: unit.label,
    })),
  }));
}

module.exports = { categories, convert, listCategories };
