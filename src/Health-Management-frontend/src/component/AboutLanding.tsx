import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Divider, 
  IconButton,
  useMediaQuery,
  Paper
} from '@mui/material';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SecurityIcon from '@mui/icons-material/Security';
import DevicesIcon from '@mui/icons-material/Devices';
import PeopleIcon from '@mui/icons-material/People';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import StorageIcon from '@mui/icons-material/Storage';
import Dashboard from './Dashboard';

const AboutLanding: React.FC = () => {
  const [showDashboard, setShowDashboard] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Wrap component in error boundary
  try {
    const { darkMode } = useTheme();
    const theme = useTheme();
    const isMobile = useMediaQuery('(max-width:600px)');
    const navigate = useNavigate();

    const toggleDashboard = () => {
      setShowDashboard(!showDashboard);
    };

    const goToProjectDetails = () => {
      navigate('/project-details');
    };
    
    const goToOriginalWelcome = () => {
      navigate('/welcome/details');
    };

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
        transition: { type: "spring", stiffness: 50 }
      }
    };

    // If an error occurred during rendering, show a simple fallback
    if (error) {
      return (
        <Box sx={{ 
          p: 4, 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh'
        }}>
          <Typography variant="h5" color="error" gutterBottom>
            Something went wrong loading the welcome page
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Go to Dashboard
          </Button>
        </Box>
      );
    }

    // Return the regular component
    return (
      <Box 
        component="div" 
        sx={{ 
          width: '100%',
          height: 'auto',
          minHeight: '100vh',
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {/* Dashboard slide-up animation */}
        <motion.div
          initial={false}
          animate={{ 
            y: showDashboard ? 0 : '100vh',
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: showDashboard ? '100vh' : '0',
            zIndex: 20,
            backgroundColor: darkMode ? '#121212' : '#ffffff',
            boxShadow: '0 -10px 30px rgba(0,0,0,0.2)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            overflow: 'auto'
          }}
        >
          <Box sx={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center', 
            position: 'sticky',
            top: 0,
            zIndex: 30,
            pt: 1,
            pb: 1,
            backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}>
            <IconButton 
              onClick={toggleDashboard}
              sx={{ 
                backgroundColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                '&:hover': {
                  backgroundColor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                }
              }}
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </Box>
          <Dashboard />
        </motion.div>

        {/* About landing page content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          style={{
            background: darkMode 
              ? 'linear-gradient(135deg, #1a237e 0%, #311b92 50%, #4a148c 100%)' 
              : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'visible',
            paddingBottom: '100px'
          }}
        >
          {/* Animated background gradient */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              overflow: 'hidden',
              zIndex: 0,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: darkMode 
                  ? 'radial-gradient(circle at 30% 40%, rgba(103, 58, 183, 0.5), rgba(63, 81, 181, 0.2) 40%, rgba(33, 150, 243, 0.1) 60%, transparent 70%)'
                  : 'radial-gradient(circle at 30% 40%, rgba(33, 150, 243, 0.3), rgba(3, 169, 244, 0.1) 40%, rgba(0, 188, 212, 0.05) 60%, transparent 70%)',
                animation: 'rotate 20s linear infinite',
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                left: '-50%',
                right: '-50%',
                bottom: '-50%',
                background: darkMode 
                  ? 'radial-gradient(circle at 70% 60%, rgba(156, 39, 176, 0.4), rgba(103, 58, 183, 0.2) 40%, rgba(63, 81, 181, 0.1) 60%, transparent 70%)'
                  : 'radial-gradient(circle at 70% 60%, rgba(3, 169, 244, 0.2), rgba(0, 188, 212, 0.1) 40%, rgba(0, 150, 136, 0.05) 60%, transparent 70%)',
                animation: 'rotate 15s linear infinite reverse',
                '@keyframes rotate': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }
            }}
          />

          {/* Animated floating particles */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            overflow: 'hidden',
            zIndex: 0
          }}>
            {[...Array(30)].map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                sx={{
                  position: 'absolute',
                  width: Math.random() * 12 + 3,
                  height: Math.random() * 12 + 3,
                  borderRadius: '50%',
                  background: darkMode 
                    ? `rgba(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 100 + 50)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.4 + 0.2})`
                    : `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150 + 50)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.3 + 0.1})`,
                  filter: 'blur(2px)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3
                }}
                animate={{
                  y: [0, Math.random() * -100 - 50, 0],
                  x: [0, (Math.random() - 0.5) * 100, 0],
                  opacity: [Math.random() * 0.5 + 0.3, Math.random() * 0.8 + 0.2, Math.random() * 0.5 + 0.3]
                }}
                transition={{
                  duration: Math.random() * 20 + 15,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </Box>

          {/* Hero section */}
          <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: 6, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography 
                    variant="h2" 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 800,
                      color: darkMode ? 'white' : '#0d47a1',
                      textShadow: darkMode ? '0 0 15px rgba(63, 81, 181, 0.5)' : '0 0 10px rgba(33, 150, 243, 0.3)',
                      background: darkMode 
                        ? 'linear-gradient(90deg, #9c27b0, #673ab7, #3f51b5, #2196f3)' 
                        : 'linear-gradient(90deg, #0d47a1, #1976d2, #2196f3, #29b6f6)',
                      backgroundSize: '300% 100%',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      animation: 'gradient 8s ease infinite',
                      '@keyframes gradient': {
                        '0%': { backgroundPosition: '0% 50%' },
                        '50%': { backgroundPosition: '100% 50%' },
                        '100%': { backgroundPosition: '0% 50%' }
                      }
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                  >
                    Health Management System
                    </motion.span>
                  </Typography>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      mb: 4,
                      color: darkMode ? 'rgba(255,255,255,0.9)' : '#37474f',
                      fontWeight: 500,
                      lineHeight: 1.4,
                      position: 'relative',
                      pb: 2,
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '80px',
                        height: '3px',
                        background: darkMode 
                          ? 'linear-gradient(90deg, #9c27b0, #673ab7)' 
                          : 'linear-gradient(90deg, #1976d2, #42a5f5)',
                        borderRadius: '3px',
                        transition: 'width 0.3s ease',
                      },
                      '&:hover::after': {
                        width: '120px'
                      }
                    }}
                  >
                    <motion.span
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                  >
                    A blockchain-powered platform for secure health record management
                    </motion.span>
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="contained"
                        size="large"
                        endIcon={
                          <motion.div
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <KeyboardArrowRightIcon />
                          </motion.div>
                        }
                        onClick={goToOriginalWelcome}
                        sx={{
                          borderRadius: 8,
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                          background: darkMode 
                            ? 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)' 
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            zIndex: 1,
                            animation: 'shine 3s infinite linear',
                            '@keyframes shine': {
                              '0%': { left: '-100%' },
                              '100%': { left: '100%' }
                            }
                          }
                        }}
                      >
                        Learn More
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="large"
                        endIcon={
                          <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <KeyboardArrowUpIcon />
                          </motion.div>
                        }
                        onClick={toggleDashboard}
                        sx={{
                          borderRadius: 8,
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          fontWeight: 600,
                          borderWidth: 2,
                          borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'primary.main',
                          color: darkMode ? 'white' : 'primary.main',
                          '&:hover': {
                            borderColor: darkMode ? 'white' : 'primary.dark',
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.04)',
                            borderWidth: 2
                          }
                        }}
                      >
                        Quick Dashboard
                      </Button>
                    </motion.div>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  variants={itemVariants}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    position: 'relative' 
                  }}
                >
                  {/* Rings around the image */}
                  {[...Array(3)].map((_, index) => (
                    <Box
                      key={`ring-${index}`}
                      component={motion.div}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ 
                        opacity: [0.4, 0.8, 0.4], 
                        scale: [1, 1.05, 1],
                        rotate: [0, 180]
                      }}
                      transition={{
                        duration: 8 + index * 3,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                      sx={{
                        position: 'absolute',
                        width: 320 + index * 30,
                        height: 320 + index * 30,
                        borderRadius: '50%',
                        border: `2px solid ${darkMode ? 'rgba(103, 58, 183, 0.2)' : 'rgba(33, 150, 243, 0.2)'}`,
                        zIndex: 0
                      }}
                    />
                  ))}
                  
                  {/* Animated glow effect */}
                  <Box
                    component={motion.div}
                    animate={{ 
                      opacity: [0.5, 0.8, 0.5],
                      scale: [0.95, 1.05, 0.95]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: "easeInOut"
                    }}
                    sx={{
                      position: 'absolute',
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      background: darkMode 
                        ? 'radial-gradient(circle, rgba(103, 58, 183, 0.3) 0%, rgba(103, 58, 183, 0) 70%)' 
                        : 'radial-gradient(circle, rgba(33, 150, 243, 0.2) 0%, rgba(33, 150, 243, 0) 70%)',
                      filter: 'blur(20px)',
                      zIndex: 0
                    }}
                  />
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                  <Box
                    component="img"
                      src="Image1.png"
                      alt="Medical Consultation Illustration"
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: { xs: '300px', md: '400px' },
                      borderRadius: 4,
                        boxShadow: darkMode 
                          ? '0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(103, 58, 183, 0.3)' 
                          : '0 20px 50px rgba(0,0,0,0.15), 0 0 30px rgba(33, 150, 243, 0.2)',
                      backgroundColor: 'white',
                        padding: 2,
                        position: 'relative',
                        zIndex: 1
                      }}
                    />
                  </motion.div>
                  
                  {/* Animated floating elements */}
                  {[...Array(6)].map((_, i) => (
                    <Box
                      key={`hero-particle-${i}`}
                      component={motion.div}
                      animate={{ 
                        y: [Math.random() * -20, Math.random() * 20],
                        x: [Math.random() * -20, Math.random() * 20],
                        opacity: [0.5, 0.9, 0.5]
                      }}
                      transition={{
                        duration: 3 + Math.random() * 3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: "easeInOut",
                        delay: i * 0.3
                      }}
                      sx={{
                        position: 'absolute',
                        width: 10 + Math.random() * 15,
                        height: 10 + Math.random() * 15,
                        borderRadius: '50%',
                        background: darkMode 
                          ? `rgba(${Math.floor(Math.random() * 155 + 100)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 255)}, 0.6)` 
                          : `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150 + 50)}, ${Math.floor(Math.random() * 255)}, 0.4)`,
                        filter: 'blur(3px)',
                        top: 150 + (Math.random() * 100 - 50),
                        left: '50%',
                        marginLeft: -100 + Math.random() * 200,
                        zIndex: 2
                      }}
                    />
                  ))}
                </motion.div>
              </Grid>
            </Grid>
          </Container>

          {/* Features Section - Add this after the existing hero section */}
          <Container maxWidth="lg" sx={{ pt: 8, pb: 8, position: 'relative', zIndex: 1 }}>
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                component="h2" 
                gutterBottom
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  color: darkMode ? 'white' : '#0d47a1',
                  mb: 5
                }}
              >
                Comprehensive Health Management Features
              </Typography>
            </motion.div>

            <Grid container spacing={4}>
              {/* Core Features Section */}
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={darkMode ? 4 : 2}
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      mb: 4,
                      background: darkMode 
                        ? 'linear-gradient(135deg, rgba(26, 35, 126, 0.9) 0%, rgba(49, 27, 146, 0.9) 100%)' 
                        : 'linear-gradient(135deg, rgba(227, 242, 253, 0.9) 0%, rgba(187, 222, 251, 0.9) 100%)',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(33,150,243,0.1)',
                      position: 'relative',
                      boxShadow: darkMode 
                        ? '0 10px 30px rgba(0,0,0,0.3), 0 0 20px rgba(63, 81, 181, 0.3) inset' 
                        : '0 10px 30px rgba(0,0,0,0.1), 0 0 20px rgba(33, 150, 243, 0.1) inset',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: darkMode 
                          ? '0 15px 35px rgba(0,0,0,0.4), 0 0 30px rgba(63, 81, 181, 0.4) inset' 
                          : '0 15px 35px rgba(0,0,0,0.15), 0 0 30px rgba(33, 150, 243, 0.15) inset',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(76, 175, 80, 0.3) 0%, rgba(76, 175, 80, 0) 70%)' 
                          : 'linear-gradient(135deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0) 70%)',
                        borderRadius: 'inherit',
                        zIndex: 0
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-200%',
                        width: '200%',
                        height: '100%',
                        background: darkMode 
                          ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)' 
                          : 'linear-gradient(90deg, rgba(33,150,243,0) 0%, rgba(33,150,243,0.05) 50%, rgba(33,150,243,0) 100%)',
                        animation: 'shimmer 7s infinite',
                        '@keyframes shimmer': {
                          '0%': { transform: 'translateX(0%)' },
                          '100%': { transform: 'translateX(300%)' }
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        align="center"
                        sx={{ 
                          fontWeight: 'bold',
                          color: darkMode ? 'white' : '#0d47a1',
                          mb: 3,
                          textShadow: darkMode ? '0 0 10px rgba(33,150,243,0.3)' : 'none',
                          position: 'relative',
                          display: 'inline-block',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: '50%',
                            bottom: -8,
                            width: '60px',
                            height: '3px',
                            background: darkMode 
                              ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
                              : 'linear-gradient(90deg, #2196f3, #03a9f4)',
                            borderRadius: '2px',
                            transform: 'translateX(-50%)',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '100px'
                          }
                        }}
                      >
                        <motion.span
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          Core Features
                        </motion.span>
                      </Typography>
                      
                      <Grid container spacing={4} sx={{ mt: 2 }}>
                        {[
                          {
                            icon: <HealthAndSafetyIcon fontSize="large" sx={{ color: '#4caf50' }} />,
                            title: "Secure Health Records",
                            description: "Complete health record management with end-to-end encryption and blockchain verification."
                          },
                          {
                            icon: <SecurityIcon fontSize="large" sx={{ color: '#f44336' }} />,
                            title: "Advanced Security",
                            description: "Military-grade encryption and secure access controls protect your sensitive medical data."
                          },
                          {
                            icon: <PeopleIcon fontSize="large" sx={{ color: '#ff9800' }} />,
                            title: "Provider Collaboration",
                            description: "Seamless sharing with healthcare providers while maintaining full control of your data."
                          },
                          {
                            icon: <DevicesIcon fontSize="large" sx={{ color: '#2196f3' }} />,
                            title: "Cross-Platform Access",
                            description: "Access your health information from any device with our responsive web and mobile applications."
                          },
                          {
                            icon: <SmartphoneIcon fontSize="large" sx={{ color: '#9c27b0' }} />,
                            title: "Mobile Health Management",
                            description: "Manage appointments, medications, and health metrics from your smartphone or tablet."
                          },
                          {
                            icon: <StorageIcon fontSize="large" sx={{ color: '#607d8b' }} />,
                            title: "Blockchain Storage",
                            description: "Immutable record-keeping and distributed storage for enhanced data integrity and availability."
                          }
                        ].map((feature, index) => (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ 
                                scale: 1.05,
                                transition: { duration: 0.2 }
                              }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Card 
                                elevation={darkMode ? 2 : 1}
                                sx={{ 
                                  height: '100%',
                                  borderRadius: 3,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  background: darkMode ? 'rgba(30, 30, 40, 0.7)' : 'white',
                                  backdropFilter: 'blur(10px)',
                                  transition: 'all 0.3s ease',
                                  border: darkMode 
                                    ? '1px solid rgba(255,255,255,0.1)' 
                                    : '1px solid rgba(0,0,0,0.05)',
                                  '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '5px',
                                    background: index % 2 === 0 
                                      ? 'linear-gradient(90deg, #4caf50, #8bc34a)' 
                                      : 'linear-gradient(90deg, #2196f3, #03a9f4)',
                                    transition: 'opacity 0.3s ease',
                                    opacity: 0.8
                                  },
                                  '&:hover::before': {
                                    opacity: 1
                                  }
                                }}
                              >
                                <CardContent sx={{ p: 3 }}>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                      mb: 2
                                    }}
                                  >
                                    <Avatar
                                      sx={{
                                        bgcolor: darkMode ? 'rgba(30, 30, 40, 0.7)' : 'rgba(33, 150, 243, 0.1)',
                                        width: 56,
                                        height: 56,
                                        mr: 2,
                                        boxShadow: darkMode 
                                          ? '0 0 15px rgba(255,255,255,0.1)' 
                                          : '0 0 15px rgba(0,0,0,0.05)'
                                      }}
                                    >
                                      {feature.icon}
                                    </Avatar>
                                    <Typography 
                                      variant="h6" 
                                      component="h4"
                                      sx={{ 
                                        fontWeight: 'bold',
                                        color: darkMode ? 'white' : '#0d47a1'
                                      }}
                                    >
                                      {feature.title}
                                    </Typography>
                                  </Box>
                                  <Typography 
                                    variant="body1"
                                    sx={{ 
                                      color: darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                                      fontSize: '0.95rem',
                                      lineHeight: 1.5
                                    }}
                                  >
                                    {feature.description}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Advanced Features Section */}
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={darkMode ? 3 : 1}
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      mb: 4,
                      background: darkMode ? 'rgba(26, 35, 126, 0.7)' : 'white',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none',
                      position: 'relative',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: darkMode 
                          ? 'linear-gradient(135deg, rgba(255, 152, 0, 0.3) 0%, rgba(255, 152, 0, 0) 70%)' 
                          : 'linear-gradient(135deg, rgba(255, 152, 0, 0.1) 0%, rgba(255, 152, 0, 0) 70%)',
                        borderRadius: 'inherit',
                        zIndex: 0
                      },
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-200%',
                        width: '200%',
                        height: '100%',
                        background: darkMode 
                          ? 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%)' 
                          : 'linear-gradient(90deg, rgba(33,150,243,0) 0%, rgba(33,150,243,0.05) 50%, rgba(33,150,243,0) 100%)',
                        animation: 'shimmer 7s infinite',
                        '@keyframes shimmer': {
                          '0%': { transform: 'translateX(0%)' },
                          '100%': { transform: 'translateX(300%)' }
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          color: darkMode ? 'white' : '#0d47a1',
                          fontWeight: 'bold',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: 'linear-gradient(90deg, #4caf50, #a5d6a7)',
                            borderRadius: 2
                          }
                        }}
                      >
                        Advanced Security & Integration
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[
                          {
                            title: "Blockchain Security",
                            description: "Your health records are secured using blockchain technology, ensuring data integrity, immutability, and tamper-proof storage."
                          },
                          {
                            title: "ABHA Integration",
                            description: "Seamlessly integrate with Ayushman Bharat Health Account (ABHA) to access and share your health records securely across healthcare providers."
                          },
                          {
                            title: "Personalized Notifications",
                            description: "Receive timely alerts for medication reminders, appointment schedules, health updates, and important medical information."
                          },
                          {
                            title: "Multi-Profile Management",
                            description: "Manage health records for your entire family with separate profiles, perfect for parents monitoring children's health or caregivers."
                          },
                          {
                            title: "Environmental Health Insights",
                            description: "Get personalized health recommendations based on local weather conditions and environmental factors that may affect your wellbeing."
                          },
                          {
                            title: "Data Sharing Controls",
                            description: "Maintain complete control over who can access your health data with granular permissions and time-limited access options."
                          }
                        ].map((feature, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)', 
                                  color: '#4caf50',
                                  mr: 2
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  component="h4" 
                                  gutterBottom
                                  sx={{ 
                                    color: darkMode ? 'white' : '#0d47a1',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Typography 
                                  variant="body1"
                                  sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                  }}
                                >
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>

              {/* Future Roadmap Section */}
              <Grid item xs={12}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={darkMode ? 3 : 1}
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: darkMode ? 'rgba(26, 35, 126, 0.7)' : 'white',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          color: darkMode ? 'white' : '#0d47a1',
                          fontWeight: 'bold',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: 'linear-gradient(90deg, #9c27b0, #ce93d8)',
                            borderRadius: 2
                          }
                        }}
                      >
                        Future Roadmap
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[
                          {
                            title: "Advanced AI Diagnostics",
                            description: "Coming soon: Enhanced AI-powered diagnostic tools that can analyze medical images and provide preliminary assessments."
                          },
                          {
                            title: "Genomic Integration",
                            description: "Future support for integrating genomic data to provide personalized health recommendations based on genetic factors."
                          },
                          {
                            title: "Wearable Device Ecosystem",
                            description: "Expanded integration with wearable health devices for real-time health monitoring and automated data collection."
                          },
                          {
                            title: "Community Health Networks",
                            description: "Connect with others who have similar health conditions to share experiences and support in a secure environment."
                          }
                        ].map((feature, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)', 
                                  color: '#9c27b0',
                                  mr: 2
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  component="h4" 
                                  gutterBottom
                                  sx={{ 
                                    color: darkMode ? 'white' : '#0d47a1',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Typography 
                                  variant="body1"
                                  sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                  }}
                                >
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              
              {/* Additional User-Focused Features Section */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={darkMode ? 3 : 1}
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: darkMode ? 'rgba(26, 35, 126, 0.7)' : 'white',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          color: darkMode ? 'white' : '#0d47a1',
                          fontWeight: 'bold',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: 'linear-gradient(90deg, #ff9800, #ffcc80)',
                            borderRadius: 2
                          }
                        }}
                      >
                        Personalized Health Experience
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[
                          {
                            title: "Medical Recommendations",
                            description: "Receive personalized medical recommendations based on your health profile, historical data, and current conditions."
                          },
                          {
                            title: "Daily Health Tips",
                            description: "Access curated health advice tailored to your specific health needs, goals, and demographics."
                          },
                          {
                            title: "Weather Health Tips",
                            description: "Get real-time health suggestions based on local weather conditions, pollution levels, and seasonal health risks."
                          },
                          {
                            title: "Advanced Symptom Analyzer",
                            description: "Interactive tool that helps identify possible conditions based on reported symptoms with severity assessment."
                          },
                          {
                            title: "Dark/Light Mode",
                            description: "Customize your visual experience with eye-friendly dark mode for nighttime use or light mode for daytime clarity."
                          },
                          {
                            title: "Profile Management",
                            description: "Create and manage multiple health profiles for family members with individual privacy settings and data controls."
                          }
                        ].map((feature, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: darkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)', 
                                  color: '#ff9800',
                                  mr: 2
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  component="h4" 
                                  gutterBottom
                                  sx={{ 
                                    color: darkMode ? 'white' : '#0d47a1',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Typography 
                                  variant="body1"
                                  sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                  }}
                                >
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
              
              {/* User Interface Features Section */}
              <Grid item xs={12} sx={{ mt: 4 }}>
                <motion.div variants={itemVariants}>
                  <Card 
                    elevation={darkMode ? 3 : 1}
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      background: darkMode ? 'rgba(26, 35, 126, 0.7)' : 'white',
                      border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Typography 
                        variant="h4" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          color: darkMode ? 'white' : '#0d47a1',
                          fontWeight: 'bold',
                          position: 'relative',
                          '&:after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -8,
                            left: 0,
                            width: 60,
                            height: 4,
                            background: 'linear-gradient(90deg, #00bcd4, #80deea)',
                            borderRadius: 2
                          }
                        }}
                      >
                        User Interface & Accessibility
                      </Typography>

                      <Grid container spacing={3} sx={{ mt: 2 }}>
                        {[
                          {
                            title: "Responsive Design",
                            description: "Optimized for all devices from desktop to mobile, ensuring your health data is accessible anywhere, anytime."
                          },
                          {
                            title: "Intuitive Dashboard",
                            description: "User-friendly interface with personalized widgets and quick access to your most important health information."
                          },
                          {
                            title: "Accessibility Features",
                            description: "Screen reader support, keyboard navigation, and high contrast options for users with diverse accessibility needs."
                          },
                          {
                            title: "Theme Customization",
                            description: "Beyond just dark/light mode, customize color schemes and layout preferences to suit your visual comfort."
                          }
                        ].map((feature, index) => (
                          <Grid item xs={12} md={6} key={index}>
                            <Box sx={{ display: 'flex', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: darkMode ? 'rgba(0, 188, 212, 0.2)' : 'rgba(0, 188, 212, 0.1)', 
                                  color: '#00bcd4',
                                  mr: 2
                                }}
                              >
                                {index + 1}
                              </Avatar>
                              <Box>
                                <Typography 
                                  variant="h6" 
                                  component="h4" 
                                  gutterBottom
                                  sx={{ 
                                    color: darkMode ? 'white' : '#0d47a1',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Typography 
                                  variant="body1"
                                  sx={{ 
                                    color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                  }}
                                >
                                  {feature.description}
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            </Grid>
          </Container>

          {/* Mission section */}
          <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={5}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h3"
                    component="h2"
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: darkMode ? 'white' : '#0d47a1' 
                    }}
                  >
                    Our Mission
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontSize: '1.1rem',
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.primary' 
                    }}
                  >
                    We're revolutionizing healthcare data management by putting patients at the center of their health information ecosystem.
                  </Typography>
                  <Typography 
                    variant="body1" 
                    paragraph
                    sx={{ 
                      fontSize: '1.1rem',
                      color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.primary' 
                    }}
                  >
                    Our blockchain-based platform empowers individuals to securely store, access, and share their complete medical records while maintaining full control and privacy.
                  </Typography>
                  <Box sx={{ mt: 4 }}>
                    <Card 
                      sx={{ 
                        borderRadius: 2,
                        p: 2,
                        backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.1)' : 'rgba(76, 175, 80, 0.05)',
                        border: '1px solid',
                        borderColor: darkMode ? 'rgba(76, 175, 80, 0.3)' : 'rgba(76, 175, 80, 0.2)'
                      }}
                    >
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontStyle: 'italic',
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary' 
                        }}
                      >
                        "Working towards a future where healthcare data flows seamlessly and securely between patients and providers, eliminating fragmentation and improving outcomes."
                      </Typography>
                    </Card>
                  </Box>
                </motion.div>
              </Grid>
              <Grid item xs={12} md={7}>
                <motion.div variants={itemVariants}>
                  <Box
                    sx={{ 
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                      background: darkMode ? '#1e1e1e' : 'white',
                      p: 3
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom color="primary" fontWeight="bold">
                          Addressing Key Healthcare Challenges
                        </Typography>
                      </Grid>
                      
                      {[
                        { 
                          title: "Fragmented Health Data", 
                          description: "Consolidating scattered medical records into a single secure platform" 
                        },
                        { 
                          title: "Data Security", 
                          description: "Using blockchain technology to prevent breaches and unauthorized access" 
                        },
                        { 
                          title: "Patient Control", 
                          description: "Giving individuals ownership of their complete medical history" 
                        },
                        { 
                          title: "Interoperability", 
                          description: "Enabling seamless data sharing between healthcare systems" 
                        }
                      ].map((item, idx) => (
                        <Grid item xs={12} sm={6} key={idx}>
                          <Card 
                            sx={{ 
                              height: '100%',
                              p: 2,
                              backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.6)' : 'rgba(240, 240, 240, 0.5)',
                              border: darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none'
                            }}
                          >
                            <Typography variant="subtitle1" gutterBottom fontWeight="bold" color="text.primary">
                              {item.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {item.description}
                            </Typography>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>

          {/* Target users section */}
          <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                component="h2"
                align="center"
                gutterBottom
                sx={{ 
                  mb: 4, 
                  fontWeight: 'bold',
                  color: darkMode ? 'white' : '#0d47a1' 
                }}
              >
                Who We Serve
              </Typography>
              <Typography 
                variant="h6" 
                align="center"
                sx={{ 
                  mb: 6,
                  maxWidth: '800px',
                  mx: 'auto',
                  color: darkMode ? 'rgba(255,255,255,0.8)' : 'text.secondary' 
                }}
              >
                Our platform addresses the needs of diverse stakeholders in the healthcare ecosystem
              </Typography>
            </motion.div>
          </Container>

          {/* Call to action */}
          <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
            <motion.div variants={itemVariants}>
              <Card 
                sx={{ 
                  borderRadius: 4,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
                  background: darkMode 
                    ? 'linear-gradient(135deg, #283593 0%, #1a237e 100%)' 
                    : 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                <CardContent sx={{ p: { xs: 4, md: 6 }, position: 'relative', zIndex: 2 }}>
                  <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography 
                        variant="h3" 
                        component="h2" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          color: 'white' 
                        }}
                      >
                        Ready to learn more about our platform?
                      </Typography>
                      <Typography 
                        variant="h6"
                        paragraph
                        sx={{ color: 'rgba(255,255,255,0.9)' }}
                      >
                        Discover how Health Management System can transform your healthcare experience
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            endIcon={<KeyboardArrowRightIcon />}
                            onClick={goToOriginalWelcome}
                            sx={{
                              borderRadius: 8,
                              py: 1.5,
                              px: 4,
                              fontSize: '1.1rem',
                              backgroundColor: 'white',
                              color: '#1565c0',
                              '&:hover': {
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                              }
                            }}
                          >
                            Project Details
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="outlined"
                            size="large"
                            endIcon={<KeyboardArrowUpIcon />}
                            onClick={toggleDashboard}
                            sx={{
                              borderRadius: 8,
                              py: 1.5,
                              px: 4,
                              fontSize: '1.1rem',
                              borderColor: 'rgba(255,255,255,0.7)',
                              color: 'white',
                              '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                              }
                            }}
                          >
                            Dashboard
                          </Button>
                        </motion.div>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
                
                {/* Background decoration */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: '-20%',
                    right: '-10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.05)',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: '-30%',
                    left: '-10%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.07)',
                    zIndex: 1
                  }}
                />
              </Card>
            </motion.div>
          </Container>

          {/* Footer */}
          <Box 
            component="footer" 
            sx={{ 
              py: 3, 
              textAlign: 'center',
              backgroundColor: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              zIndex: 1,
              mt: 4
            }}
          >
            <Container maxWidth="lg">
              <Typography 
                variant="body2" 
                color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
              >
                © {new Date().getFullYear()} Health Management System. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </motion.div>
      </Box>
    );
  } catch (err) {
    console.error("Error rendering AboutLanding:", err);
    
    // Don't use state here as it won't update during render, directly return UI
    return (
      <Box sx={{ 
        p: 4, 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <Typography variant="h5" color="error" gutterBottom>
          Something went wrong loading the landing page
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.hash = "#/dashboard"}
          sx={{ mt: 2 }}
        >
          Go to Dashboard
        </Button>
      </Box>
    );
  }
};

export default AboutLanding; 