import { Button, Container, Typography, Box, useScrollTrigger, Fab, Fade } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DestinationsGrid from './DestinationsGrid';
import ContactSection from './ContactSection';

const HeroSection = () => {
  const scrollToDestinations = () => {
    const destinationsSection = document.getElementById('destinations');
    destinationsSection.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Box sx={{
      backgroundImage: 'url("/Travel1.webp")',
      minHeight: '100vh',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // background: 'linear-gradient(45deg, #2d3436aa, #0984e3aa)',
        zIndex: 1
      }
    }}>
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        <Typography variant="h1" gutterBottom sx={{
          fontWeight: 900,
          fontSize: { xs: '2.5rem', md: '4rem' },
          textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          animation: 'fadeInUp 1s ease-out'
        }}>
          Discover Your Next Adventure
        </Typography>
        
        <Typography variant="h5" sx={{
          mb: 4,
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          animation: 'fadeInUp 1s ease-out 0.2s',
          animationFillMode: 'backwards'
        }}>
          Explore the world's most breathtaking destinations
        </Typography>

        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            borderRadius: '50px',
            transition: 'all 0.3s',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }
          }}
          onClick={scrollToDestinations}
        >
          Explore Destinations
        </Button>
      </Container>
    </Box>
  );
};

const ScrollTop = ({ children }) => {
  const trigger = useScrollTrigger({ threshold: 100 });

  return (
    <Fade in={trigger}>
      <Box
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        role="presentation"
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        {children}
      </Box>
    </Fade>
  );
};

const HomePage = () => {
  return (
    <Box sx={{
      '@global': {
        '@keyframes fadeInUp': {
          '0%': { opacity: 0, transform: 'translateY(20px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }
    }}>
      <HeroSection />
      
      <Box id="destinations" sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" align="center" sx={{
            mb: 6,
            fontWeight: 700,
            color: 'primary.main',
            position: 'relative',
            '&::after': {
              content: '""',
              display: 'block',
              width: '100px',
              height: '4px',
              bgcolor: 'secondary.main',
              mx: 'auto',
              mt: 2
            }
          }}>
            Popular Destinations
          </Typography>
          <DestinationsGrid />
        </Container>
      </Box>
      <ScrollTop>
        <Fab size="medium" color="secondary" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </Box>
  );
};

export default HomePage;