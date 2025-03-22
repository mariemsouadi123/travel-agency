import { 
    Box, 
    Container, 
    Typography, 
    List, 
    ListItem, 
    ListItemIcon, 
    ListItemText,
    Divider,
    Link,
    Chip,
    Grid
  } from '@mui/material';
  import { 
    Phone, 
    Email, 
    LocationOn, 
    Schedule,
    Facebook,
    Twitter,
    Instagram 
  } from '@mui/icons-material';
  import { styled } from '@mui/material/styles';
  
  const ContactSection = () => {
    return (
        <Box id="contact" sx={{ 
            py: { xs: 6, md: 8 },
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            color: 'white'
        }}>
            <Container maxWidth="md">
                <Typography 
                    variant="h4" 
                    align="center" 
                    sx={{ mb: 4, fontWeight: 700 }}
                >
                    📍 Contact Information
                </Typography>
  
                <Box sx={{
                    p: { xs: 3, md: 4 },
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)'
                }}>
                    <Box textAlign="center" sx={{ mb: 3 }}>
                        <Chip 
                            label="VoyageEase Travel Agency"
                            color="primary" 
                            sx={{ fontSize: '1.2rem', py: 1.5, px: 3, borderRadius: '25px', bgcolor: 'rgba(255, 255, 255, 0.2)' }}
                        />
                    </Box>
  
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <ListItem>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <LocationOn fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>Our Headquarters</Typography>}
                                    secondary={<Typography variant="body2" color="white">123 Rue des Voyages, 75001 Paris, France</Typography>}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItem>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <Phone fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>+33 1 23 45 67 89</Typography>}
                                    secondary={<Typography variant="body2" color="white">Available 24/7</Typography>}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItem>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <Email fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>contact@voyageease.com</Typography>}
                                    secondary={<Typography variant="body2" color="white">Response within 24 hours</Typography>}
                                />
                            </ListItem>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <ListItem>
                                <ListItemIcon sx={{ color: 'white' }}>
                                    <Schedule fontSize="medium" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={<Typography variant="h6" sx={{ fontWeight: 600 }}>Opening Hours</Typography>}
                                    secondary={
                                        <>
                                            <Typography variant="body2" color="white">Mon-Fri: 9:00 AM - 6:00 PM</Typography>
                                            <Typography variant="body2" color="white">Saturday: 10:00 AM - 4:00 PM</Typography>
                                            <Typography variant="body2" color="white">Sunday: Closed</Typography>
                                        </>
                                    }
                                />
                            </ListItem>
                        </Grid>
                    </Grid>
  
                    <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.3)' }} />
                    <Box textAlign="center">
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Follow Us</Typography>
                        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                            <Link href="#" color="inherit">
                                <Facebook sx={{ fontSize: 36, color: 'white', '&:hover': { color: '#1877f2' } }} />
                            </Link>
                            <Link href="#" color="inherit">
                                <Twitter sx={{ fontSize: 36, color: 'white', '&:hover': { color: '#1da1f2' } }} />
                            </Link>
                            <Link href="#" color="inherit">
                                <Instagram sx={{ fontSize: 36, color: 'white', '&:hover': { color: '#c13584' } }} />
                            </Link>
                        </Box>
                    </Box>
                </Box>
            </Container>
        </Box>
    );
  };
  
  export default ContactSection;