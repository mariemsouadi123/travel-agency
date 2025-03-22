import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Typography, TextField, Button, 
  CircularProgress, Card, Grid, Box, InputAdornment
} from "@mui/material";
import { CreditCard, CalendarToday, Lock, ErrorOutline, CheckCircle } from "@mui/icons-material";
import { motion } from "framer-motion";
import { keyframes } from "@emotion/react";

// Animation du fond
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const floatingAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const PaymentForm = () => {
  const { reservationId } = useParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const soapRequest = `
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                        xmlns:pay="http://travel.com/payment">
        <soapenv:Header/>
        <soapenv:Body>
          <pay:PaymentRequest>
            <pay:reservationId>${reservationId}</pay:reservationId>
            <pay:cardNumber>${paymentInfo.cardNumber}</pay:cardNumber>
            <pay:expiryDate>${paymentInfo.expiryDate}</pay:expiryDate>
            <pay:cvv>${paymentInfo.cvv}</pay:cvv>
          </pay:PaymentRequest>
        </soapenv:Body>
      </soapenv:Envelope>
    `;

    try {
      const response = await axios.post("http://localhost:8080/ws", soapRequest, {
        headers: {
          "Content-Type": "text/xml",
          SOAPAction: "http://travel.com/payment/PaymentRequest",
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const successNode = xmlDoc.getElementsByTagName("ns2:success")[0] || xmlDoc.getElementsByTagName("success")[0];

      if (successNode?.textContent.trim() === "true") {
        setSuccess(true);
        setTimeout(() => navigate("/"), 3000);
      } else {
        throw new Error("Payment processing failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      setError(error.message || "Payment processing failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(-45deg, #2e7d32, #388e3c, #43a047, #4caf50, #66bb6a)',
      backgroundSize: '400% 400%',
      animation: `${gradientAnimation} 15s ease infinite`,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        width: '200%',
        height: '200%',
        background: `linear-gradient(
          45deg,
          rgba(255,255,255,0.1) 25%,
          transparent 25%,
          transparent 50%,
          rgba(255,255,255,0.1) 50%,
          rgba(255,255,255,0.1) 75%,
          transparent 75%,
          transparent
        )`,
        backgroundSize: '50px 50px',
        animation: `${floatingAnimation} 20s linear infinite`,
        transform: 'rotate(15deg)'
      }
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card sx={{ 
          p: 4, 
          borderRadius: 4,
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          width: '90vw',
          maxWidth: 600,
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          position: 'relative'
        }}>
          {/* Effet de particules */}
          <Box sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='5' fill='%232e7d3255'/%3E%3Ccircle cx='150' cy='250' r='3' fill='%232e7d3233'/%3E%3Ccircle cx='350' cy='450' r='7' fill='%232e7d3222'/%3E%3C/svg%3E")`,
            opacity: 0.3,
            pointerEvents: 'none'
          }} />

          <Typography variant="h4" 
            gutterBottom 
            align="center" 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: 'Montserrat, sans-serif',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}>
            Payment Details
          </Typography>

          {success ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Box sx={{ 
                textAlign: 'center', 
                p: 4,
                background: 'rgba(232, 245, 233, 0.9)',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(46,125,50,0.2)'
              }}>
                <CheckCircle sx={{ 
                  fontSize: 60, 
                  color: '#2e7d32', 
                  mb: 2,
                  animation: `${floatingAnimation} 3s ease-in-out infinite` 
                }} />
                <Typography variant="h5" color="success.main" gutterBottom>
                  Payment Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Redirecting to homepage...
                </Typography>
              </Box>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <TextField
                      fullWidth
                      label="Card Number"
                      required
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CreditCard sx={{ 
                              color: '#2e7d32',
                              transition: 'transform 0.3s',
                              '&:hover': { transform: 'rotateY(180deg)' }
                            }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          transition: 'all 0.3s ease',
                          '&.Mui-focused fieldset': {
                            borderColor: '#2e7d32',
                            boxShadow: '0 0 0 3px rgba(46,125,50,0.2)'
                          },
                        }
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <TextField
                      fullWidth
                      label="Expiry Date (MM/YY)"
                      required
                      value={paymentInfo.expiryDate}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarToday sx={{ 
                              color: '#2e7d32',
                              transition: 'transform 0.3s',
                              '&:hover': { transform: 'scale(1.2)' }
                            }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </motion.div>
                </Grid>

                <Grid item xs={12} md={6}>
                  <motion.div whileHover={{ scale: 1.02 }}>
                    <TextField
                      fullWidth
                      label="CVV"
                      required
                      type="password"
                      value={paymentInfo.cvv}
                      onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock sx={{ 
                              color: '#2e7d32',
                              transition: 'transform 0.3s',
                              '&:hover': { transform: 'scale(1.2)' }
                            }} />
                          </InputAdornment>
                        ),
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
                        background: 'linear-gradient(45deg, #1b5e20, #2e7d32)',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 15px rgba(27,94,32,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: '-50%',
                          left: '-50%',
                          width: '200%',
                          height: '200%',
                          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
                          transform: 'rotate(45deg)',
                          transition: 'all 0.5s'
                        },
                        '&:hover::before': {
                          left: '150%'
                        }
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: 'white' }} />
                      ) : (
                        'Process Payment'
                      )}
                    </Button>
                  </motion.div>
                </Grid>

                {error && (
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 2,
                        borderRadius: 2,
                        background: 'rgba(255, 235, 238, 0.9)',
                        border: '1px solid #d32f2f',
                        backdropFilter: 'blur(4px)'
                      }}>
                        <ErrorOutline sx={{ 
                          color: '#d32f2f', 
                          mr: 1,
                          animation: `${floatingAnimation} 1s ease infinite` 
                        }} />
                        <Typography 
                          color="error" 
                          sx={{ fontWeight: 500 }}
                        >
                          {error}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                )}
              </Grid>
            </form>
          )}
        </Card>
      </motion.div>
    </Box>
  );
};

export default PaymentForm;