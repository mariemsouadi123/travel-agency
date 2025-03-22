import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HeroSection from './components/Home/HeroSection';
import DestinationsGrid from './components/Home/DestinationsGrid';
import ContactSection from './components/Home/ContactSection';
import HotelPreferencesForm from './components/Hotel/HotelPreferencesForm';
import ReservationForm from './components/Hotel/ReservationForm';
import PaymentForm from './components/Hotel/PaymentForm';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
const client = new ApolloClient({
  uri: 'http://localhost:8081/graphql',
  cache: new InMemoryCache(),
});

const theme = createTheme({
  palette: {
    primary: { main: '#2d3436' },
    secondary: { main: '#0984e3' },
  },
  typography: {
    fontFamily: 'Poppins, Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem' },
  },
});

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <HeroSection />
                  <ContactSection />
                </>
              }
            />
            <Route path="/destinations" element={<DestinationsGrid />} />
            <Route path="/hotels/preferences/:destinationName" element={<HotelPreferencesForm />} />
            <Route path="/reservation/:hotelId" element={<ReservationForm />} />
             <Route path="/payment/:reservationId" element={<PaymentForm />} />  
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
