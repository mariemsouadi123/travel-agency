import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Card,
  Box,
  InputAdornment
} from "@mui/material";
import { CreditCard, CalendarToday, Lock, ErrorOutline, CheckCircle } from "@mui/icons-material";

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
    <Container maxWidth="md" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      py: 4
    }}>
      <Card sx={{ 
        p: 4, 
        borderRadius: 4,
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: 600,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <Typography variant="h4" 
          gutterBottom 
          align="center" 
          sx={{ 
            fontWeight: 700,
            mb: 4,
            background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: 'Montserrat, sans-serif'
          }}>
          Payment Details
        </Typography>

        {success ? (
          <Box sx={{ 
            textAlign: 'center', 
            p: 4,
            background: '#e8f5e9',
            borderRadius: 3
          }}>
            <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
            <Typography variant="h5" color="success.main" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Redirecting to homepage...
            </Typography>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Card Number"
                  required
                  value={paymentInfo.cardNumber}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCard sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&.Mui-focused fieldset': {
                        borderColor: '#4caf50',
                      },
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  required
                  value={paymentInfo.expiryDate}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, expiryDate: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarToday sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                        <Lock sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth
                  disabled={loading}
                  sx={{
                    py: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #2e7d32 30%, #4caf50 90%)',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    textTransform: 'none',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 5px 15px rgba(46,125,50,0.3)'
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} sx={{ color: 'white' }} />
                  ) : (
                    'Process Payment'
                  )}
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 2,
                    borderRadius: 2,
                    background: '#ffebee',
                    border: '1px solid #ff4444'
                  }}>
                    <ErrorOutline sx={{ color: 'error.main', mr: 1 }} />
                    <Typography 
                      color="error" 
                      sx={{ fontWeight: 500 }}
                    >
                      {error}
                    </Typography>
                  </Box>
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Card>
    </Container>
  );
};

export default PaymentForm;