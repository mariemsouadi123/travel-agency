import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, 
  CircularProgress, Card, Grid, Box, InputAdornment
} from '@mui/material';
import { DateRange, ErrorOutline } from '@mui/icons-material';

const ReservationForm = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
        const userId = 2; // Static user for now

        const soapRequest = `
          <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" 
                            xmlns:res="http://travel.com/reservation">
            <soapenv:Header/>
            <soapenv:Body>
              <res:MakeReservationRequest>
                <res:hotelId>${hotelId}</res:hotelId>
                <res:userId>${userId}</res:userId>
                <res:checkInDate>${dates.checkIn}</res:checkInDate>
                <res:checkOutDate>${dates.checkOut}</res:checkOutDate>
              </res:MakeReservationRequest>
            </soapenv:Body>
          </soapenv:Envelope>`;

        const response = await axios.post('http://localhost:8080/ws', soapRequest, {
          headers: {
            'Content-Type': 'text/xml',
            'SOAPAction': 'http://travel.com/reservation/MakeReservationRequest'
          }
        });

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(response.data, "text/xml");

        const statusNode = xmlDoc.getElementsByTagNameNS("http://travel.com/reservation", "status")[0];
        const messageNode = xmlDoc.getElementsByTagNameNS("http://travel.com/reservation", "message")[0];
        const reservationIdNode = xmlDoc.getElementsByTagNameNS("http://travel.com/reservation", "reservationId")[0];

        const status = statusNode?.textContent || "FAILED";
        const message = messageNode?.textContent || "Unknown error";

        if (status === "PENDING" || status === "SUCCESS") {
          if (reservationIdNode) {
            const reservationId = reservationIdNode.textContent;
            navigate(`/payment/${reservationId}`);
          } else {
            throw new Error("Reservation ID not found in the response.");
          }
        } else {
          throw new Error(message);
        }

    } catch (error) {
        console.error("Detailed Error:", error);
        setError(error.message || "An error occurred.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ 
      minHeight: '100vh',
      backgroundColor: '#f0f4f8', // Fond uni
      padding: '2rem 0'
    }}>
      <Card sx={{ 
        p: 4, 
        borderRadius: 4,
        boxShadow: 3,
        backgroundColor: 'white'
      }}>
        <Typography variant="h4" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 700,
            color: '#2196F3',
            mb: 4,
            fontFamily: 'Montserrat, sans-serif',
            paddingBottom: 2,
            borderBottom: '2px solid #BBDEFB'
          }}>
          Réservez votre séjour
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Champ Date d'arrivée */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date d'arrivée"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                value={dates.checkIn}
                onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange sx={{ color: '#2196F3' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Champ Date de départ */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date de départ"
                type="date"
                required
                InputLabelProps={{ shrink: true }}
                value={dates.checkOut}
                onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196F3',
                    },
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <DateRange sx={{ color: '#2196F3' }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Bouton de soumission */}
            <Grid item xs={12}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth
                disabled={loading}
                sx={{
                  py: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 5px 15px rgba(33,150,243,0.4)'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Confirmer la réservation'
                )}
              </Button>
            </Grid>

            {/* Affichage des erreurs */}
            {error && (
              <Grid item xs={12}>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: 2,
                  background: '#ffeeee',
                  border: '1px solid #ff4444'
                }}>
                  <ErrorOutline sx={{ color: '#ff4444', mr: 1 }} />
                  <Typography 
                    color="error" 
                    sx={{ 
                      fontWeight: 500,
                      fontSize: '0.9rem'
                    }}
                  >
                    {error}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </form>
      </Card>
    </Container>
  );
};

export default ReservationForm;