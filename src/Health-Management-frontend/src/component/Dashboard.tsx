import React, { useState, useEffect } from 'react';
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
import { SxProps, Theme } from '@mui/material/styles';
import { useAuth } from '../App';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { useUser } from './UserContext';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const { currentProfile } = useUser();
  const abhaLinked = currentProfile?.abhaId && currentProfile?.abhaCardLinked;
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay for smoother transitions
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80 }
    }
  };

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
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '100%',
      background: darkMode 
        ? 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)' 
        : 'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 100%)',
      pointerEvents: 'none',
      zIndex: 1,
      opacity: 0.4
    }
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

  // Add particle animation components
  const ParticleAnimation = () => {
    return (
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden'
      }}>
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            component={motion.div}
            sx={{
              position: 'absolute',
              width: Math.random() * 10 + 5,
              height: Math.random() * 10 + 5,
              borderRadius: '50%',
              background: darkMode 
                ? `rgba(${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, ${Math.random() * 150 + 200}, 0.3)`
                : `rgba(${Math.random() * 50 + 100}, ${Math.random() * 50 + 100}, ${Math.random() * 50 + 200}, 0.2)`,
              filter: 'blur(1px)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, Math.random() * 0.5 + 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </Box>
    );
  };

  return (
    <Container 
      maxWidth="lg" 
      component={motion.div}
      initial="hidden"
      animate={loading ? "hidden" : "visible"}
      variants={containerVariants}
      sx={{ 
        position: 'relative',
        pt: 3,
        pb: 5,
        backgroundImage: darkMode 
          ? 'radial-gradient(circle at 50% 50%, rgba(66, 66, 77, 0.5) 0%, rgba(28, 28, 35, 0) 70%)' 
          : 'radial-gradient(circle at 50% 50%, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0) 70%)',
        backgroundSize: '150% 150%',
        backgroundPosition: 'center center',
        animation: 'gradientAnimation 15s ease infinite',
        '@keyframes gradientAnimation': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' }
        },
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
          opacity: 0.1,
          background: darkMode 
            ? 'url("https://img.freepik.com/free-vector/hexagonal-pattern-technology-background_52683-29680.jpg")' 
            : 'url("https://img.freepik.com/free-vector/abstract-medical-background-with-hexagons-pattern_1017-26363.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: darkMode ? 'invert(1)' : 'none'
        }
      }}
    >
      {/* Loading animation */}
      {loading && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(8px)',
            backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.5)' : 'rgba(255, 255, 255, 0.5)'
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.8, 1, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <HealthAndSafetyIcon 
              sx={{ 
                fontSize: 80, 
                color: darkMode ? '#90caf9' : '#1976d2'
              }} 
            />
          </motion.div>
        </Box>
      )}

      {/* Add particle animation */}
      <ParticleAnimation />
      
      <motion.div variants={itemVariants}>
        <Paper
          elevation={darkMode ? 3 : 0}
          component={motion.div}
          whileHover={{ y: -5 }}
          sx={{
            borderRadius: 3,
            backgroundImage: darkMode 
              ? 'linear-gradient(135deg, #1a2530 0%, #203040 100%)' 
              : 'linear-gradient(135deg, #2196F3 0%, #21CBF3 100%)',
            color: 'white',
            p: 4,
            mb: 4,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box 
            component={motion.div}
            sx={{ position: 'absolute', right: -20, top: -20, opacity: 0.2 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <HealthAndSafetyIcon sx={{ fontSize: 160 }} />
          </Box>
          <Typography variant="h3" gutterBottom fontWeight="bold" color="white">
            Welcome to Your Health Hub
          </Typography>
          <Typography variant="h6" sx={{ maxWidth: '70%', mb: 3, color: 'white' }}>
            Manage your health records securely in one place
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
            </motion.div>
            
            <Fade in={true} style={{ transitionDelay: '300ms' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
              </motion.div>
            </Fade>
          </Box>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3, color: darkMode ? '#90caf9' : '#1976d2' }}>
          Quick Access
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          {
            icon: <MedicalInformationIcon sx={{ fontSize: 80, color: darkMode ? '#90caf9' : '#1976d2' }} />,
            title: "Health Records",
            description: "View and manage your complete medical history, including test results, prescriptions, and diagnoses.",
            buttonText: "View Records",
            buttonColor: "primary",
            bgColor: darkMode ? '#2c3e50' : '#bbdefb',
            onClick: () => navigate('/records')
          },
          {
            icon: <AddCircleIcon sx={{ fontSize: 80, color: darkMode ? '#81c784' : '#388e3c' }} />,
            title: "Add New Record",
            description: "Create and store new health records with the ability to upload documents, images, and other attachments.",
            buttonText: "Add Record",
            buttonColor: "success",
            bgColor: darkMode ? '#2c3e50' : '#c8e6c9',
            onClick: () => navigate('/records/new')
          },
          {
            icon: <MonitorHeartIcon sx={{ fontSize: 80, color: darkMode ? '#ce93d8' : '#9c27b0' }} />,
            title: "Disease Prediction",
            description: "Try our AI-powered disease prediction assistant to analyze your disease and get possible diagnoses.",
            buttonText: "Try Assistant",
            buttonColor: "secondary",
            bgColor: darkMode ? '#2c3e50' : '#f3e5f5',
            onClick: handleDiseasePrediction
          },
          {
            icon: <PersonIcon sx={{ fontSize: 80, color: darkMode ? '#ba68c8' : '#7b1fa2' }} />,
            title: "Profile Settings",
            description: "Update your personal information, privacy settings, and manage your account preferences.",
            buttonText: "Manage Profile",
            buttonColor: "secondary",
            bgColor: darkMode ? '#2c3e50' : '#e1bee7',
            onClick: () => navigate('/profile')
          }
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index} component={motion.div} variants={itemVariants}>
            <Card 
              sx={cardStyle} 
              component={motion.div}
              whileHover={{ y: -10, boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
            >
              <CardMedia
                component="div"
                sx={{
                  backgroundColor: card.bgColor,
                  height: 140,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 2, -2, 0]
                  }}
                  transition={{ 
                    duration: 5, 
                    repeat: Infinity,
                    delay: index * 0.5
                  }}
                >
                  {card.icon}
                </motion.div>
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold" color={darkMode ? 'text.primary' : 'inherit'}>
                  {card.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {card.description}
                </Typography>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="contained"
                    color={card.buttonColor as "primary" | "secondary" | "success"}
                    fullWidth
                    onClick={card.onClick}
                    sx={buttonStyle}
                    endIcon={<ArrowForwardIcon />}
                  >
                    {card.buttonText}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Disease Prediction Assistant Banner */}
      <motion.div variants={itemVariants}>
        <Paper 
          elevation={darkMode ? 3 : 0}
          component={motion.div}
          whileHover={{ y: -5 }}
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            border: darkMode ? '1px solid #3c2150' : '1px solid #f3e5f5',
            background: darkMode ? 
              'linear-gradient(135deg, #2a1429 0%, #32174d 100%)' : 
              'linear-gradient(135deg, #e1bee7 0%, #f3e5f5 100%)',
            boxShadow: '0 4px 20px rgba(156, 39, 176, 0.15)',
            transition: 'all 0.3s',
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
              <Box 
                component={motion.div}
                sx={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }}
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <MonitorHeartIcon sx={{ fontSize: 160 }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  AI Disease Prediction
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '90%', color: 'white' }}>
                  Get instant AI-powered analysis of your disease and discover possible conditions that match your health situation.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                </motion.div>
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
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Enter the required parameters in our advanced AI tool</Typography>
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
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Get instant analysis and potential diagnoses</Typography>
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
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Share results with your healthcare provider</Typography>
                </Box>
                <Typography variant="body2" color={darkMode ? 'text.secondary' : 'text.secondary'} sx={{ fontStyle: 'italic', mt: 2 }}>
                  Note: This tool provides assistance only and does not replace professional medical advice.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      {/* ABHA Integration Section */}
      <motion.div variants={itemVariants}>
        <Paper 
          elevation={darkMode ? 3 : 0}
          component={motion.div}
          whileHover={{ y: -5 }}
          sx={{ 
            mb: 4, 
            borderRadius: 3, 
            overflow: 'hidden',
            border: darkMode ? '1px solid #2e4e31' : '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
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
              <Box 
                component={motion.div}
                sx={{ position: 'absolute', right: -30, top: -30, opacity: 0.2 }}
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                  scale: { duration: 5, repeat: Infinity, repeatType: "reverse" }
                }}
              >
                <HealthAndSafetyIcon sx={{ fontSize: 160 }} />
              </Box>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  ABHA Integration
                </Typography>
                <Typography variant="body1" paragraph sx={{ mb: 4, maxWidth: '90%', color: 'white' }}>
                  Link your ABHA ID to access and share your health records securely across healthcare providers.
                </Typography>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    sx={{
                      ...buttonStyle,
                      bgcolor: 'white',
                      color: '#4caf50',
                      '&:hover': {
                        bgcolor: 'white',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      }
                    }}
                    onClick={() => navigate('/profile')}
                    endIcon={<QrCode2Icon />}
                  >
                    Manage ABHA ID
                  </Button>
                </motion.div>
              </Box>
            </Grid>
            <Grid item xs={12} md={7}>
              <Box p={4}>
                <Typography variant="h5" gutterBottom color="primary.main" fontWeight="bold">
                  Benefits of ABHA
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: '#4caf50', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    1
                  </Box>
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Access your health records anywhere, anytime</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: '#4caf50', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    2
                  </Box>
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Share records securely with healthcare providers</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box sx={{ 
                    width: 24, 
                    height: 24, 
                    borderRadius: '50%', 
                    bgcolor: '#4caf50', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2
                  }}>
                    3
                  </Box>
                  <Typography variant="body1" color={darkMode ? 'text.primary' : 'inherit'}>Maintain a complete digital health profile</Typography>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'flex-start', gap: 2, mt: 3 }}>
                  <motion.div
                    animate={{ 
                      opacity: [0.6, 1, 0.6],
                      y: [0, -5, 0] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    style={{ flex: 1 }}
                  >
                    <Alert 
                      severity={abhaLinked ? "success" : "info"} 
                      sx={{ width: '100%' }}
                    >
                      {abhaLinked 
                        ? "Your ABHA ID is linked and active" 
                        : "Link your ABHA ID to enable seamless health record sharing"}
                    </Alert>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => window.open('https://abha.abdm.gov.in/abha/v3/', '_blank')}
                      sx={{
                        ...buttonStyle,
                        borderColor: '#4caf50',
                        color: darkMode ? '#81c784' : '#4caf50',
                        whiteSpace: 'nowrap',
                        '&:hover': {
                          borderColor: '#4caf50',
                          backgroundColor: 'rgba(76, 175, 80, 0.08)',
                          boxShadow: '0 4px 8px rgba(76, 175, 80, 0.2)',
                        }
                      }}
                    >
                      Learn More About ABHA
                    </Button>
                  </motion.div>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Box 
          component={motion.div}
          whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
          sx={{ 
            borderRadius: 3, 
            bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255,255,255,0.9)',
            p: 3, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: {xs: 'wrap', md: 'nowrap'},
            gap: 2,
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: darkMode 
                ? 'linear-gradient(to top, rgba(33, 150, 243, 0.1), transparent)'
                : 'linear-gradient(to top, rgba(33, 150, 243, 0.05), transparent)',
              zIndex: 0,
              animation: 'wave 8s ease-in-out infinite alternate',
              '@keyframes wave': {
                '0%': {
                  transform: 'translateY(20%) scale(1.2, 1)',
                },
                '100%': {
                  transform: 'translateY(10%) scale(1.5, 0.8)',
                },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '30%',
              background: darkMode 
                ? 'linear-gradient(to top, rgba(33, 150, 243, 0.08), transparent)'
                : 'linear-gradient(to top, rgba(33, 150, 243, 0.03), transparent)',
              zIndex: 0,
              animation: 'wave2 6s ease-in-out infinite alternate-reverse',
              '@keyframes wave2': {
                '0%': {
                  transform: 'translateY(30%) scale(1.4, 1)',
                },
                '100%': {
                  transform: 'translateY(5%) scale(1.2, 0.9)',
                },
              },
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, position: 'relative', zIndex: 1 }}>
            <Avatar 
              component={motion.div}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              sx={{ bgcolor: darkMode ? '#2196f3' : '#1976d2', width: 50, height: 50 }}
            >
              <HealthAndSafetyIcon fontSize="large" />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="text.primary">Need assistance?</Typography>
              <Typography variant="body2" color="text.primary">
                Contact our support team for help with your account or health records
              </Typography>
            </Box>
          </Box>
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <Button 
              variant="outlined" 
              color="primary"
              onClick={() => navigate('/contact')}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                borderRadius: 2,
                px: 3,
                whiteSpace: 'nowrap',
                '&:hover': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                },
                ...(darkMode ? {
                  borderColor: '#90caf9',
                  color: '#90caf9'
                } : {})
              } as SxProps<Theme>}
            >
              Contact Support
            </Button>
          </motion.div>
        </Box>
      </motion.div>

      {/* Disease Prediction Floating Action Button */}
      <Zoom in={true} style={{ transitionDelay: '500ms' }}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: 'rgba(156, 39, 176, 0.3)',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.5)',
                  opacity: 0,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 0,
                },
              },
            }
          }}
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <Tooltip title="Try Disease Prediction Assistant" placement="left">
              <Fab
                color="secondary"
                aria-label="disease prediction"
                onClick={handleDiseasePrediction}
                sx={{
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
          </motion.div>
        </Box>
      </Zoom>
    </Container>
  );
};

export default Dashboard; 