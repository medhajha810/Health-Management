import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Divider,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  CardHeader
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import HelpIcon from '@mui/icons-material/Help';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useTheme } from './ThemeContext';

const Contact: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const { darkMode } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend
    console.log('Form data:', formData);
    setSnackbarOpen(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  const cardStyle = {
    height: '100%',
    borderRadius: 2,
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          Contact Support
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            py: 1
          }}
        >
          Home
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 3, 
              overflow: 'hidden',
              backgroundImage: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
              color: 'white',
              p: 4,
              mb: 4,
              position: 'relative'
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                24/7 Support
              </Typography>
              <Typography variant="body1">
                Our support team is available around the clock to assist you with any issues 
                or questions you might have about your health records.
              </Typography>
            </Box>

            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)', my: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PhoneIcon sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Helpline Number
                    </Typography>
                    <Typography variant="body1">
                      +91 895 021 4195
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WhatsAppIcon sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      WhatsApp Support
                    </Typography>
                    <Typography variant="body1">
                      +91 870 968 4588
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <EmailIcon sx={{ mr: 2 }} />
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Email Support
                    </Typography>
                    <Typography variant="body1">
                      medhajha810@gmail.com
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SupportAgentIcon sx={{ mr: 1, color: '#1976d2', fontSize: 32 }} />
                    <Typography variant="h6" fontWeight="bold">Live Chat</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Chat with our support team in real-time through our live chat feature.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                  >
                    Start Chat
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <HelpIcon sx={{ mr: 1, color: '#ff9800', fontSize: 32 }} />
                    <Typography variant="h6" fontWeight="bold">FAQs</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Find answers to commonly asked questions about our services.
                  </Typography>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold'
                    }}
                    onClick={() => navigate('/records/faq')}
                  >
                    View FAQs
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12}>
              <Card sx={cardStyle}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, color: '#4caf50', fontSize: 32 }} />
                    <Typography variant="h6" fontWeight="bold">Visit Us</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Lovely Professional University<br />
                    Grand Trunk Road, Phagwara<br />
                    Punjab, 144411
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Hours:</strong> Monday - Friday: 9 AM - 6 PM
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              borderRadius: 3,
              height: '100%',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h5" fontWeight="bold" gutterBottom color="primary.main">
              Send Us a Message
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Fill out the form below and our team will get back to you as soon as possible.
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Message"
                    name="message"
                    multiline
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      mb: 2,
                      py: 1.5,
                      backgroundImage: darkMode 
                        ? 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)' 
                        : 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      color: '#ffffff',
                      fontWeight: 'bold',
                      borderRadius: 8,
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
                      '&:hover': {
                        boxShadow: '0 6px 25px rgba(33, 150, 243, 0.6)',
                      }
                    }}
                  >
                    Send Message
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled">
          Your message has been sent! We'll get back to you soon.
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Contact; 