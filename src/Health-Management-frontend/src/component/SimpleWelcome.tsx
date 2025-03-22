import React from 'react';
import { 
  Container, Typography, Box, Paper, Button, Grid 
} from '@mui/material';
import { 
  HealthAndSafety as HealthIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';

const SimpleWelcome: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          <HealthIcon sx={{ fontSize: 40, verticalAlign: 'middle', mr: 2 }} />
          Health Management System
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
          Your complete solution for healthcare management
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={darkMode ? 4 : 1} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 2,
              backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Health Records
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Access and manage all your medical records in one secure place.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/records')}
            >
              View Records
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={darkMode ? 4 : 1} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 2,
              backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Telehealth Services
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Connect with healthcare professionals from the comfort of your home.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/telehealth')}
            >
              Book Appointment
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={darkMode ? 4 : 1} 
            sx={{ 
              p: 4, 
              height: '100%',
              borderRadius: 2,
              backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
              textAlign: 'center'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Notifications
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Stay updated with appointment reminders and important health alerts.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/notifications')}
            >
              View Notifications
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SimpleWelcome; 