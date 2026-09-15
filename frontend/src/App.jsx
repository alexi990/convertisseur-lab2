import { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import ConverterCard from './components/ConverterCard.jsx';
import { fetchCategories } from './api.js';

export default function App() {
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Convertisseur d'unites
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Longueur, volume, masse, temperature et vitesse. Backend Node.js +
          frontend React / Material UI.
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      {!categories && !error && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {categories && <ConverterCard categories={categories} />}

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', mt: 4 }}
      >
        Laboratoire 02 - Exploration de nouvelles technologies
      </Typography>
    </Container>
  );
}
