import test from 'node:test';
import assert from 'node:assert/strict';
import { convert, fetchCategories } from '../src/api.js';

// Remplace fetch par une fausse reponse pour tester le client sans backend.
function mockFetch(status, body) {
  globalThis.fetch = async (url, options) => {
    mockFetch.lastCall = { url, options };
    return { ok: status >= 200 && status < 300, status, json: async () => body };
  };
}

test('convert envoie la requete au backend et retourne le resultat', async () => {
  mockFetch(200, { result: 32 });
  const data = await convert({ category: 'temperature', from: 'celsius', to: 'fahrenheit', value: 0 });

  assert.deepEqual(data, { result: 32 });
  assert.equal(mockFetch.lastCall.url, '/api/convert');
  assert.equal(mockFetch.lastCall.options.method, 'POST');
  assert.deepEqual(JSON.parse(mockFetch.lastCall.options.body), {
    category: 'temperature', from: 'celsius', to: 'fahrenheit', value: 0,
  });
});

test('convert affiche le message d\'erreur du backend', async () => {
  mockFetch(400, { error: 'La valeur doit etre positive.' });
  await assert.rejects(
    convert({ category: 'masse', from: 'kilogramme', to: 'livre', value: -5 }),
    { message: 'La valeur doit etre positive.' },
  );
});

test('convert a un message par defaut si le backend n\'en donne pas', async () => {
  mockFetch(500, {});
  await assert.rejects(
    convert({ category: 'masse', from: 'kilogramme', to: 'livre', value: 1 }),
    { message: 'Erreur lors de la conversion.' },
  );
});

test('fetchCategories echoue avec un message clair', async () => {
  mockFetch(503, {});
  await assert.rejects(fetchCategories(), { message: 'Impossible de charger les categories.' });
});
