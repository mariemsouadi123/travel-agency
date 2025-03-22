import React, { useState, useEffect } from 'react';
import { useParams , useNavigate } from 'react-router-dom';
import { useLazyQuery } from '@apollo/client';
import { GET_HOTELS_BY_PREFERENCES } from '../../graphql/queries';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, 
  CircularProgress, Grid, Card, CardContent, Box 
} from '@mui/material';

const HotelPreferenceForm = () => {
  const { destinationName } = useParams();
  const navigate = useNavigate(); // Ajoutez ce hook

  const [minStars, setMinStars] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [amenities, setAmenities] = useState('');
  const [hotels, setHotels] = useState([]);

  const [fetchHotels, { loading, error }] = useLazyQuery(GET_HOTELS_BY_PREFERENCES, {
    fetchPolicy: 'network-only', 
    onCompleted: (data) => {
      if (data?.getHotelsByDestinationAndPreferences) {
        setHotels(data.getHotelsByDestinationAndPreferences);
      }
    },
  });

  useEffect(() => {
    console.log("Current Destination: ", destinationName);
  }, [destinationName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!destinationName) {
      console.error("Error: destinationName is undefined!");
      return;
    }

    fetchHotels({
      variables: {
        destinationName,
        minStars: minStars ? parseInt(minStars) : null,
        maxPrice: maxPrice ? parseFloat(maxPrice) : null,
        amenities: amenities ? amenities.split(',') : null,
      }
    });
  };

  const handleReservationClick = (hotelId) => {
    navigate(`/reservation/${hotelId}`); // Redirection vers la page de réservation
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/hotel1.avif)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
      }}
    >
      <Container maxWidth="md" sx={{ p: 4, bgcolor: 'rgba(255, 255, 255, 0.85)', borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Filter Hotels for {destinationName}
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Minimum Stars" type="number" value={minStars} onChange={(e) => setMinStars(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Maximum Price" type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Amenities (comma-separated)" value={amenities} onChange={(e) => setAmenities(e.target.value)} fullWidth />
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="center">
              <Button type="submit" variant="contained" color="primary" sx={{ px: 4, py: 1.5, fontSize: '1rem' }}>
                Search Hotels
              </Button>
            </Grid>
          </Grid>
        </Box>

        {loading && <Box display="flex" justifyContent="center" mt={3}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" mt={2}>{error.message}</Typography>}

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {hotels.length > 0 ? (
            hotels.map((hotel) => (
              <Grid item xs={12} sm={6} md={4} key={hotel.id}>
                <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>{hotel.name}</Typography>
                    <Typography>City: {hotel.city}</Typography>
                    <Typography>Price: <b>${hotel.price}</b></Typography>
                    <Typography>Stars: ⭐ {hotel.stars}</Typography>
                    <Typography>Amenities: {hotel.amenities.join(', ')}</Typography>
                    <Button 
    variant="contained" 
    color="secondary" 
    sx={{ mt: 2 }} 
    fullWidth 
    onClick={() => handleReservationClick(hotel.id)}
  >
    Make Reservation
  </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            !loading && <Typography align="center" mt={3} color="textSecondary">No hotels found.</Typography>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default HotelPreferenceForm;