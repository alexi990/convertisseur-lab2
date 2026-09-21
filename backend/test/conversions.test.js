'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { convert } = require('../src/conversions');

test('10 pieds = 3.048 metres', () => {
  const result = convert({ category: 'longueur', from: 'pied', to: 'metre', value: 10 });
  // Tolerance pour les erreurs d'arrondi des nombres a virgule flottante.
  assert.ok(Math.abs(result - 3.048) < 1e-9);
});

test('0 C = 32 F', () => {
  const result = convert({ category: 'temperature', from: 'celsius', to: 'fahrenheit', value: 0 });
  assert.equal(result, 32);
});

test('une valeur negative est refusee hors temperature', () => {
  assert.throws(
    () => convert({ category: 'masse', from: 'kilogramme', to: 'livre', value: -5 }),
    /positive ou nulle/,
  );
});

test('une valeur non numerique est refusee', () => {
  assert.throws(
    () => convert({ category: 'longueur', from: 'metre', to: 'pied', value: 'abc' }),
    /doit etre un nombre/,
  );
});
