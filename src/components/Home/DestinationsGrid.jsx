import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Grid, Card, CardContent, CardMedia, Typography, 
  Container, CircularProgress, Box, Chip, Button 
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#2d3436' },
    secondary: { main: '#0984e3' },
  },
});

const getImagePath = (destinationName) => {
  const imageMap = {
    'paris': '/france.jpg',
    'new york': '/newYork.jpg',
    'seoul': '/seoul.jpeg'
  };
  return imageMap[destinationName.toLowerCase()] || '/default.jpg';
};

const DestinationsGrid = () => {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8082/api/destinations')
      .then((response) => {
        setDestinations(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API :", err);
        setError("Erreur lors du chargement des destinations");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center" sx={{ mt: 4, p: 2, backgroundColor: '#ffe6e6', borderRadius: 2 }}>
        ⚠️ {error}
      </Typography>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h2" align="center" gutterBottom sx={{ color: 'primary.main' }}>
          Destinations Populaires
        </Typography>

        <Grid container spacing={4}>
          {destinations.map((destination) => (
            <Grid item xs={12} sm={6} md={4} key={destination.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: 3,
                transition: 'transform 0.3s',
                '&:hover': { transform: 'translateY(-5px)' }
              }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={getImagePath(destination.name)}
                  alt={destination.name}
                  sx={{ borderTopLeftRadius: 3, borderTopRightRadius: 3 }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {destination.name}
                    </Typography>
                    <Chip label={destination.country} color="secondary" sx={{ fontWeight: 600 }} />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {destination.description}
                  </Typography>
                </CardContent>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ m: 2 }} 
                  onClick={() => navigate(`/hotels/preferences/${destination.name}`)}
                >
                  Discover Now
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
};

export default DestinationsGrid;
