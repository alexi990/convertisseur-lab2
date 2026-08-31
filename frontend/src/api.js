// Petit client pour l'API de conversion.

export async function fetchCategories() {
  const res = await fetch('/api/categories');
  if (!res.ok) {
    throw new Error('Impossible de charger les categories.');
  }
  return res.json();
}

export async function convert({ category, from, to, value }) {
  const res = await fetch('/api/convert', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ category, from, to, value }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Erreur lors de la conversion.');
  }
  return data;
}
