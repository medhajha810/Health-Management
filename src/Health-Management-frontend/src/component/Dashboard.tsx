import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Avatar,
  Alert,
  Fade,
  Fab,
  Tooltip,
  Zoom
} from '@mui/material';
import { useAuth } from '../App';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useUser } from './UserContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const { currentProfile } = useUser();
  const abhaLinked = currentProfile?.abhaId && currentProfile?.abhaCardLinked;

  const cardStyle = {
    transition: 'transform 0.3s, box-shadow 0.3s',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    },
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 3,
    overflow: 'hidden',
  };

  const buttonStyle = {
    textTransform: 'none',
    fontWeight: 'bold',
    py: 1,
    borderRadius: 2,
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    },
  };

  const handleDiseasePrediction = () => {
    window.open('https://schandel08-app.hf.space', '_blank');
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          backgroundImage: 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
          color: 'white',
          p: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.2 }}>
          <HealthAndSafetyIcon sx={{ fontSize: 160 }} />
        </Box>
        <Typography variant="h3" gutterBottom fontWeight="bold">
          Welcome to Your Health Hub
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: '70%', mb: 3 }}>
          Manage your health records securely in one place
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            color="warning"
            size="large"
            sx={{
              ...buttonStyle,
              backgroundColor: 'white',
              color: '#1976d2',
              px: 3
            }}
            onClick={() => navigate('/records/new')}
            endIcon={<AddCircleIcon />}
          >
            Create New Record
          </Button>
          
          <Fade in={true} style={{ transitionDelay: '300ms' }}>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                ...buttonStyle,
                backgroundColor: '#9c27b0',
                color: 'white',
                px: 3,
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.4)',
                }
              }}
              onClick={handleDiseasePrediction}
              endIcon={<MonitorHeartIcon />}
            >
              Try Disease Prediction
            </Button>
          </Fade>
        </Box>
      </Paper>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: '#1976d2' }}>
        Quick Access
      </Typography>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardMedia
              component="div"
              sx={{
                backgroundColor: '#bbdefb',
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MedicalInformationIcon sx={{ fontSize: 80, color: '#1976d2' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Health Records
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                View and manage your complete medical history, including test results, 
                prescriptions, and diagnoses.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => navigate('/records')}
                sx={buttonStyle}
                endIcon={<ArrowForwardIcon />}
              >
                View Records
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardMedia
              component="div"
              sx={{
                backgroundColor: '#c8e6c9',
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AddCircleIcon sx={{ fontSize: 80, color: '#388e3c' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Add New Record
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Create and store new health records with the ability to upload 
                documents, images, and other attachments.
              </Typography>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={() => navigate('/records/new')}
                sx={buttonStyle}
                endIcon={<ArrowForwardIcon />}
              >
                Add Record
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardMedia
              component="div"
              sx={{
                backgroundColor: '#f3e5f5',
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <MonitorHeartIcon sx={{ fontSize: 80, color: '#9c27b0' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Disease Prediction
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Try our AI-powered disease prediction assistant to analyze your symptoms and get possible diagnoses.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  bgcolor: '#9c27b0',
                  '&:hover': {
                    bgcolor: '#7b1fa2',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
                fullWidth
                onClick={handleDiseasePrediction}
                endIcon={<ArrowForwardIcon />}
              >
                Try Assistant
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={cardStyle}>
            <CardMedia
              component="div"
              sx={{
                backgroundColor: '#e1bee7',
                height: 140,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <PersonIcon sx={{ fontSize: 80, color: '#7b1fa2' }} />
            </CardMedia>
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Profile Settings
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Update your personal information, privacy settings, and manage your 
                account preferences.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  bgcolor: '#7b1fa2',
                  '&:hover': {
                    bgcolor: '#6a1b9a',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  }
                }}
                fullWidth
                onClick={() => navigate('/profile')}
                endIcon={<ArrowForwardIcon />}
              >
                Manage Profile
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Disease Prediction Assistant Banner */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          overflow: 'hidden',
          border: '1px solid #f3e5f5',
          background: 'linear-gradient(135deg, #e1bee7 0%, #f3e5f5 100%)',
          boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: '0 8px 30px rgba(156, 39, 176, 0.25)',
            transform: 'translateY(-4px)',
          }
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5} 
            sx={{ 
              bgcolor: '#9c27b0', 
              backgroundImage: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
              p: { xs: 3, md: 4 },
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }}>
              <MonitorHeartIcon sx={{ fontSize: 160 }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                AI Disease Prediction
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '90%' }}>
                Get instant AI-powered analysis of your symptoms and discover possible conditions that match your health situation.
              </Typography>
              <Button
                variant="contained"
                sx={{
                  ...buttonStyle,
                  bgcolor: 'white',
                  color: '#9c27b0',
                  '&:hover': {
                    bgcolor: 'white',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }
                }}
                onClick={handleDiseasePrediction}
              >
                Try Disease Prediction Assistant
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <Box p={4}>
              <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                How It Works
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: '#9c27b0', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  1
                </Box>
                <Typography variant="body1">Enter your symptoms in our advanced AI tool</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: '#9c27b0', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  2
                </Box>
                <Typography variant="body1">Get instant analysis and potential diagnoses</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 24, 
                  height: 24, 
                  borderRadius: '50%', 
                  bgcolor: '#9c27b0', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  3
                </Box>
                <Typography variant="body1">Share results with your healthcare provider</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 2 }}>
                Note: This tool provides information for educational purposes only and does not replace professional medical advice.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* ABHA Integration Section */}
      <Paper 
        elevation={0} 
        sx={{ 
          mb: 4, 
          borderRadius: 3, 
          overflow: 'hidden',
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.3s',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)',
          }
        }}
      >
        <Grid container>
          <Grid item xs={12} md={5} 
            sx={{ 
              bgcolor: '#4caf50', 
              backgroundImage: 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)',
              p: { xs: 3, md: 4 },
              color: 'white',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }}>
              <HealthAndSafetyIcon sx={{ fontSize: 160 }} />
            </Box>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" gutterBottom fontWeight="bold">
                ABHA Card Integration
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '90%' }}>
                Link your Ayushman Bharat Health Account (ABHA) to access your health records from the National Digital Health ecosystem.
              </Typography>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: { xs: 'column', sm: 'row' }, 
                  gap: 2 
                }}
              >
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    ...buttonStyle,
                    backgroundColor: 'white',
                    color: '#4caf50',
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }
                  }}
                  onClick={() => navigate('/profile')}
                >
                  {abhaLinked ? 'Manage ABHA ID' : 'Link Your ABHA ID'}
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    ...buttonStyle,
                    borderColor: 'white',
                    color: 'white',
                    px: 3,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    }
                  }}
                  href="https://abha.abdm.gov.in/abha/v3/" 
                  target="_blank"
                >
                  Learn More
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={7} sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h5" gutterBottom fontWeight="bold" color="primary.main">
              Benefits of ABHA Integration
            </Typography>
            <Grid container spacing={2} mt={1}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50', mr: 2 }}>1</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Unified Health Record
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Access all your health records across healthcare providers in one place.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50', mr: 2 }}>2</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Easy Sharing
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Share your health records with healthcare providers seamlessly.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50', mr: 2 }}>3</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Secure & Private
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your data is encrypted and secure with consent-based sharing.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" sx={{ mb: 2 }}>
                  <Avatar sx={{ bgcolor: '#e8f5e9', color: '#4caf50', mr: 2 }}>4</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Portable Healthcare
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Carry your health history with you wherever you go.
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            {abhaLinked && (
              <Alert 
                severity="success" 
                icon={<QrCode2Icon fontSize="inherit" />}
                sx={{ mt: 2 }}
              >
                Your ABHA ID (<b>{currentProfile.abhaId}</b>) is linked. Go to profile to manage your ABHA settings.
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>

      <Box 
        sx={{ 
          borderRadius: 3, 
          bgcolor: '#f5f5f5', 
          p: 3, 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: {xs: 'wrap', md: 'nowrap'},
          gap: 2
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 50, height: 50 }}>
            <HealthAndSafetyIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight="bold" color="text.primary">Need assistance?</Typography>
            <Typography variant="body2" color="text.primary">
              Contact our support team for help with your account or health records
            </Typography>
          </Box>
        </Box>
        <Button 
          variant="outlined" 
          color="primary"
          onClick={() => navigate('/contact')}
          sx={{ 
            ...buttonStyle,
            px: 3,
            whiteSpace: 'nowrap'
          }}
        >
          Contact Support
        </Button>
      </Box>

      {/* Disease Prediction Floating Action Button */}
      <Zoom in={true} style={{ transitionDelay: '500ms' }}>
        <Tooltip title="Try Disease Prediction Assistant" placement="left">
          <Fab
            color="secondary"
            aria-label="disease prediction"
            onClick={handleDiseasePrediction}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(156, 39, 176, 0.6)',
              }
            }}
          >
            <MonitorHeartIcon />
          </Fab>
        </Tooltip>
      </Zoom>
    </Container>
  );
};

export default Dashboard; 