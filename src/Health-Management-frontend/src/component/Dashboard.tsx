import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  Zoom,
  Chip,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  LinearProgress
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
import VideocamIcon from '@mui/icons-material/Videocam';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BarChartIcon from '@mui/icons-material/BarChart';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useUser } from './UserContext';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AddIcon from '@mui/icons-material/Add';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const { currentProfile } = useUser();
  const abhaLinked = currentProfile?.abhaId && currentProfile?.abhaCardLinked;
  const [darkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeFrame, setTimeFrame] = useState('daily');

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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
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
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: -1 }}>
        {Array.from({ length: 15 }).map((_, index) => (
          <Box
            key={index}
            component={motion.div}
            sx={{
              position: 'absolute',
              width: Math.random() * 8 + 3,
              height: Math.random() * 8 + 3,
              borderRadius: '50%',
              background: darkMode ? 
                `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.2 + 0.1})` :
                `rgba(${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 100 + 155)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.15 + 0.05})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(1px)'
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              x: [0, Math.random() * 50 - 25],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </Box>
    );
  };

  // Card interface for TypeScript
  interface QuickAccessCard {
    icon: React.ReactNode;
    title: string;
    description: string;
    buttonText: string;
    buttonColor: "primary" | "secondary" | "success";
    bgColor: string;
    iconAnimation: {
      rotate?: number[] | undefined;
      scale: number[];
    };
    buttonGradient: string;
    onClick: () => void;
  }

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
      
      {/* Pattern Overlay */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${darkMode ? '999999' : '9C27B0'}' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          opacity: 0.2,
          pointerEvents: 'none',
          zIndex: -1
        }}
      />

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
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 3, 
          color: darkMode ? '#90caf9' : '#1976d2',
          position: 'relative',
          display: 'inline-block',
          fontFamily: "'Poppins', sans-serif",
          letterSpacing: '0.5px',
          fontSize: '1.8rem',
          textShadow: darkMode ? '0 0 15px rgba(144, 202, 249, 0.3)' : '0 0 15px rgba(25, 118, 210, 0.15)',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -5,
            left: 0,
            width: '60%',
            height: 4,
            background: 'linear-gradient(90deg, #6a1b9a, #4a148c, #6a1b9a)',
            borderRadius: 2,
            animation: 'gradient 3s ease infinite',
            backgroundSize: '200% auto',
            '@keyframes gradient': {
              '0%': {
                backgroundPosition: '0% center',
              },
              '50%': {
                backgroundPosition: '100% center',
              },
              '100%': {
                backgroundPosition: '0% center',
              },
            },
          }
        }}>
          Quick Access
        </Typography>
      </motion.div>

      <Grid container spacing={3} sx={{ mb: 5 }}>
        {[
          {
            icon: <MedicalInformationIcon sx={{ fontSize: 80, color: 'white' }} />,
            title: "Health Records",
            description: "View and manage your complete medical history, including test results, prescriptions, and diagnoses.",
            buttonText: "View Records",
            buttonColor: "primary" as "primary",
            bgColor: darkMode ? 'linear-gradient(135deg, #3949ab, #5c6bc0)' : 'linear-gradient(135deg, #5c6bc0, #9fa8da)',
            onClick: () => navigate('/records')
          },
          {
            icon: <AddCircleIcon sx={{ fontSize: 80, color: 'white' }} />,
            title: "Add New Record",
            description: "Create and store new health records with the ability to upload documents, images, and other attachments.",
            buttonText: "Add Record",
            buttonColor: "success" as "success",
            bgColor: darkMode ? 'linear-gradient(135deg, #00695c, #00897b)' : 'linear-gradient(135deg, #00897b, #4db6ac)',
            onClick: () => navigate('/records/new')
          },
          {
            icon: <MonitorHeartIcon sx={{ fontSize: 80, color: 'white' }} />,
            title: "Disease Prediction",
            description: "Try our AI-powered disease prediction assistant to analyze your disease and get possible diagnoses.",
            buttonText: "Try Assistant",
            buttonColor: "secondary" as "secondary",
            bgColor: darkMode ? 'linear-gradient(135deg, #ad1457, #d81b60)' : 'linear-gradient(135deg, #d81b60, #ec407a)',
            onClick: handleDiseasePrediction
          },
          {
            icon: <PersonIcon sx={{ fontSize: 80, color: 'white' }} />,
            title: "Profile Settings",
            description: "Update your personal information, privacy settings, and manage your account preferences.",
            buttonText: "Manage Profile",
            buttonColor: "secondary" as "secondary",
            bgColor: darkMode ? 'linear-gradient(135deg, #6a1b9a, #8e24aa)' : 'linear-gradient(135deg, #8e24aa, #ab47bc)',
            onClick: () => navigate('/profile')
          }
        ].map((card, index) => (
          <Grid item xs={12} md={3} key={index} component={motion.div} variants={itemVariants}>
            <Card 
              sx={{
                ...cardStyle,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'}`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: darkMode ? '0 15px 30px rgba(0, 0, 0, 0.4)' : '0 15px 30px rgba(0, 0, 0, 0.15)'
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: card.bgColor,
                  zIndex: 1
                }
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  background: card.bgColor,
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
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    zIndex: 0
                  }}
                />
              </CardMedia>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography 
                  variant="h6" 
                  gutterBottom 
                  fontWeight="bold" 
                  sx={{
                    color: darkMode ? '#ffffff' : '#212121',
                    position: 'relative',
                    display: 'inline-block',
                    fontFamily: "'Poppins', sans-serif",
                    letterSpacing: '0.3px',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -2,
                      left: 0,
                      width: '40%',
                      height: 2,
                      background: card.bgColor,
                      borderRadius: 2,
                    }
                  }}
                >
                  {card.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  color={darkMode ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.7)'} 
                  paragraph
                  sx={{
                    fontFamily: "'Roboto', sans-serif",
                    lineHeight: 1.6,
                    fontSize: '0.95rem',
                    fontWeight: darkMode ? 300 : 400
                  }}
                >
                  {card.description}
                </Typography>
                <motion.div 
                  whileHover={{ 
                    scale: 1.03,
                    y: -2
                  }} 
                  whileTap={{ scale: 0.97 }}
                >
                  <Button
                    variant="contained"
                    color={card.buttonColor}
                    fullWidth
                    onClick={card.onClick}
                    sx={{
                      ...buttonStyle,
                      background: card.bgColor,
                      position: 'relative',
                      overflow: 'hidden',
                      fontFamily: "'Poppins', sans-serif",
                      fontWeight: 600,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
                        transform: 'rotate(30deg)',
                        transition: 'all 0.5s',
                        opacity: 0
                      },
                      '&:hover::after': {
                        opacity: 1,
                        transform: 'rotate(30deg) translate(100%, -100%)',
                        transition: 'all 0.5s'
                      }
                    }}
                    endIcon={
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          ease: "easeInOut" 
                        }}
                      >
                        <ArrowForwardIcon />
                      </motion.div>
                    }
                  >
                    {card.buttonText}
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <Card sx={cardStyle}>
              <CardContent sx={{ position: 'relative', flexGrow: 1, p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                      <NotificationsActiveIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      Notifications
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Stay updated with your health records, appointments, and important reminders.
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Button 
                      variant="contained" 
                      color="info"
                      endIcon={<ArrowForwardIcon />}
                      sx={buttonStyle}
                      onClick={() => navigate('/notifications')}
                      fullWidth
                    >
                      View Notifications
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <motion.div variants={itemVariants}>
            <Card sx={cardStyle}>
              <CardContent sx={{ position: 'relative', flexGrow: 1, p: 3 }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%'
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                      <VideocamIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2">
                      Telehealth
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Connect with healthcare professionals through secure video consultations.
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Button 
                      variant="contained" 
                      color="success"
                      endIcon={<ArrowForwardIcon />}
                      sx={buttonStyle}
                      onClick={() => navigate('/telehealth')}
                      fullWidth
                    >
                      Start Consultation
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
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

      {/* Assistance Banner */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        whileHover={{ 
          y: -5,
          transition: { duration: 0.2 }
        }}
        sx={{
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 4,
          boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
          background: darkMode ? 'rgba(30, 30, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(10px)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(60deg, rgba(33, 150, 243, 0.1), rgba(0, 188, 212, 0.1), rgba(156, 39, 176, 0.1))',
            zIndex: 0
          }
        }}
      >
        {/* Animated Wave Background */}
        <Box
          component={motion.div}
          animate={{ 
            x: [0, -100],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "linear"
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: -100,
            height: '100%',
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%2300bcd4' fill-opacity='0.08' d='M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 100%',
            zIndex: 0,
            opacity: 0.5
          }}
        />
        
        <Box
          component={motion.div}
          animate={{ 
            x: [0, -100],
          }}
          transition={{ 
            duration: 15,
            repeat: Infinity,
            ease: "linear",
            delay: 0.5
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: -100,
            height: '100%',
            background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%239C27B0' fill-opacity='0.05' d='M0,96L48,128C96,160,192,224,288,213.3C384,203,480,117,576,101.3C672,85,768,139,864,144C960,149,1056,107,1152,112C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat-x',
            backgroundSize: '100% 100%',
            zIndex: 0,
            opacity: 0.5
          }}
        />

        {/* Pattern Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%2300bcd4' fill-opacity='0.05' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
            zIndex: 0,
            opacity: 0.4
          }}
        />
        
        <Box sx={{ position: 'relative', flexGrow: 1, p: 3, zIndex: 1 }}>
          <Grid container alignItems="center">
            <Grid item xs={12} md={8}>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="text.primary">Need assistance?</Typography>
                <Typography variant="body2" color="text.primary">
                  Contact our support team for help with your account or health records
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, mt: { xs: 2, md: 0 } }}>
              <Button
                variant="contained"
                color="primary"
                startIcon={<HelpOutlineIcon />}
                component={motion.div}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(0, 188, 212, 0.4)',
                }}
                whileTap={{ scale: 0.95 }}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #00bcd4 30%, #2196f3 90%)',
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 10px rgba(0, 188, 212, 0.3)',
                }}
                onClick={() => {
                  alert('Support contact requested!');
                }}
              >
                Contact Support
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Disease Prediction Floating Action Button */}
      <Zoom in={true} style={{ transitionDelay: '500ms' }}>
        <Box
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            zIndex: 1000,
            filter: 'drop-shadow(0 6px 16px rgba(156, 39, 176, 0.4))',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: 'rgba(156, 39, 176, 0.3)',
              animation: 'pulse 3s infinite',
              '@keyframes pulse': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 0.8,
                },
                '50%': {
                  transform: 'scale(1.8)',
                  opacity: 0,
                },
                '100%': {
                  transform: 'scale(1)',
                  opacity: 0,
                },
              },
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: '50%',
              background: 'rgba(156, 39, 176, 0.2)',
              animation: 'pulse2 3s infinite 1s',
              '@keyframes pulse2': {
                '0%': {
                  transform: 'scale(1)',
                  opacity: 0.5,
                },
                '50%': {
                  transform: 'scale(2.2)',
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
            whileHover={{ scale: 1.15, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            animate={{ 
              y: [0, -6, 0],
            }}
            transition={{ 
              y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              scale: { type: "spring", stiffness: 400, damping: 10 },
              rotate: { type: "spring", stiffness: 300, damping: 10 }
            }}
          >
            <Tooltip 
              title="Try Disease Prediction Assistant" 
              placement="left"
              sx={{ 
                '& .MuiTooltip-tooltip': { 
                  background: darkMode ? 'rgba(156, 39, 176, 0.9)' : 'rgba(156, 39, 176, 0.8)',
                  backdropFilter: 'blur(4px)',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
                  fontSize: '0.9rem',
                  padding: '10px 16px',
                }
              }}
            >
              <Fab
                color="secondary"
                onClick={handleDiseasePrediction}
                sx={{
                  background: 'linear-gradient(45deg, #9c27b0 30%, #d500f9 90%)',
                  boxShadow: '0 3px 15px 2px rgba(156, 39, 176, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-50%',
                    left: '-50%',
                    width: '200%',
                    height: '200%',
                    background: 'linear-gradient(to right, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(255, 255, 255, 0) 100%)',
                    transform: 'rotate(30deg)',
                    animation: 'shine 6s infinite',
                    '@keyframes shine': {
                      '0%': { transform: 'translateX(-100%) rotate(30deg)' },
                      '15%': { transform: 'translateX(100%) rotate(30deg)' },
                      '100%': { transform: 'translateX(100%) rotate(30deg)' },
                    }
                  }
                }}
              >
                <LocalHospitalIcon />
              </Fab>
            </Tooltip>
          </motion.div>
        </Box>
      </Zoom>

      {/* Add Feature Button */}
      <Tooltip 
        title="Add Health Record" 
        placement="left"
        sx={{ 
          '& .MuiTooltip-tooltip': { 
            background: darkMode ? 'rgba(33, 150, 243, 0.9)' : 'rgba(33, 150, 243, 0.8)',
            backdropFilter: 'blur(4px)',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(33, 150, 243, 0.4)',
            fontSize: '0.9rem',
            padding: '10px 16px',
          }
        }}
      >
        <Box
          component={motion.div}
          whileHover={{ scale: 1.1, rotate: -5 }}
          whileTap={{ scale: 0.9 }}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 100,
            zIndex: 1000,
            filter: 'drop-shadow(0 4px 10px rgba(33, 150, 243, 0.4))',
          }}
        >
          <Fab 
            color="primary" 
            size="medium"
            onClick={() => { 
              alert('Add Health Record clicked!'); 
            }}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 30%, #00bcd4 90%)',
              boxShadow: '0 3px 15px 2px rgba(33, 150, 243, 0.4)',
            }}
          >
            <motion.div
              animate={{ rotate: 180 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <AddIcon />
            </motion.div>
          </Fab>
        </Box>
      </Tooltip>

      {/* Feature Cards */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        sx={{ mb: 4, mt: 2 }}
      >
        <Typography variant="h5" gutterBottom sx={{ 
          fontWeight: 'bold', 
          mb: 3,
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -8,
            left: 0,
            width: '40%',
            height: 3,
            background: 'linear-gradient(90deg, #00bcd4, rgba(0, 188, 212, 0.2))',
            borderRadius: 2,
          }
        }}>
          Health Management Features
        </Typography>
        
        <Grid container spacing={3}>
          {/* Disease Prediction Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component={motion.div}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              sx={{ height: '100%' }}
            >
              <Card 
                sx={{
                  bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                  borderRadius: 4,
                  boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                  position: 'relative',
                  height: '100%',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #FF4D4D, #FF008C)',
                    opacity: 0.8,
                    zIndex: 1
                  },
                  backgroundImage: 'linear-gradient(to bottom right, rgba(255, 77, 77, 0.05), rgba(255, 0, 140, 0.08))'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255, 77, 77, 0.15) 0%, rgba(255, 0, 140, 0) 70%)',
                    zIndex: 0
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      background: 'linear-gradient(45deg, rgba(255, 77, 77, 0.12), rgba(255, 0, 140, 0.12))',
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      component={motion.div}
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ 
                        duration: 3,
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      sx={{ 
                        bgcolor: 'rgba(255, 77, 77, 0.9)', 
                        mr: 2,
                        boxShadow: '0 4px 20px rgba(255, 77, 77, 0.4)'
                      }}
                    >
                      <LocalHospitalIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #FF4D4D, #FF008C)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Disease Prediction
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Use our advanced AI tools to predict potential health risks based on your symptoms and medical history.
                  </Typography>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variant="contained"
                      onClick={handleDiseasePrediction}
                      sx={{ 
                        background: 'linear-gradient(45deg, #FF4D4D, #FF008C)',
                        borderRadius: 8,
                        px: 3,
                        boxShadow: '0 4px 15px rgba(255, 77, 77, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #FF366F, #FF0066)',
                          boxShadow: '0 6px 20px rgba(255, 77, 77, 0.5)',
                        }
                      }}
                    >
                      Try Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Physical Fitness Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component={motion.div}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              sx={{ height: '100%' }}
            >
              <Card
                sx={{
                  height: '100%',
                  bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                  borderRadius: 4,
                  boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #4CAF50, #8BC34A)',
                    opacity: 0.8,
                    zIndex: 1
                  },
                  backgroundImage: 'linear-gradient(to bottom right, rgba(76, 175, 80, 0.05), rgba(139, 195, 74, 0.08))'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, rgba(139, 195, 74, 0) 70%)',
                    zIndex: 0
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.12), rgba(139, 195, 74, 0.12))',
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      component={motion.div}
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ 
                        duration: 3.5,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.2
                      }}
                      sx={{ 
                        bgcolor: 'rgba(76, 175, 80, 0.9)', 
                        mr: 2,
                        boxShadow: '0 4px 20px rgba(76, 175, 80, 0.4)'
                      }}
                    >
                      <FitnessCenterIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #4CAF50, #8BC34A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Fitness Tracking
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Track your workouts, set fitness goals, and monitor your progress over time to maintain a healthy lifestyle.
                  </Typography>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variant="contained"
                      onClick={() => navigate('/fitness')}
                      sx={{ 
                        background: 'linear-gradient(45deg, #4CAF50, #8BC34A)',
                        borderRadius: 8,
                        px: 3,
                        boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #43A047, #7CB342)',
                          boxShadow: '0 6px 20px rgba(76, 175, 80, 0.5)',
                        }
                      }}
                    >
                      View Fitness Data
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          {/* Analytics Card */}
          <Grid item xs={12} sm={6} md={4}>
            <Box
              component={motion.div}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              sx={{ height: '100%' }}
            >
              <Card
                sx={{
                  height: '100%',
                  bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                  borderRadius: 4,
                  boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
                  },
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 6,
                    background: 'linear-gradient(90deg, #3F51B5, #2196F3)',
                    opacity: 0.8,
                    zIndex: 1
                  },
                  backgroundImage: 'linear-gradient(to bottom right, rgba(63, 81, 181, 0.05), rgba(33, 150, 243, 0.08))'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    right: -20,
                    top: -20,
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(63, 81, 181, 0.15) 0%, rgba(33, 150, 243, 0) 70%)',
                    zIndex: 0
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3, position: 'relative' }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: 2, 
                      background: 'linear-gradient(45deg, rgba(63, 81, 181, 0.12), rgba(33, 150, 243, 0.12))',
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    <Avatar
                      component={motion.div}
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [0, 10, 0]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity, 
                        ease: "easeInOut",
                        delay: 0.4
                      }}
                      sx={{ 
                        bgcolor: 'rgba(63, 81, 181, 0.9)', 
                        mr: 2,
                        boxShadow: '0 4px 20px rgba(63, 81, 181, 0.4)'
                      }}
                    >
                      <BarChartIcon />
                    </Avatar>
                    <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #3F51B5, #2196F3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                      Health Analytics
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Visualize your health data trends and gain insights into your overall wellbeing. Track vital signs, medication adherence, and physical activity.
                  </Typography>
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      variant="contained"
                      onClick={() => navigate('/analytics')}
                      sx={{ 
                        background: 'linear-gradient(45deg, #3F51B5, #2196F3)',
                        borderRadius: 8,
                        px: 3,
                        boxShadow: '0 4px 15px rgba(63, 81, 181, 0.4)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #303F9F, #1E88E5)',
                          boxShadow: '0 6px 20px rgba(63, 81, 181, 0.5)',
                        }
                      }}
                    >
                      View Analytics
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* New Health Components Section */}
      <motion.div variants={itemVariants}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mt: 6, mb: 3, color: darkMode ? '#90caf9' : '#1976d2' }}>
          Health Insights & Tools
        </Typography>
      </motion.div>

      <Grid container spacing={3}>
        {/* Weather Health Suggestions */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: '#03a9f4', mr: 2 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.8 1.41 1.41 1.79-1.8zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                  </svg>
                </Avatar>
                <Typography variant="h6" component="h2">
                  Weather Health Tips
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2, p: 2, bgcolor: darkMode ? 'rgba(3, 169, 244, 0.1)' : 'rgba(3, 169, 244, 0.05)', borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>
                    New Delhi, India
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill={darkMode ? "#fff" : "#03a9f4"}>
                      <path d="M0 0h24v24H0z" fill="none"/>
                      <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
                    </svg>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 0.5 }}>
                      32°C
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, mt: 1 }}>
                  High UV index (8/10), hot and sunny with 68% humidity
                </Typography>
                <Typography variant="body2" sx={{ color: '#e91e63', fontWeight: 'medium', fontSize: '0.8rem' }}>
                  Heat advisory in effect today
                </Typography>
              </Box>
              
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                Health Recommendations:
              </Typography>
              
              <Box component="ul" sx={{ pl: 2 }}>
                <Box component="li">
                  <Typography variant="body2" color="text.secondary">
                    Drink at least 3-4 liters of water today to avoid dehydration
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2" color="text.secondary">
                    Apply SPF 50+ sunscreen every 2 hours when outdoors
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2" color="text.secondary">
                    Avoid strenuous outdoor activities between 11am-3pm
                  </Typography>
                </Box>
                <Box component="li">
                  <Typography variant="body2" color="text.secondary">
                    Watch for signs of heat exhaustion (dizziness, excessive sweating)
                  </Typography>
                </Box>
              </Box>
              
              {/* Detailed weather guide (initially hidden) */}
              <Box id="detailed-weather-guide" sx={{ display: 'none', mt: 3, mb: 2 }}>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  Detailed Weather Health Guide
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="medium" color="primary" gutterBottom>
                    Heat Wave Safety Precautions
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Wear lightweight, light-colored, loose-fitting clothing
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Schedule outdoor activities during cooler morning and evening hours
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Rest frequently in shaded areas to allow your body to recover
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Never leave children or pets in a closed vehicle in hot weather
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="medium" color="primary" gutterBottom>
                    UV Protection Measures
                  </Typography>
                  <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Use a broad-spectrum sunscreen with SPF 50+ and reapply every 2 hours
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Wear UV-protective sunglasses and a wide-brimmed hat
                      </Typography>
                    </Box>
                    <Box component="li">
                      <Typography variant="body2" color="text.secondary">
                        Seek shade during peak sun intensity hours (10am-4pm)
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" color="primary" gutterBottom>
                    Heat-Related Illness Warning Signs
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                    <Box sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(255, 152, 0, 0.1)', borderRadius: 2, border: '1px solid rgba(255, 152, 0, 0.2)' }}>
                      <Typography variant="body2" fontWeight="bold" color="warning.main" gutterBottom>
                        Heat Exhaustion
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        Heavy sweating, cool pale skin, fast pulse, nausea, dizziness, headache
                      </Typography>
                    </Box>
                    <Box sx={{ flex: 1, p: 1.5, bgcolor: 'rgba(244, 67, 54, 0.1)', borderRadius: 2, border: '1px solid rgba(244, 67, 54, 0.2)' }}>
                      <Typography variant="body2" fontWeight="bold" color="error" gutterBottom>
                        Heat Stroke
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                        High body temp (103°F+), hot/red skin, rapid pulse, confusion, unconsciousness
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                color="info"
                fullWidth
                onClick={() => {
                  const detailedGuide = document.getElementById('detailed-weather-guide');
                  const button = document.getElementById('weather-guide-button');
                  
                  if (detailedGuide && button) {
                    const isVisible = detailedGuide.style.display !== 'none';
                    
                    if (isVisible) {
                      detailedGuide.style.display = 'none';
                      button.textContent = 'View Detailed Weather Health Guide';
                    } else {
                      detailedGuide.style.display = 'block';
                      button.textContent = 'Hide Detailed Guide';
                    }
                  }
                }}
                id="weather-guide-button"
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                View Detailed Weather Health Guide
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Symptom Analyzer */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#f44336', mr: 2 }}>
                  <LocalHospitalIcon />
                </Avatar>
                <Typography variant="h6" component="h2">
                  Symptom Analyzer
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select your symptoms below to get an instant analysis of potential health conditions. This tool helps identify possible health issues but doesn't replace professional medical advice.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Select your symptoms:
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: 1, 
                    mb: 2 
                  }}
                >
                  {[
                    { name: 'Headache', id: 1 },
                    { name: 'Fever', id: 2 },
                    { name: 'Cough', id: 3 },
                    { name: 'Fatigue', id: 4 },
                    { name: 'Nausea', id: 5 },
                    { name: 'Sore Throat', id: 6 },
                    { name: 'Muscle Pain', id: 7 },
                    { name: 'Dizziness', id: 8 },
                    { name: 'Shortness of Breath', id: 9 },
                    { name: 'Loss of Appetite', id: 10 }
                  ].map((symptom) => (
                    <Chip
                      key={symptom.id}
                      label={symptom.name}
                      onClick={() => {
                        // In a real implementation, this would toggle the symptom selection
                        const element = document.getElementById(`symptom-${symptom.id}`);
                        if (element) {
                          const isSelected = element.getAttribute('data-selected') === 'true';
                          element.setAttribute('data-selected', isSelected ? 'false' : 'true');
                          element.style.backgroundColor = isSelected ? 'transparent' : (darkMode ? '#1976d2' : '#2196f3');
                          element.style.color = isSelected ? 'inherit' : '#fff';
                        }
                      }}
                      id={`symptom-${symptom.id}`}
                      data-selected="false"
                      variant="outlined"
                      sx={{ 
                        borderRadius: 1,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: darkMode ? 'rgba(244, 67, 54, 0.1)' : 'rgba(244, 67, 54, 0.05)',
                          cursor: 'pointer'
                        }
                      }}
                    />
                  ))}
                </Box>
                
                <Box id="analysis-results-container" sx={{ display: 'none' }}>
                  <Box sx={{ 
                    mt: 3, 
                    p: 2, 
                    bgcolor: darkMode ? 'rgba(3, 169, 244, 0.1)' : 'rgba(3, 169, 244, 0.05)', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(3, 169, 244, 0.3)' : 'rgba(3, 169, 244, 0.2)'
                  }}>
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom color="primary">
                      Symptom Analysis Results:
                    </Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <b>Potential conditions based on your selected symptoms:</b>
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mt: 1 }} id="conditions-list">
                        {/* Analysis results will be displayed here */}
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="error" sx={{ fontWeight: 'medium', mt: 2 }}>
                      Note: This is not a medical diagnosis. Please consult with a healthcare professional for proper evaluation.
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    // In a real implementation, this would analyze the selected symptoms
                    // For demo purposes, we're showing mock analysis results
                    const analysisContainer = document.getElementById('analysis-results-container');
                    const conditionsList = document.getElementById('conditions-list');
                    
                    if (analysisContainer && conditionsList) {
                      // Count selected symptoms
                      const selectedSymptoms = [];
                      for (let i = 1; i <= 10; i++) {
                        const symptomElement = document.getElementById(`symptom-${i}`);
                        if (symptomElement && symptomElement.getAttribute('data-selected') === 'true') {
                          selectedSymptoms.push(symptomElement.textContent);
                        }
                      }
                      
                      // Generate analysis based on selections
                      conditionsList.innerHTML = '';
                      
                      if (selectedSymptoms.length === 0) {
                        // No symptoms selected case
                        const noSymptomsItem = document.createElement('div');
                        noSymptomsItem.innerHTML = '<p>Please select at least one symptom for analysis.</p>';
                        conditionsList.appendChild(noSymptomsItem);
                      } else {
                        // Generate mock conditions based on selected symptoms
                        const conditions = [
                          { name: 'Common Cold', match: '85%', description: 'Upper respiratory infection with symptoms like cough, sore throat, and congestion' },
                          { name: 'Seasonal Allergies', match: '72%', description: 'Allergic reaction to environmental factors causing respiratory symptoms' },
                          { name: 'Migraine', match: '65%', description: 'Neurological condition causing severe headaches and sometimes nausea' },
                          { name: 'Influenza', match: '58%', description: 'Viral infection with fever, body aches, and respiratory symptoms' },
                          { name: 'Stress', match: '45%', description: 'Physical and emotional tension manifesting as various physical symptoms' }
                        ];
                        
                        // Display a subset based on symptom count
                        const displayCount = Math.min(selectedSymptoms.length + 1, conditions.length);
                        
                        for (let i = 0; i < displayCount; i++) {
                          const condition = conditions[i];
                          const listItem = document.createElement('li');
                          listItem.innerHTML = `<div style="margin-bottom: 8px;">
                            <p style="margin: 0; font-weight: bold;">${condition.name} (${condition.match} match)</p>
                            <p style="margin: 0; font-size: 0.875rem; color: ${darkMode ? '#aaa' : '#666'};">
                              ${condition.description}
                            </p>
                          </div>`;
                          conditionsList.appendChild(listItem);
                        }
                      }
                      
                      analysisContainer.style.display = 'block';
                    }
                  }}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    flex: 1
                  }}
                >
                  Analyze Symptoms
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    // Reset all symptoms to unselected
                    for (let i = 1; i <= 10; i++) {
                      const symptomElement = document.getElementById(`symptom-${i}`);
                      if (symptomElement) {
                        symptomElement.setAttribute('data-selected', 'false');
                        symptomElement.style.backgroundColor = 'transparent';
                        symptomElement.style.color = 'inherit';
                      }
                    }
                    
                    // Hide analysis results
                    const analysisContainer = document.getElementById('analysis-results-container');
                    if (analysisContainer) {
                      analysisContainer.style.display = 'none';
                    }
                  }}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'bold'
                  }}
                >
                  Reset
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Health Data Visualization */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#4caf50', mr: 2 }}>
                  <BarChartIcon />
                </Avatar>
                <Typography variant="h6" component="h2">
                  Health Data Visualization
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2" fontWeight="bold">
                    Your Health Metrics Overview
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      color="primary"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Daily
                    </Button>
                    <Button
                      component={Link}
                      to="/health-metrics/weekly"
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Weekly
                    </Button>
                    <Button
                      component={Link}
                      to="/health-metrics/monthly"
                      size="small"
                      sx={{ 
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 'medium'
                      }}
                    >
                      Monthly
                    </Button>
                  </Box>
                </Box>
                
                <Box sx={{ height: 200, width: '100%', position: 'relative' }}>
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'flex-end'
                  }}>
                    {/* Real Data Chart */}
                    {[
                      { day: 'Mon', value: 60, label: '8,532 steps' },
                      { day: 'Tue', value: 75, label: '10,287 steps' },
                      { day: 'Wed', value: 45, label: '6,845 steps' },
                      { day: 'Thu', value: 80, label: '11,322 steps' },
                      { day: 'Fri', value: 65, label: '9,112 steps' },
                      { day: 'Sat', value: 90, label: '12,573 steps' },
                      { day: 'Sun', value: 70, label: '9,845 steps' }
                    ].map((data, index) => (
                      <Box
                        key={index}
                        sx={{
                          height: `${data.value}%`,
                          width: '10%',
                          backgroundColor: index === 3 ? '#4caf50' : darkMode ? 'rgba(33, 150, 243, 0.7)' : 'rgba(33, 150, 243, 0.5)',
                          mx: '1.5%',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease',
                          position: 'relative',
                          '&:hover': {
                            backgroundColor: index === 3 ? '#66bb6a' : 'rgba(33, 150, 243, 0.8)',
                            cursor: 'pointer'
                          }
                        }}
                      >
                        <Tooltip title={`${data.day}: ${data.label}`} placement="top">
                          <Box sx={{ width: '100%', height: '100%' }} />
                        </Tooltip>
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                    <Typography key={day} variant="caption" color="text.secondary">
                      {day}
                    </Typography>
                  ))}
                </Box>
              </Box>
              
              <Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Steps
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'medium', my: 1 }}>
                        11,322
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5, transform: 'rotate(45deg)' }} />
                        <Typography variant="body2" color="success.main">
                          +24% from yesterday
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: darkMode ? 'rgba(233, 30, 99, 0.1)' : 'rgba(233, 30, 99, 0.05)',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Heart Rate
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'medium', my: 1 }}>
                        68 bpm
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5, transform: 'rotate(-45deg)' }} />
                        <Typography variant="body2" color="success.main">
                          Resting, optimal
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: darkMode ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Sleep
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'medium', my: 1 }}>
                        7h 35m
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5, transform: 'rotate(45deg)' }} />
                        <Typography variant="body2" color="success.main">
                          +45m from average
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Paper 
                      elevation={0} 
                      sx={{ 
                        p: 2, 
                        bgcolor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                        borderRadius: 2
                      }}
                    >
                      <Typography variant="subtitle2" color="text.secondary">
                        Active Minutes
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 'medium', my: 1 }}>
                        53 min
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowForwardIcon sx={{ fontSize: 16, color: '#4caf50', mr: 0.5, transform: 'rotate(45deg)' }} />
                        <Typography variant="body2" color="success.main">
                          +8% above goal
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  // Toggle the display of expanded health dashboard
                  const expandedDashboard = document.getElementById('expanded-health-dashboard');
                  const button = document.getElementById('full-dashboard-button');
                  
                  if (expandedDashboard && button) {
                    const isVisible = expandedDashboard.style.display !== 'none';
                    
                    if (isVisible) {
                      expandedDashboard.style.display = 'none';
                      button.textContent = 'View Full Health Dashboard';
                    } else {
                      expandedDashboard.style.display = 'block';
                      button.textContent = 'Hide Full Dashboard';
                    }
                  }
                }}
                id="full-dashboard-button"
                sx={{ 
                  mt: 3,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                View Full Health Dashboard
              </Button>
              
              {/* Expanded Health Dashboard (initially hidden) */}
              <Box id="expanded-health-dashboard" sx={{ display: 'none', mt: 4 }}>
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
                  Complete Health Metrics Dashboard
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Weekly Trends
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(33, 150, 243, 0.1)' : 'rgba(33, 150, 243, 0.05)', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Physical Activity
                        </Typography>
                        <Box sx={{ height: 120, display: 'flex', alignItems: 'flex-end', mt: 2, mb: 1 }}>
                          {[
                            { value: 75, label: '10,287' },
                            { value: 90, label: '12,573' },
                            { value: 60, label: '8,532' },
                            { value: 85, label: '11,322' },
                          ].map((item, index) => (
                            <Box 
                              key={index}
                              sx={{ 
                                height: `${item.value}%`, 
                                width: '22%', 
                                mx: '1.5%',
                                bgcolor: 'primary.main',
                                borderRadius: '4px 4px 0 0',
                                position: 'relative'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  position: 'absolute', 
                                  bottom: -20, 
                                  left: 0, 
                                  width: '100%', 
                                  textAlign: 'center',
                                  fontSize: '0.65rem'
                                }}
                              >
                                {item.label}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                          <Typography variant="caption" color="text.secondary">
                            Average: 10,678 steps
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            +18% vs last week
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(233, 30, 99, 0.1)' : 'rgba(233, 30, 99, 0.05)', borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle2" color="error" gutterBottom>
                          Heart Rate
                        </Typography>
                        <Box sx={{ height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 1 }}>
                          <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                            <Box 
                              component="svg" 
                              sx={{ width: '100%', height: '100%' }}
                              viewBox="0 0 100 50"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M0,25 Q10,10 20,25 T40,25 T60,15 T80,35 T100,25"
                                fill="none"
                                stroke={darkMode ? "#f48fb1" : "#e91e63"}
                                strokeWidth="2"
                              />
                              <circle cx="20" cy="25" r="2" fill="#e91e63" />
                              <circle cx="40" cy="25" r="2" fill="#e91e63" />
                              <circle cx="60" cy="15" r="2" fill="#e91e63" />
                              <circle cx="80" cy="35" r="2" fill="#e91e63" />
                            </Box>
                            <Box sx={{ 
                              position: 'absolute', 
                              top: '50%', 
                              left: '50%', 
                              transform: 'translate(-50%, -50%)',
                              textAlign: 'center'
                            }}>
                              <Typography variant="h5" color="error.main" sx={{ fontWeight: 'bold' }}>
                                68
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                BPM
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="caption" color="text.secondary">
                            Resting range: 60-72
                          </Typography>
                          <Typography variant="caption" color="success.main">
                            Optimal zone
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Detailed Health Metrics
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(156, 39, 176, 0.1)' : 'rgba(156, 39, 176, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Sleep Quality
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              7h 35m
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Avg. duration
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: '#9c27b0',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            87%
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Deep: 2h 12m • Light: 4h 03m • REM: 1h 20m
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Nutrition
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              1,840
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Cal. consumed
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: '#4caf50',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            92%
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Carbs: 45% • Protein: 30% • Fat: 25%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 152, 0, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Hydration
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              2.1L
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Water intake
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: '#ff9800',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            70%
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Target: 3.0L • Last intake: 45 min ago
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ p: 2, bgcolor: darkMode ? 'rgba(0, 150, 136, 0.1)' : 'rgba(0, 150, 136, 0.05)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                          Weight
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                              68.5kg
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Current
                            </Typography>
                          </Box>
                          <Box sx={{ 
                            width: 40, 
                            height: 40, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            bgcolor: '#009688',
                            color: 'white',
                            fontWeight: 'bold'
                          }}>
                            -0.5
                          </Box>
                        </Box>
                        <Box sx={{ mt: 1, pt: 1, borderTop: '1px solid', borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            BMI: 22.4 • Body fat: 18% • Target: 67kg
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                    Health Insights
                  </Typography>
                  
                  <Paper elevation={0} sx={{ p: 2, bgcolor: darkMode ? 'rgba(3, 169, 244, 0.05)' : 'rgba(3, 169, 244, 0.03)', borderRadius: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', color: 'primary.main' }}>
                      Your health statistics summary:
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mt: 1 }}>
                      <Box component="li">
                        <Typography variant="body2" color="text.secondary">
                          You've been <b>consistently active</b> over the past week, exceeding your daily step goal by 24%
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body2" color="text.secondary">
                          Your sleep patterns have improved by <b>45 minutes</b> compared to your monthly average
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body2" color="text.secondary">
                          Your resting heart rate of <b>68 BPM</b> indicates good cardiovascular health
                        </Typography>
                      </Box>
                      <Box component="li">
                        <Typography variant="body2" color="text.secondary">
                          Water intake is <b>below target</b> - try increasing consumption by 0.9L to reach your daily goal
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Medical Recommendations */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#673ab7', mr: 2 }}>
                  <LocalHospitalIcon />
                </Avatar>
                <Typography variant="h6" component="h2">
                  Medical Recommendations
                </Typography>
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Based on your health profile and recent activities, here are some personalized medical recommendations:
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: darkMode ? 'rgba(103, 58, 183, 0.1)' : 'rgba(103, 58, 183, 0.05)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(103, 58, 183, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                        Annual Health Check-up Due
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Your last comprehensive check-up was 11 months ago
                      </Typography>
                    </Box>
                    <Chip 
                      label="High Priority" 
                      size="small" 
                      sx={{ 
                        bgcolor: darkMode ? 'rgba(233, 30, 99, 0.2)' : 'rgba(233, 30, 99, 0.1)',
                        color: '#e91e63',
                        fontWeight: 'medium',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        borderColor: '#673ab7',
                        color: '#673ab7',
                        '&:hover': {
                          borderColor: '#673ab7',
                          bgcolor: 'rgba(103, 58, 183, 0.05)'
                        }
                      }}
                    >
                      Schedule Now
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        color: 'text.secondary'
                      }}
                    >
                      Remind Later
                    </Button>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    bgcolor: darkMode ? 'rgba(103, 58, 183, 0.1)' : 'rgba(103, 58, 183, 0.05)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(103, 58, 183, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                        Covid Vaccination Booster
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        You may be eligible for the latest Covid-19 booster
                      </Typography>
                    </Box>
                    <Chip 
                      label="Recommended" 
                      size="small" 
                      sx={{ 
                        bgcolor: darkMode ? 'rgba(0, 150, 136, 0.2)' : 'rgba(0, 150, 136, 0.1)',
                        color: '#00897b',
                        fontWeight: 'medium',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        borderColor: '#673ab7',
                        color: '#673ab7',
                        '&:hover': {
                          borderColor: '#673ab7',
                          bgcolor: 'rgba(103, 58, 183, 0.05)'
                        }
                      }}
                    >
                      Check Eligibility
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        color: 'text.secondary'
                      }}
                    >
                      More Info
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              {/* Additional recommendations (initially hidden) */}
              <Box id="additional-recommendations" sx={{ display: 'none' }}>
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  All Medical Recommendations
                </Typography>
                
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: darkMode ? 'rgba(103, 58, 183, 0.1)' : 'rgba(103, 58, 183, 0.05)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(103, 58, 183, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                        Dental Check-up Reminder
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        It's been 8 months since your last dental visit
                      </Typography>
                    </Box>
                    <Chip 
                      label="Regular" 
                      size="small" 
                      sx={{ 
                        bgcolor: darkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                        color: '#2196f3',
                        fontWeight: 'medium',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Regular dental check-ups are recommended every 6 months to maintain oral health and prevent complications.
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        borderColor: '#673ab7',
                        color: '#673ab7',
                        '&:hover': {
                          borderColor: '#673ab7',
                          bgcolor: 'rgba(103, 58, 183, 0.05)'
                        }
                      }}
                    >
                      Schedule Appointment
                    </Button>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    mb: 2,
                    bgcolor: darkMode ? 'rgba(103, 58, 183, 0.1)' : 'rgba(103, 58, 183, 0.05)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(103, 58, 183, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                        Vitamin D Test Recommended
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Based on your lifestyle and location
                      </Typography>
                    </Box>
                    <Chip 
                      label="Suggested" 
                      size="small" 
                      sx={{ 
                        bgcolor: darkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)',
                        color: '#ff9800',
                        fontWeight: 'medium',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Indoor lifestyle and limited sun exposure may contribute to vitamin D deficiency, which affects bone health and immunity.
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        borderColor: '#673ab7',
                        color: '#673ab7',
                        '&:hover': {
                          borderColor: '#673ab7',
                          bgcolor: 'rgba(103, 58, 183, 0.05)'
                        }
                      }}
                    >
                      Book Test
                    </Button>
                    <Button
                      variant="text"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        color: 'text.secondary'
                      }}
                    >
                      Learn More
                    </Button>
                  </Box>
                </Box>
                
                <Box
                  sx={{
                    p: 2,
                    bgcolor: darkMode ? 'rgba(103, 58, 183, 0.1)' : 'rgba(103, 58, 183, 0.05)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(103, 58, 183, 0.1)'
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#673ab7' }}>
                        Eye Examination Due
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Last check-up: 22 months ago
                      </Typography>
                    </Box>
                    <Chip 
                      label="Overdue" 
                      size="small" 
                      sx={{ 
                        bgcolor: darkMode ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)',
                        color: '#f44336',
                        fontWeight: 'medium',
                        fontSize: '0.7rem'
                      }} 
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Regular eye examinations are important for early detection of vision problems and eye diseases, especially with your daily screen time.
                  </Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ 
                        borderRadius: 2, 
                        fontSize: '0.7rem', 
                        textTransform: 'none',
                        borderColor: '#673ab7',
                        color: '#673ab7',
                        '&:hover': {
                          borderColor: '#673ab7',
                          bgcolor: 'rgba(103, 58, 183, 0.05)'
                        }
                      }}
                    >
                      Find Eye Specialists
                    </Button>
                  </Box>
                </Box>
              </Box>
              
              <Button
                variant="outlined"
                color="secondary"
                fullWidth
                onClick={() => {
                  const additionalRecommendations = document.getElementById('additional-recommendations');
                  const button = document.getElementById('recommendations-button');
                  
                  if (additionalRecommendations && button) {
                    const isVisible = additionalRecommendations.style.display !== 'none';
                    
                    if (isVisible) {
                      additionalRecommendations.style.display = 'none';
                      button.textContent = 'View All Recommendations';
                    } else {
                      additionalRecommendations.style.display = 'block';
                      button.textContent = 'Show Less';
                    }
                  }
                }}
                id="recommendations-button"
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  color: '#673ab7',
                  borderColor: '#673ab7',
                  '&:hover': {
                    borderColor: '#673ab7',
                    bgcolor: 'rgba(103, 58, 183, 0.05)'
                  }
                }}
              >
                View All Recommendations
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Health Tips */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: darkMode ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: darkMode ? '0 12px 40px rgba(0, 0, 0, 0.4)' : '0 12px 40px rgba(0, 0, 0, 0.15)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar sx={{ bgcolor: '#00bcd4', mr: 2 }}>
                  <TipsAndUpdatesIcon />
                </Avatar>
                <Typography variant="h6" component="h2">
                  Daily Health Tips
                </Typography>
                <Chip 
                  label="New" 
                  size="small" 
                  sx={{ 
                    ml: 1,
                    bgcolor: darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)',
                    color: '#4caf50',
                    fontWeight: 'medium',
                    fontSize: '0.7rem'
                  }} 
                />
              </Box>
              
              <Box id="current-tip">
                <Typography
                  variant="body1"
                  color="text.primary"
                  gutterBottom
                  sx={{ fontWeight: 'medium', mb: 1 }}
                >
                  Sleep and Immune Function
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Adults who sleep less than 7 hours a night are 3 times more likely to develop respiratory infections. 
                  Aim for 7-9 hours of quality sleep to support your immune system's ability to fight off infections
                  and maintain overall health.
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Chip
                    label="Sleep"
                    size="small"
                    sx={{
                      mr: 1,
                      bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                      color: '#00bcd4',
                    }}
                  />
                  <Chip
                    label="Immunity"
                    size="small"
                    sx={{
                      mr: 1,
                      bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                      color: '#00bcd4',
                    }}
                  />
                </Box>
              </Box>
              
              {/* Additional tips (initially hidden) */}
              <Box id="additional-tips" sx={{ display: 'none' }}>
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  More Health Tips
                </Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontWeight: 'medium', mb: 1 }}
                  >
                    Hydration and Cognitive Function
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Even mild dehydration (1-2% of body weight) can impair cognitive performance, 
                    mood, and increase feelings of fatigue. Keep a reusable water bottle with you and 
                    aim to drink at least 2 liters of water throughout the day.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Chip
                      label="Hydration"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                    <Chip
                      label="Brain Health"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontWeight: 'medium', mb: 1 }}
                  >
                    Microbreaks for Productivity
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Taking short 5-minute breaks every hour can increase productivity by up to 30% 
                    and reduce eye strain from screen use. Try the 20-20-20 rule: every 20 minutes, 
                    look at something 20 feet away for 20 seconds.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Chip
                      label="Productivity"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                    <Chip
                      label="Eye Health"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                  </Box>
                </Box>
                
                <Box>
                  <Typography
                    variant="body1"
                    color="text.primary"
                    gutterBottom
                    sx={{ fontWeight: 'medium', mb: 1 }}
                  >
                    Morning Sunlight Exposure
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Getting 10-30 minutes of morning sunlight exposure helps regulate your circadian rhythm, 
                    improve mood, and boost vitamin D production. Try having your morning coffee outside or 
                    taking a short walk after waking up.
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Chip
                      label="Circadian Rhythm"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                    <Chip
                      label="Mental Health"
                      size="small"
                      sx={{
                        mr: 1,
                        bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)',
                        color: '#00bcd4',
                      }}
                    />
                  </Box>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  variant="text"
                  startIcon={<ArrowBackIcon />}
                  sx={{ 
                    color: '#00bcd4',
                    textTransform: 'none',
                    fontWeight: 'medium' 
                  }}
                  onClick={() => {
                    alert('Previous tip shown');
                  }}
                >
                  Previous
                </Button>
                
                <Button
                  id="browse-tips-button"
                  variant="outlined"
                  sx={{ 
                    color: '#00bcd4',
                    borderColor: '#00bcd4',
                    textTransform: 'none',
                    fontWeight: 'medium',
                    px: 2,
                    '&:hover': {
                      borderColor: '#00bcd4',
                      bgcolor: 'rgba(0, 188, 212, 0.05)'
                    }
                  }}
                  onClick={() => {
                    const additionalTips = document.getElementById('additional-tips');
                    const button = document.getElementById('browse-tips-button');
                    
                    if (additionalTips && button) {
                      const isVisible = additionalTips.style.display !== 'none';
                      
                      if (isVisible) {
                        additionalTips.style.display = 'none';
                        button.textContent = 'Browse All Tips';
                      } else {
                        additionalTips.style.display = 'block';
                        button.textContent = 'Show Less';
                      }
                    }
                  }}
                >
                  Browse All Tips
                </Button>
                
                <Button
                  variant="text"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    color: '#00bcd4',
                    textTransform: 'none',
                    fontWeight: 'medium' 
                  }}
                  onClick={() => {
                    alert('Next tip shown');
                  }}
                >
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 