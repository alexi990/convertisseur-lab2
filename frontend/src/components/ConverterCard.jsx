import { useMemo, useState } from 'react';
import Button from '@mui/material/Button';
import CardContent from '@mui/material/CardContent';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { convert } from '../api.js';

const MAX_HISTORIQUE = 5;

export default function ConverterCard({ categories }) {
  const [categoryKey, setCategoryKey] = useState(categories[0].key);
  const category = useMemo(
    () => categories.find((c) => c.key === categoryKey),
    [categories, categoryKey],
  );

  const [fromUnit, setFromUnit] = useState(category.units[0].key);
  const [toUnit, setToUnit] = useState(
    category.units[1] ? category.units[1].key : category.units[0].key,
  );
  const [value, setValue] = useState('1');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [historique, setHistorique] = useState([]);

  // Validation cote client : on evite un aller-retour inutile vers l'API
  // pour des erreurs evidentes (champ vide, valeur negative pour une
  // grandeur qui ne peut pas etre negative). allowNegative vient de l'API
  // (une seule source de verite avec le backend, pas de duplication de regle).
  const valeurVide = value.trim() === '';
  const valeurNegative =
    !category.allowNegative && !valeurVide && Number(value) < 0;
  const inputError = valeurVide
    ? 'La valeur ne peut pas etre vide.'
    : valeurNegative
      ? 'La valeur doit etre positive ou nulle pour cette categorie.'
      : null;

  function handleCategoryChange(event) {
    const newKey = event.target.value;
    const newCategory = categories.find((c) => c.key === newKey);
    setCategoryKey(newKey);
    setFromUnit(newCategory.units[0].key);
    setToUnit(
      newCategory.units[1] ? newCategory.units[1].key : newCategory.units[0].key,
    );
    setResult(null);
    setError(null);
  }

  function handleSwap() {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setResult(null);
    setError(null);
  }

  async function handleConvert(event) {
    event.preventDefault();
    setError(null);

    if (inputError) {
      setResult(null);
      setError(inputError);
      return;
    }

    try {
      const data = await convert({
        category: categoryKey,
        from: fromUnit,
        to: toUnit,
        value,
      });
      setResult(data.result);

      const ligne = `${data.value} ${fromLabel} = ${formatResult(data.result)} ${toLabel}`;
      setHistorique((prev) => [
        { id: Date.now(), texte: ligne },
        ...prev,
      ].slice(0, MAX_HISTORIQUE));
    } catch (err) {
      setResult(null);
      setError(err.message);
    }
  }

  function handleClearHistorique() {
    setHistorique([]);
  }

  const fromLabel = category.units.find((u) => u.key === fromUnit)?.label ?? '';
  const toLabel = category.units.find((u) => u.key === toUnit)?.label ?? '';

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
      <CardContent component="form" onSubmit={handleConvert} sx={{ p: 0 }}>
        <Stack spacing={3}>
          <TextField
            select
            label="Categorie"
            value={categoryKey}
            onChange={handleCategoryChange}
            fullWidth
          >
            {categories.map((c) => (
              <MenuItem key={c.key} value={c.key}>
                {c.label}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Valeur a convertir"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            inputProps={{ step: 'any' }}
            error={Boolean(inputError)}
            helperText={inputError ?? ' '}
          />

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="center"
          >
            <TextField
              select
              label="De"
              value={fromUnit}
              onChange={(e) => {
                setFromUnit(e.target.value);
                setResult(null);
              }}
              fullWidth
            >
              {category.units.map((u) => (
                <MenuItem key={u.key} value={u.key}>
                  {u.label}
                </MenuItem>
              ))}
            </TextField>

            <IconButton
              onClick={handleSwap}
              color="primary"
              aria-label="Inverser les unites"
            >
              <SwapHorizIcon />
            </IconButton>

            <TextField
              select
              label="Vers"
              value={toUnit}
              onChange={(e) => {
                setToUnit(e.target.value);
                setResult(null);
              }}
              fullWidth
            >
              {category.units.map((u) => (
                <MenuItem key={u.key} value={u.key}>
                  {u.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={Boolean(inputError)}
          >
            Convertir
          </Button>

          {result !== null && !error && (
            <Alert severity="success" icon={false}>
              <Typography variant="h6" component="p">
                {value} {fromLabel} = {formatResult(result)} {toLabel}
              </Typography>
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {historique.length > 0 && (
            <Box>
              <Divider sx={{ mb: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="subtitle2" color="text.secondary">
                  Historique ({historique.length})
                </Typography>
                <Button size="small" onClick={handleClearHistorique}>
                  Effacer
                </Button>
              </Stack>
              <List dense>
                {historique.map((h) => (
                  <ListItem key={h.id} disableGutters>
                    <ListItemText primary={h.texte} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Paper>
  );
}

function formatResult(n) {
  if (!Number.isFinite(n)) return String(n);
  // Affichage lisible : jusqu'a 6 decimales significatives, sans zeros inutiles.
  return Number(n.toPrecision(8)).toString();
}
