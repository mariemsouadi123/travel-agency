import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, 
  CircularProgress, Card, Grid, Box, InputAdornment
} from '@mui/material';
import { DateRange, ErrorOutline } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';

// Animations
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const shakeAnimation = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(10px); }
  50% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
  100% { transform: translateX(0); }
`;

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
      const userId = 2;

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
      const reservationIdNode = xmlDoc.getElementsByTagNameNS("http://travel.com/reservation", "reservationId")[0];

      const status = statusNode?.textContent || "FAILED";
      if (status === "PENDING" || status === "SUCCESS") {
        if (reservationIdNode) {
          const reservationId = reservationIdNode.textContent;
          navigate(`/payment/${reservationId}`);
        } else {
          throw new Error("Reservation ID not found in the response.");
        }
      } else {
        throw new Error("An error occurred while processing your reservation.");
      }
    } catch (error) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container 
      maxWidth={false} 
      disableGutters 
      sx={{
        minHeight: '100vh',
        width: '100%',
        background: 'linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)',
        backgroundSize: '400% 400%',
        animation: `${gradientAnimation} 15s ease infinite`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 0
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 4,
          boxShadow: 6,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          width: '100%',
          maxWidth: 600,
          mx: 2
        }}>
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Typography 
              variant="h4" 
              align="center" 
              sx={{ 
                fontWeight: 700,
                mb: 4,
                background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontFamily: 'Montserrat, sans-serif'
              }}
            >
              Réservez votre séjour
            </Typography>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <TextField
                    fullWidth
                    label="Date d'arrivée"
                    type="date"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={dates.checkIn}
                    onChange={(e) => setDates({...dates, checkIn: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange sx={{ color: '#2196F3' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196F3',
                          boxShadow: '0 0 0 3px rgba(33,150,243,0.2)'
                        },
                      }
                    }}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <TextField
                    fullWidth
                    label="Date de départ"
                    type="date"
                    required
                    InputLabelProps={{ shrink: true }}
                    value={dates.checkOut}
                    onChange={(e) => setDates({...dates, checkOut: e.target.value})}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DateRange sx={{ color: '#2196F3' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196F3',
                          boxShadow: '0 0 0 3px rgba(33,150,243,0.2)'
                        },
                      }
                    }}
                  />
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    variant="contained" 
                    fullWidth
                    disabled={loading}
                    sx={{ 
                      py: 2,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      background: 'linear-gradient(45deg, #2196F3, #21CBF3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 15px rgba(33,150,243,0.4)'
                      }
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: 'white' }} />
                    ) : (
                      'Confirmer la réservation'
                    )}
                  </Button>
                </motion.div>
              </Grid>

              <AnimatePresence>
                {error && (
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Box 
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          p: 2, 
                          borderRadius: 2, 
                          background: '#ffeeee', 
                          border: '1px solid #ff4444',
                          animation: `${shakeAnimation} 0.4s ease`
                        }}
                      >
                        <ErrorOutline sx={{ color: '#ff4444', mr: 1 }} />
                        <Typography color="error" sx={{ fontWeight: 500 }}>
                          {error}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                )}
              </AnimatePresence>
            </Grid>
          </form>
        </Card>
      </motion.div>
    </Container>
  );
};

export default ReservationForm;