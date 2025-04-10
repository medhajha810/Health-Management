import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useMediaQuery,
  Avatar
} from '@mui/material';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SecurityIcon from '@mui/icons-material/Security';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DevicesIcon from '@mui/icons-material/Devices';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import HealingIcon from '@mui/icons-material/Healing';

// Helper function to get gradient color based on index and dark mode
const getGradientColor = (index: number, darkMode: boolean) => {
  const gradients = [
    {
      dark: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
      light: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    },
    {
      dark: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
      light: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'
    },
    {
      dark: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)',
      light: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'
    },
    {
      dark: 'linear-gradient(135deg, #4481eb 0%, #04befe 100%)',
      light: 'linear-gradient(135deg, #c2e9fb 0%, #a1c4fd 100%)'
    },
    {
      dark: 'linear-gradient(135deg, #f77062 0%, #fe5196 100%)',
      light: 'linear-gradient(135deg, #feb2b2 0%, #f687b3 100%)'
    },
    {
      dark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      light: 'linear-gradient(135deg, #c1dfc4 0%, #deecdd 100%)'
    }
  ];
  
  const idx = index % gradients.length;
  return darkMode ? gradients[idx].dark : gradients[idx].light;
};

// Helper function to get icon color based on index and dark mode
const getIconColor = (index: number, darkMode: boolean) => {
  const colors = [
    { dark: '#6a11cb', light: '#a18cd1' },
    { dark: '#30cfd0', light: '#89f7fe' },
    { dark: '#ff0844', light: '#ff9a9e' },
    { dark: '#4481eb', light: '#c2e9fb' },
    { dark: '#f77062', light: '#feb2b2' },
    { dark: '#667eea', light: '#c1dfc4' }
  ];
  
  const idx = index % colors.length;
  return darkMode ? colors[idx].dark : colors[idx].light;
};

// Helper function to get icon based on icon name
const getIcon = (iconName: string, styles: { color: string, fontSize: string | number }) => {
  switch(iconName) {
    case 'security':
      return <SecurityIcon sx={styles} />;
    case 'health':
      return <HealthAndSafetyIcon sx={styles} />;
    case 'medical':
      return <MedicalServicesIcon sx={styles} />;
    case 'devices':
      return <DevicesIcon sx={styles} />;
    case 'hospital':
      return <LocalHospitalIcon sx={styles} />;
    case 'healing':
      return <HealingIcon sx={styles} />;
    default:
      return <HealthAndSafetyIcon sx={styles} />;
  }
};

const LandingPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  
  try {
    const { darkMode } = useTheme();
    const navigate = useNavigate();

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          delayChildren: 0.3,
          staggerChildren: 0.2
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

    const benefits = [
      "Secure storage of all your medical records in one place",
      "Easy sharing with healthcare providers when needed",
      "Complete control over who can access your health data",
      "Seamless integration with existing healthcare systems",
      "Enhanced privacy with blockchain technology",
      "AI-powered analysis for health insights and predictions"
    ];

    const technologies = [
      {
        name: "Blockchain Storage",
        description: "Utilizes Internet Computer Protocol (ICP) to store health records securely and immutably on a decentralized network",
        icon: <SecurityIcon fontSize="large" color="primary" />
      },
      {
        name: "AI Integration",
        description: "Leverages machine learning models to analyze health data and provide insights on potential health risks and recommendations",
        icon: <AnalyticsIcon fontSize="large" color="primary" />
      },
      {
        name: "Interoperable Standards",
        description: "Supports industry-standard FHIR protocols enabling seamless data exchange between healthcare providers and systems globally",
        icon: <MedicalServicesIcon fontSize="large" color="primary" />
      },
      {
        name: "Cross-Platform Access",
        description: "Access your complete health information securely on any device with responsive design optimized for desktop, tablet, and mobile",
        icon: <DevicesIcon fontSize="large" color="primary" />
      }
    ];

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
            Something went wrong loading the project details
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

    return (
      <Box sx={{ 
        background: darkMode 
          ? 'linear-gradient(135deg, #051937 0%, #004d7a 30%, #008793 70%, #00bf72 100%)' 
          : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 30%, #bce0ee 70%, #a8edea 100%)',
        minHeight: '100vh',
        pt: 8,
        pb: 10,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: darkMode
            ? `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            : `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231976d2' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          opacity: 0.5,
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode
            ? 'radial-gradient(circle at 80% 20%, rgba(0, 187, 255, 0.1) 0%, rgba(0, 130, 255, 0) 30%), radial-gradient(circle at 20% 60%, rgba(0, 255, 209, 0.1) 0%, rgba(0, 245, 171, 0) 30%)'
            : 'radial-gradient(circle at 80% 20%, rgba(33, 150, 243, 0.1) 0%, rgba(33, 150, 243, 0) 30%), radial-gradient(circle at 20% 60%, rgba(0, 188, 212, 0.08) 0%, rgba(0, 188, 212, 0) 30%)',
          zIndex: 0
        }
      }}>
        {/* Floating decorative elements */}
        {[...Array(25)].map((_, index) => (
          <Box
            key={`bg-element-${index}`}
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0.3, 0.8, 0.3],
              x: [0, Math.random() * 60 - 30],
              y: [0, Math.random() * 60 - 30],
              rotate: [0, Math.random() * 360]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: index * 0.3
            }}
            sx={{
              position: 'absolute',
              width: 20 + Math.random() * 100,
              height: 20 + Math.random() * 100,
              borderRadius: Math.random() > 0.5 ? '50%' : Math.random() > 0.5 ? '20%' : '5px',
              background: darkMode
                ? `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.2 + 0.05})`
                : `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.floor(Math.random() * 255)}, ${Math.random() * 0.15 + 0.03})`,
              filter: 'blur(8px)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              zIndex: 0
            }}
          />
        ))}
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header Section - Main Title */}
            <motion.div variants={itemVariants} 
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <Box sx={{ 
                position: 'relative', 
                mb: 4,
                padding: '10px 20px',
                borderRadius: 2,
                backgroundColor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.2)',
                boxShadow: darkMode ? '0 0 25px rgba(33, 150, 243, 0.2)' : '0 0 25px rgba(3, 169, 244, 0.1)',
              }}>
              <Typography 
                variant="h2" 
                component="h1" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                    mb: 1,
                    color: darkMode ? '#e3f2fd' : '#01579b',
                    textShadow: darkMode ? '0 2px 10px rgba(33, 150, 243, 0.5)' : '0 2px 10px rgba(3, 169, 244, 0.3)',
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <motion.span
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    style={{ display: 'block' }}
              >
                Welcome to Health Management System
                  </motion.span>
              </Typography>
                
                {/* Animated underline for the heading */}
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Box
                    sx={{
                      height: '3px',
                      borderRadius: '3px',
                      background: darkMode 
                        ? 'linear-gradient(90deg, #00b8d4, #2196f3, #3f51b5)'
                        : 'linear-gradient(90deg, #01579b, #0277bd, #0288d1)',
                      margin: '0 auto',
                      position: 'relative',
                    }}
                  />
                </motion.div>
              </Box>
            </motion.div>

            {/* Subtitle */}
              <Typography 
                variant="h5" 
                align="center"
                sx={{ 
                  mb: 3,
                color: darkMode ? 'rgba(255,255,255,0.9)' : '#37474f',
                  maxWidth: '800px',
                mx: 'auto',
                position: 'relative',
                textShadow: darkMode ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 3,
                  background: darkMode 
                    ? 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.7), transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(1, 87, 155, 0.7), transparent)',
                  borderRadius: 2,
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { opacity: 0.5, width: 80 },
                    '50%': { opacity: 1, width: 180 },
                    '100%': { opacity: 0.5, width: 80 }
                  }
                }
              }}
            >
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                style={{ display: 'block' }}
              >
                A revolutionary blockchain-based platform that puts you in control of your health data
              </motion.span>
              </Typography>
              
            {/* Top Dashboard Button */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 4 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ position: 'relative' }}
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      '0 0 0 0 rgba(33, 150, 243, 0)', 
                      '0 0 0 15px rgba(33, 150, 243, 0.3)', 
                      '0 0 0 0 rgba(33, 150, 243, 0)'
                    ]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'loop',
                    ease: 'easeInOut'
                  }}
                  style={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '100%',
                    borderRadius: '40px',
                    zIndex: 0
                  }}
                />
                <Button
                  variant="contained"
                  size="large"
                  endIcon={
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowForwardIcon />
                    </motion.div>
                  }
                  onClick={() => navigate('/dashboard')}
                  sx={{
                    borderRadius: 8,
                    py: 1.5,
                    px: 6,
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    background: darkMode 
                      ? 'linear-gradient(45deg, #2196f3 30%, #03a9f4 90%)' 
                      : 'linear-gradient(45deg, #0277bd 30%, #01579b 90%)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                      animation: 'sweep 3s linear infinite',
                      '@keyframes sweep': {
                        '0%': { left: '-100%' },
                        '100%': { left: '100%' },
                      }
                    }
                  }}
                >
                  Enter Dashboard
                </Button>
              </motion.div>
            </Box>

            {/* Header image - Healthcare Professional */}
            <Box
                sx={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                  mb: 6,
                mt: 2,
                position: 'relative'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <Box
                  component="img"
                  src="image2.png"
                  alt="Cute Nurse Healthcare Professional"
                  sx={{
                    maxWidth: '100%',
                    height: 'auto',
                    maxHeight: 350,
                    borderRadius: 3,
                    boxShadow: darkMode 
                      ? '0 10px 30px rgba(0,0,0,0.4)'
                      : '0 10px 30px rgba(0,0,0,0.15)',
                    filter: darkMode ? 'brightness(0.9)' : 'none',
                    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: darkMode 
                        ? '0 15px 35px rgba(0, 0, 0, 0.5)'
                        : '0 15px 35px rgba(0, 0, 0, 0.2)',
                    }
                }}
              />
            </motion.div>
              
              {/* Shimmering accent */}
              <Box
                component={motion.div}
                animate={{
                  opacity: [0.4, 0.8, 0.4],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                sx={{
                  position: 'absolute',
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  background: darkMode 
                    ? 'radial-gradient(circle, rgba(33, 150, 243, 0.3) 0%, rgba(33, 150, 243, 0) 70%)'
                    : 'radial-gradient(circle, rgba(1, 87, 155, 0.2) 0%, rgba(1, 87, 155, 0) 70%)',
                  filter: 'blur(15px)',
                  top: -20,
                  right: { xs: '10%', md: '25%' },
                  zIndex: 0
                }}
              />
            </Box>

            {/* Main Content */}
            <Grid container spacing={6} sx={{ mb: 8 }}>
              {/* Project Overview */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper 
                    elevation={darkMode ? 2 : 1}
                    sx={{ 
                      p: 4, 
                      borderRadius: 4,
                      height: '100%',
                      backgroundColor: darkMode ? 'rgba(42, 42, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: darkMode ? 'white' : '#01579b'
                      }}
                    >
                      About The Project
                    </Typography>
                    
                    {/* About illustration */}
                    <Box
                      component="img"
                      src="image3.png"
                      alt="Healthcare Technology Illustration"
                      sx={{ 
                        display: 'block',
                        width: '100%',
                        maxHeight: '180px',
                        objectFit: 'cover',
                        mx: 'auto',
                        my: 3,
                        borderRadius: 2
                      }}
                    />
                    
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ fontSize: '1.1rem', color: 'text.primary' }}
                    >
                      The Health Management System is a state-of-the-art platform built to address the fragmented nature of healthcare records and put patients at the center of their healthcare journey.
                    </Typography>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ fontSize: '1.1rem', color: 'text.primary' }}
                    >
                      Our system leverages blockchain technology to provide a secure, immutable, and patient-controlled health record management solution that integrates seamlessly with existing healthcare systems.
                    </Typography>
                    <Typography 
                      variant="body1" 
                      paragraph
                      sx={{ fontSize: '1.1rem', color: 'text.primary' }}
                    >
                      With advanced features like AI-powered health insights, secure data sharing, and compatibility with national health ID systems, we're transforming how healthcare information is managed and accessed.
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Benefits */}
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Paper 
                    elevation={darkMode ? 2 : 1}
                    sx={{ 
                      p: 4, 
                      borderRadius: 4,
                      height: '100%',
                      backgroundColor: darkMode ? 'rgba(42, 42, 42, 0.8)' : 'rgba(255, 255, 255, 0.9)'
                    }}
                  >
                    <Typography 
                      variant="h4" 
                      component="h2" 
                      gutterBottom
                      sx={{ 
                        fontWeight: 'bold',
                        color: darkMode ? 'white' : '#01579b'
                      }}
                    >
                      Key Benefits
                    </Typography>
                    <List>
                      {benefits.map((benefit, index) => (
                        <ListItem key={index} sx={{ py: 1 }}>
                          <ListItemIcon>
                            <CheckCircleOutlineIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText 
                            primary={benefit} 
                            primaryTypographyProps={{ 
                              fontSize: '1.1rem', 
                              color: 'text.primary' 
                            }} 
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            {/* Technology Cards */}
            <motion.div variants={itemVariants} style={{ marginBottom: '80px' }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 6,
                  color: darkMode ? 'white' : '#01579b',
                  textShadow: darkMode ? '0 0 15px rgba(33, 150, 243, 0.3)' : 'none',
                }}
              >
                Key Technologies
              </Typography>

              <Grid container spacing={4}>
              {technologies.map((tech, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      whileHover={{ 
                        y: -8,
                        scale: 1.02,
                        transition: {
                          duration: 0.2
                        }
                      }}
                      whileTap={{ scale: 0.98 }}
                    >
                    <Card 
                        elevation={darkMode ? 5 : 2}
                      sx={{ 
                        borderRadius: 4,
                          overflow: 'hidden',
                          position: 'relative',
                          height: '100%',
                          background: getGradientColor(index + 2, darkMode),
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: darkMode ? 'rgba(10, 10, 15, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            zIndex: 1
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '300%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                            animation: 'shimmer 8s infinite linear',
                            '@keyframes shimmer': {
                              '0%': { transform: 'translateX(0%)' },
                              '100%': { transform: 'translateX(50%)' }
                            },
                            zIndex: 2
                          },
                          boxShadow: `0 5px 15px rgba(0,0,0,0.15), 0 0 5px ${getIconColor(index + 2, darkMode)}`
                        }}
                      >
                        <CardContent sx={{ p: 4, position: 'relative', zIndex: 3 }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              mb: 2,
                              background: `linear-gradient(135deg, ${getIconColor(index + 2, darkMode)}33, ${getIconColor(index + 2, darkMode)}11)`,
                              borderRadius: '50%',
                              width: 60,
                              height: 60,
                              justifyContent: 'center',
                              alignItems: 'center',
                              boxShadow: `0 5px 15px rgba(0,0,0,0.1), 0 0 8px ${getIconColor(index + 2, darkMode)}66`,
                            }}
                          >
                            <Box
                              component={motion.div}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.8, ease: "easeInOut" }}
                            >
                              {React.cloneElement(tech.icon, { 
                                fontSize: 'large', 
                                sx: { 
                                  color: getIconColor(index + 2, darkMode),
                                  filter: `drop-shadow(0 0 2px ${getIconColor(index + 2, darkMode)}66)`
                                } 
                              })}
                            </Box>
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                            sx={{ 
                              fontWeight: 'bold', 
                              color: darkMode ? 'white' : '#01579b',
                              position: 'relative',
                              display: 'inline-block',
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -4,
                                left: 0,
                                height: 2,
                                width: '40%',
                                background: getIconColor(index + 2, darkMode),
                                transition: 'width 0.3s ease',
                                borderRadius: 1
                              },
                              '&:hover::after': {
                                width: '100%'
                              }
                            }}
                        >
                          {tech.name}
                        </Typography>
                          <Typography 
                            variant="body1" 
                            color={darkMode ? 'rgba(255, 255, 255, 0.8)' : 'text.secondary'}
                            sx={{
                              lineHeight: 1.6,
                              '& > span': {
                                color: getIconColor(index + 2, darkMode),
                                fontWeight: 'medium'
                              }
                            }}
                          >
                          {tech.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
            </motion.div>

            {/* Technology Stack */}
            <motion.div variants={itemVariants} style={{ marginBottom: '80px' }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 6,
                  color: darkMode ? 'white' : '#01579b',
                  textShadow: darkMode ? '0 0 15px rgba(33, 150, 243, 0.3)' : 'none',
                }}
              >
                Advanced Technology Stack
              </Typography>
              
              <Paper
                elevation={darkMode ? 6 : 2}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  position: 'relative',
                  background: darkMode ? 'rgba(15, 15, 25, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  p: 4,
                  boxShadow: darkMode 
                    ? '0 15px 40px rgba(0,0,0,0.3), 0 0 15px rgba(33, 150, 243, 0.3) inset' 
                    : '0 15px 40px rgba(0,0,0,0.1), 0 0 15px rgba(33, 150, 243, 0.1) inset',
                  borderTop: '4px solid',
                  borderImage: darkMode 
                    ? 'linear-gradient(90deg, #00bcd4, #3f51b5, #7c4dff) 1' 
                    : 'linear-gradient(90deg, #039be5, #0288d1, #0277bd) 1',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: darkMode
                      ? 'radial-gradient(circle at 10% 90%, rgba(33, 150, 243, 0.15), transparent 40%), radial-gradient(circle at 90% 10%, rgba(156, 39, 176, 0.1), transparent 40%)'
                      : 'radial-gradient(circle at 10% 90%, rgba(33, 150, 243, 0.07), transparent 40%), radial-gradient(circle at 90% 10%, rgba(0, 188, 212, 0.05), transparent 40%)',
                    zIndex: 0
                  }
                }}
              >
                <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                  <Grid item xs={12} md={6}>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          color: darkMode ? '#90caf9' : '#01579b',
                          mb: 3,
                          position: 'relative',
                          display: 'inline-block',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: -8,
                            width: '50px',
                            height: '3px',
                            background: 'linear-gradient(90deg, #2196f3, #90caf9)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '100%'
                          }
                        }}
                      >
                        Frontend Technologies
                      </Typography>
                      
                      <List>
                        {[
                          {
                            name: "React.js & TypeScript",
                            desc: "Modern, type-safe frontend development for reliable user interfaces"
                          },
                          {
                            name: "Material UI",
                            desc: "Advanced component library for accessible and responsive design"
                          },
                          {
                            name: "Framer Motion",
                            desc: "Powerful animation library for enhanced user experience"
                          },
                          {
                            name: "Chart.js",
                            desc: "Interactive data visualization for health analytics"
                          }
                        ].map((tech, idx) => (
                          <ListItem key={idx} disableGutters sx={{ mb: 2 }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                              style={{ width: '100%' }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                p: 2, 
                                borderRadius: 2,
                                background: darkMode ? 'rgba(30, 40, 60, 0.4)' : 'rgba(240, 247, 255, 0.7)',
                                border: '1px solid',
                                borderColor: darkMode ? 'rgba(33, 150, 243, 0.2)' : 'rgba(33, 150, 243, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: darkMode ? 'rgba(33, 150, 243, 0.15)' : 'rgba(33, 150, 243, 0.07)',
                                  transform: 'translateY(-3px)',
                                  boxShadow: darkMode 
                                    ? '0 5px 15px rgba(0,0,0,0.3)' 
                                    : '0 5px 15px rgba(0,0,0,0.05)'
                                },
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '200%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                  transition: 'all 0.3s ease',
                                  transform: 'translateX(-100%)'
                                },
                                '&:hover::after': {
                                  transform: 'translateX(100%)',
                                  transition: 'all 1s ease'
                                }
                              }}>
                                <Typography 
                                  variant="h6" 
                                  component="span"
                                  sx={{ 
                                    fontWeight: 'bold',
                                    color: darkMode ? '#90caf9' : '#1976d2',
                                    mb: 0.5
                                  }}
                                >
                                  {tech.name}
                                </Typography>
                                <Typography 
                                  variant="body1" 
                                  color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                                >
                                  {tech.desc}
                                </Typography>
                              </Box>
                            </motion.div>
                          </ListItem>
                        ))}
                      </List>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Typography 
                        variant="h5" 
                        component="h3" 
                        gutterBottom
                        sx={{ 
                          fontWeight: 'bold',
                          color: darkMode ? '#ce93d8' : '#7b1fa2',
                          mb: 3,
                          position: 'relative',
                          display: 'inline-block',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            bottom: -8,
                            width: '50px',
                            height: '3px',
                            background: 'linear-gradient(90deg, #9c27b0, #ce93d8)',
                            borderRadius: '3px',
                            transition: 'width 0.3s ease',
                          },
                          '&:hover::after': {
                            width: '100%'
                          }
                        }}
                      >
                        Backend Technologies
                      </Typography>
                      
                      <List>
                        {[
                          {
                            name: "Internet Computer Protocol (ICP)",
                            desc: "Decentralized cloud platform for secure, scalable applications"
                          },
                          {
                            name: "Rust & Motoko",
                            desc: "High-performance, secure programming languages for blockchain canister development"
                          },
                          {
                            name: "AI/ML Integration",
                            desc: "Advanced algorithms for symptom analysis and health predictions"
                          },
                          {
                            name: "Blockchain Ledgers",
                            desc: "Immutable record-keeping for data integrity and auditability"
                          }
                        ].map((tech, idx) => (
                          <ListItem key={idx} disableGutters sx={{ mb: 2 }}>
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                              style={{ width: '100%' }}
                            >
                              <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                p: 2, 
                                borderRadius: 2,
                                background: darkMode ? 'rgba(50, 30, 60, 0.4)' : 'rgba(248, 242, 255, 0.7)',
                                border: '1px solid',
                                borderColor: darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)',
                                position: 'relative',
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  background: darkMode ? 'rgba(156, 39, 176, 0.15)' : 'rgba(156, 39, 176, 0.07)',
                                  transform: 'translateY(-3px)',
                                  boxShadow: darkMode 
                                    ? '0 5px 15px rgba(0,0,0,0.3)' 
                                    : '0 5px 15px rgba(0,0,0,0.05)'
                                },
                                '&::after': {
                                  content: '""',
                                  position: 'absolute',
                                  top: 0,
                                  left: '-100%',
                                  width: '200%',
                                  height: '100%',
                                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                                  transition: 'all 0.3s ease',
                                  transform: 'translateX(-100%)'
                                },
                                '&:hover::after': {
                                  transform: 'translateX(100%)',
                                  transition: 'all 1s ease'
                                }
                              }}>
                                <Typography 
                                  variant="h6" 
                                  component="span"
                                  sx={{ 
                                    fontWeight: 'bold',
                                    color: darkMode ? '#ce93d8' : '#7b1fa2',
                                    mb: 0.5
                                  }}
                                >
                                  {tech.name}
                                </Typography>
                                <Typography 
                                  variant="body1" 
                                  color={darkMode ? 'rgba(255,255,255,0.7)' : 'text.secondary'}
                                >
                                  {tech.desc}
                                </Typography>
                              </Box>
                            </motion.div>
                          </ListItem>
                        ))}
                      </List>
                    </motion.div>
                  </Grid>
                </Grid>
              </Paper>
            </motion.div>

            {/* Team Section */}
            <Box sx={{ mb: 6 }}>
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 3 : 1}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: darkMode 
                        ? 'linear-gradient(135deg, rgba(33,150,243,0.08) 0%, rgba(33,150,243,0) 100%)' 
                        : 'linear-gradient(135deg, rgba(1,87,155,0.05) 0%, rgba(1,87,155,0) 100%)',
                      zIndex: 0
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', zIndex: 1 }}>
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                >
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: darkMode ? 'white' : '#01579b',
                      textAlign: 'center',
                          mb: 4,
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: -10,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 80,
                            height: 3,
                            background: darkMode 
                              ? 'linear-gradient(90deg, transparent, rgba(33, 150, 243, 0.7), transparent)'
                              : 'linear-gradient(90deg, transparent, rgba(1, 87, 155, 0.7), transparent)',
                            borderRadius: 2
                          }
                    }}
                  >
                    Our Team
                  </Typography>
                    </motion.div>
                  
                  {/* Team illustration */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      whileHover={{ 
                        scale: 1.03,
                        transition: { type: "spring", stiffness: 400 }
                      }}
                    >
                  <Box
                    component="img"
                    src="image.png"
                    alt="Medical Healthcare Professional"
                    sx={{ 
                      display: 'block',
                      maxWidth: '350px',
                      height: 'auto',
                      mx: 'auto',
                      mb: 4,
                      borderRadius: 3,
                          boxShadow: darkMode 
                            ? '0 10px 30px rgba(0,0,0,0.3)' 
                            : '0 10px 30px rgba(0,0,0,0.15)',
                          transition: 'all 0.3s ease'
                    }}
                  />
                    </motion.div>
                  
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, delay: 0.5 }}
                    >
                  <Typography 
                    variant="body1" 
                    paragraph
                    align="center"
                    sx={{ 
                      fontSize: '1.1rem', 
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                      maxWidth: '900px',
                          mx: 'auto',
                          lineHeight: 1.6
                    }}
                  >
                    Our diverse team of healthcare professionals, blockchain experts, and software engineers is dedicated to creating a secure and patient-centric platform that revolutionizes health data management.
                  </Typography>
                  <Typography 
                    variant="body1"
                    align="center"
                    sx={{ 
                      fontSize: '1.1rem',
                          color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                      maxWidth: '900px',
                          mx: 'auto',
                          lineHeight: 1.6
                    }}
                  >
                    We're committed to building a system that empowers patients, streamlines healthcare processes, and protects sensitive medical information through cutting-edge technology.
                  </Typography>
                    </motion.div>
                  </Box>

                  {/* Animated floating elements */}
                  {[...Array(3)].map((_, i) => (
                    <Box
                      key={`team-particle-${i}`}
                      component={motion.div}
                      animate={{
                        y: [Math.random() * -20, Math.random() * 20],
                        x: [Math.random() * -20, Math.random() * 20],
                        opacity: [0.3, 0.6, 0.3]
                      }}
                      transition={{
                        duration: 5 + Math.random() * 5,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut'
                      }}
                      sx={{
                        position: 'absolute',
                        width: 60 + Math.random() * 40,
                        height: 60 + Math.random() * 40,
                        borderRadius: '50%',
                        background: darkMode 
                          ? 'radial-gradient(circle, rgba(33,150,243,0.15) 0%, rgba(33,150,243,0) 70%)' 
                          : 'radial-gradient(circle, rgba(1,87,155,0.1) 0%, rgba(1,87,155,0) 70%)',
                        filter: 'blur(15px)',
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                        zIndex: 0
                      }}
                    />
                  ))}
                </Paper>
              </motion.div>
            </Box>

            {/* Key Features */}
            <motion.div variants={itemVariants} style={{ marginBottom: '80px' }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 6,
                  color: darkMode ? 'white' : '#01579b'
                }}
              >
                Key Features
              </Typography>
              
              <Grid container spacing={4}>
                {[
                  {
                    title: "Health Records Management",
                    icon: "health",
                    color: "#2196f3",
                    features: [
                      "Secure storage of medical history, test results, and diagnoses",
                      "Upload and organize medical documents and images",
                      "Search and filter records by date, provider, or condition",
                      "Share records securely with healthcare providers"
                    ]
                  },
                  {
                    title: "AI Disease Prediction",
                    icon: "medical",
                    color: "#9c27b0",
                    features: [
                      "Advanced symptom analysis using AI algorithms",
                      "Preliminary assessments with urgency indicators",
                      "Personalized health recommendations",
                      "Condition matching with likelihood scores"
                    ]
                  },
                  {
                    title: "Fitness & Health Analytics",
                    icon: "healing",
                    color: "#4caf50",
                    features: [
                      "Interactive visualization of health metrics and trends",
                      "Progress tracking for fitness goals and activities",
                      "Vital statistics monitoring and analysis",
                      "Personalized insights based on health data patterns"
                    ]
                  },
                  {
                    title: "Telehealth Services",
                    icon: "devices",
                    color: "#ff9800",
                    features: [
                      "Secure video consultations with healthcare providers",
                      "Appointment scheduling and management",
                      "Real-time document and report sharing during sessions",
                      "Follow-up care coordination and integration with records"
                    ]
                  },
                  {
                    title: "Smart Notifications",
                    icon: "hospital",
                    color: "#f44336",
                    features: [
                      "Medication and appointment reminders",
                      "Health alerts based on recorded metrics",
                      "Personalized health tips and recommendations",
                      "Important updates from connected healthcare providers"
                    ]
                  },
                  {
                    title: "Blockchain Security",
                    icon: "security",
                    color: "#607d8b",
                    features: [
                      "Immutable health record storage using blockchain",
                      "End-to-end encryption for all sensitive data",
                      "Cryptographic verification of record integrity",
                      "User-controlled access permissions and audit trails"
                    ]
                  }
                ].map((section, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
            <motion.div 
                      whileHover={{ 
                        y: -10,
                        boxShadow: "0 15px 30px rgba(0,0,0,0.3)",
                        scale: 1.02
                      }}
              whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20
                      }}
                    >
                      <Paper
                        elevation={darkMode ? 4 : 1}
                        sx={{
                          borderRadius: 4,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          bgcolor: 'transparent',
                          background: getGradientColor(index, darkMode),
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: darkMode ? 'rgba(10, 10, 15, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                            zIndex: 1
                          },
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '300%',
                            height: '100%',
                            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                            animation: 'shimmer 8s infinite linear',
                            '@keyframes shimmer': {
                              '0%': { transform: 'translateX(0%)' },
                              '100%': { transform: 'translateX(50%)' }
                            },
                            zIndex: 2
                          },
                          // Add pulsing border effect
                          border: '1px solid',
                          borderColor: 'transparent',
                          boxShadow: `0 0 10px ${getIconColor(index, darkMode)}, inset 0 0 10px ${getIconColor(index, darkMode)}`,
                          animation: 'pulseBorder 3s infinite ease-in-out',
                          '@keyframes pulseBorder': {
                            '0%': { boxShadow: `0 0 5px ${getIconColor(index, darkMode)}, inset 0 0 5px ${getIconColor(index, darkMode)}` },
                            '50%': { boxShadow: `0 0 15px ${getIconColor(index, darkMode)}, inset 0 0 15px ${getIconColor(index, darkMode)}` },
                            '100%': { boxShadow: `0 0 5px ${getIconColor(index, darkMode)}, inset 0 0 5px ${getIconColor(index, darkMode)}` }
                          }
                        }}
                      >
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', position: 'relative', zIndex: 3 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              width: 60,
                              height: 60,
                              borderRadius: '50%',
                              background: getGradientColor(index, darkMode),
                              mr: 2,
                              boxShadow: `0 5px 15px rgba(0,0,0,0.2)`
                            }}
                          >
                            {getIcon(section.icon, { 
                              color: darkMode ? 'white' : 'white', 
                              fontSize: 30 
                            })}
                          </Box>
                          <Typography
                            variant="h5"
                            component="h3"
                            fontWeight="bold"
                            sx={{
                              color: darkMode ? 'white' : 'text.primary',
                              position: 'relative',
                              pb: 1,
                              '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                height: 2,
                                width: '40%',
                                background: getIconColor(index, darkMode),
                                transition: 'width 0.3s ease',
                                borderRadius: 1
                              },
                              '&:hover::after': {
                                width: '100%'
                              }
                            }}
                          >
                            {section.title}
                          </Typography>
                        </Box>
                        
                        <Divider sx={{ opacity: 0.1 }} />
                        
                        <CardContent sx={{ p: 3, flexGrow: 1, position: 'relative', zIndex: 3 }}>
                          <List dense sx={{ py: 0 }}>
                            {section.features.map((feature, idx) => (
                              <ListItem key={idx} disableGutters sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Box
                                    component={motion.div}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                  >
                                    <CheckCircleOutlineIcon sx={{ color: getIconColor(index, darkMode), fontSize: 20 }} />
                                  </Box>
                                </ListItemIcon>
                                <ListItemText
                                  primary={feature}
                                  primaryTypographyProps={{ 
                                    variant: 'body1', 
                                    color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                                    sx: {
                                      transition: 'color 0.3s ease',
                                      '&:hover': {
                                        color: getIconColor(index, darkMode)
                                      }
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Personalized Health Experience Section */}
            <motion.div variants={itemVariants} style={{ marginTop: '80px', marginBottom: '80px' }}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 6,
                  color: darkMode ? 'white' : '#01579b'
                }}
              >
                Personalized Health Experience
              </Typography>
              
              <Grid container spacing={4}>
                {[
                  {
                    title: "Medical Recommendations",
                    icon: "💊",
                    color: "#e91e63",
                    features: [
                      "AI-driven medical recommendations based on your health profile",
                      "Personalized treatment suggestions with risk assessments",
                      "Medication alternatives and interaction warnings",
                      "Expert-reviewed health guidance for common conditions"
                    ]
                  },
                  {
                    title: "Daily Health Tips",
                    icon: "💡",
                    color: "#ffc107",
                    features: [
                      "Personalized health advice based on your medical history",
                      "Preventive care suggestions tailored to your age and conditions",
                      "Nutrition and exercise recommendations for your health goals",
                      "Seasonal wellness tips delivered directly to your dashboard"
                    ]
                  },
                  {
                    title: "Weather Health Insights",
                    icon: "🌦️",
                    color: "#00bcd4",
                    features: [
                      "Real-time health alerts based on local weather conditions",
                      "Pollen counts and air quality information for allergy sufferers",
                      "Seasonal illness risk forecasting with prevention tips",
                      "Temperature-related health recommendations"
                    ]
                  },
                  {
                    title: "Advanced Symptom Analyzer",
                    icon: "🔍",
                    color: "#9c27b0",
                    features: [
                      "Interactive symptom assessment tool with visual body map",
                      "Multiple symptom analysis with severity indicators",
                      "Condition probability scoring with urgency assessment",
                      "Follow-up questions to refine potential diagnoses"
                    ]
                  },
                  {
                    title: "Personalization Options",
                    icon: "🎨",
                    color: "#3f51b5",
                    features: [
                      "Dark and light mode themes for reduced eye strain",
                      "Customizable dashboard layouts to prioritize important data",
                      "Font size and contrast settings for improved readability",
                      "Notification preferences and reminder scheduling"
                    ]
                  },
                  {
                    title: "Profile Management",
                    icon: "👤",
                    color: "#009688",
                    features: [
                      "Create and manage multiple family member profiles",
                      "Role-based access controls for caregivers and family",
                      "Consolidated family health timeline and history",
                      "Secure profile switching with privacy safeguards"
                    ]
                  }
                ].map((section, index) => (
                  <Grid item xs={12} md={6} lg={4} key={index}>
                    <motion.div
                      whileHover={{ 
                        y: -10,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 300
                      }}
                    >
                      <Paper
                        elevation={darkMode ? 4 : 1}
                        sx={{
                          borderRadius: 4,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          position: 'relative',
                          bgcolor: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'white',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: 6,
                            background: section.color,
                            opacity: darkMode ? 0.7 : 1
                          }
                        }}
                      >
                        <Box sx={{ p: 3, display: 'flex', alignItems: 'center' }}>
                          <Typography 
                            variant="h1" 
                            component="span"
                            sx={{ 
                              fontSize: '3rem',
                              mr: 2,
                              lineHeight: 1
                            }}
                          >
                            {section.icon}
                          </Typography>
                          <Typography
                            variant="h5"
                            component="h3"
                            fontWeight="bold"
                            sx={{
                              color: darkMode ? 'white' : 'text.primary',
                            }}
                          >
                            {section.title}
                          </Typography>
                        </Box>
                        
                        <Divider />
                        
                        <CardContent sx={{ p: 3, flexGrow: 1 }}>
                          <List dense sx={{ py: 0 }}>
                            {section.features.map((feature, idx) => (
                              <ListItem key={idx} disableGutters sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 32 }}>
                                  <Box
                                    component={motion.div}
                                    whileHover={{ scale: 1.2, rotate: 10 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                                  >
                                    <CheckCircleOutlineIcon sx={{ color: getIconColor(index, darkMode), fontSize: 20 }} />
                                  </Box>
                                </ListItemIcon>
                                <ListItemText
                                  primary={feature}
                                  primaryTypographyProps={{ 
                                    variant: 'body1', 
                                    color: darkMode ? 'rgba(255,255,255,0.9)' : 'text.primary',
                                    sx: {
                                      transition: 'color 0.3s ease',
                                      '&:hover': {
                                        color: getIconColor(index, darkMode)
                                      }
                                    }
                                  }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </CardContent>
                      </Paper>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>

            {/* Bottom Dashboard Button & CTA Banner */}
            <motion.div 
              variants={itemVariants}
              style={{ textAlign: 'center', marginTop: '80px', marginBottom: '80px' }}
            >
              <Box
                sx={{ 
                  position: 'relative',
                  maxWidth: '1200px',
                  mx: 'auto',
                  borderRadius: 6,
                  overflow: 'hidden',
                  p: { xs: 4, md: 8 },
                  background: darkMode 
                    ? 'linear-gradient(135deg, rgba(103, 58, 183, 0.9) 0%, rgba(63, 81, 181, 0.9) 100%)' 
                    : 'linear-gradient(135deg, rgba(33, 150, 243, 0.9) 0%, rgba(3, 169, 244, 0.9) 100%)',
                  boxShadow: darkMode 
                    ? '0 20px 50px rgba(0,0,0,0.3), 0 0 30px rgba(103, 58, 183, 0.3)' 
                    : '0 20px 50px rgba(0,0,0,0.15), 0 0 30px rgba(33, 150, 243, 0.2)',
                }}
              >
                {/* Animated floating particles */}
                {[...Array(30)].map((_, i) => (
                  <Box
                    key={`cta-particle-${i}`}
                    component={motion.div}
                    animate={{
                      y: [Math.random() * 100, Math.random() * -100],
                      x: [Math.random() * -100, Math.random() * 100],
                      opacity: [0, 0.7, 0],
                      scale: [0, 1, 0]
                    }}
                    transition={{
                      duration: 10 + Math.random() * 15,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2
                    }}
                    sx={{
                      position: 'absolute',
                      width: 5 + Math.random() * 20,
                      height: 5 + Math.random() * 20,
                      borderRadius: '50%',
                      background: 'rgba(255, 255, 255, 0.4)',
                      filter: 'blur(3px)',
                      top: Math.random() * 100 + '%',
                      left: Math.random() * 100 + '%',
                      zIndex: 0
                    }}
                  />
                ))}
                
                <Grid container spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
                  <Grid item xs={12} md={8}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7 }}
                    >
                      <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                          fontWeight: 800,
                          color: 'white',
                          textShadow: '0 0 20px rgba(0,0,0,0.2)',
                          mb: 2
                        }}
                      >
                        Take Control of Your Health Data Today
                      </Typography>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 500,
                          color: 'rgba(255,255,255,0.9)',
                          mb: { xs: 4, md: 0 },
                          maxWidth: '800px',
                          lineHeight: 1.6
                        }}
                      >
                        Join thousands of users who are already managing their health records securely 
                        and efficiently with our blockchain-powered platform.
                      </Typography>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                size="large"
                        endIcon={
                          <motion.div
                            animate={{ 
                              x: [0, 5, 0],
                              y: [0, -2, 0]
                            }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: 'loop'
                            }}
                          >
                            <ArrowForwardIcon />
                          </motion.div>
                        }
                onClick={() => navigate('/dashboard')}
                sx={{
                          borderRadius: 10,
                          py: 2,
                  px: 6,
                          fontSize: '1.25rem',
                          fontWeight: 700,
                          background: 'white',
                          color: darkMode ? '#673ab7' : '#2196f3',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                            animation: 'sweep 2s linear infinite',
                            zIndex: 1,
                            '@keyframes sweep': {
                              '0%': { left: '-100%' },
                              '100%': { left: '100%' },
                            }
                          }
                }}
              >
                Enter Dashboard
              </Button>
                    </motion.div>
                  </Grid>
                </Grid>
              </Box>
            </motion.div>
          </motion.div>
        </Container>
      </Box>
    );
  } catch (err) {
    console.error("Error rendering LandingPage:", err);
    
    // Don't use state here, directly return the error UI
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
          Something went wrong loading the project details page
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

export default LandingPage; 