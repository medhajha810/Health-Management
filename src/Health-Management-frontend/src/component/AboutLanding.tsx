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
  useMediaQuery
} from '@mui/material';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
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
              ? 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' 
              : 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)',
            minHeight: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'visible',
            paddingBottom: '100px'
          }}
        >
          {/* Background shapes */}
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            overflow: 'hidden',
            zIndex: 0
          }}>
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                component={motion.div}
                sx={{
                  position: 'absolute',
                  width: Math.random() * 300 + 100,
                  height: Math.random() * 300 + 100,
                  borderRadius: '50%',
                  background: darkMode 
                    ? `rgba(255, 255, 255, ${Math.random() * 0.05 + 0.02})`
                    : `rgba(33, 150, 243, ${Math.random() * 0.1 + 0.05})`,
                  filter: 'blur(60px)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                animate={{
                  x: [0, Math.random() * 50 - 25],
                  y: [0, Math.random() * 50 - 25],
                }}
                transition={{
                  duration: Math.random() * 20 + 20,
                  repeat: Infinity,
                  repeatType: 'reverse',
                  ease: "easeInOut",
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
                      fontWeight: 'bold',
                      color: darkMode ? 'white' : '#0d47a1',
                      textShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    Health Management System
                  </Typography>
                  <Typography 
                    variant="h5" 
                    gutterBottom
                    sx={{ 
                      mb: 4,
                      color: darkMode ? 'rgba(255,255,255,0.8)' : '#37474f'
                    }}
                  >
                    A blockchain-powered platform for secure health record management
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
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
                          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          background: darkMode 
                            ? 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)' 
                            : 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                          '&:hover': {
                            boxShadow: '0 6px 30px rgba(0,0,0,0.2)'
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
                        endIcon={<KeyboardArrowUpIcon />}
                        onClick={toggleDashboard}
                        sx={{
                          borderRadius: 8,
                          py: 1.5,
                          px: 4,
                          fontSize: '1.1rem',
                          borderColor: darkMode ? 'rgba(255,255,255,0.5)' : 'primary.main',
                          color: darkMode ? 'white' : 'primary.main',
                          '&:hover': {
                            borderColor: darkMode ? 'white' : 'primary.dark',
                            backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.04)'
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
                    alignItems: 'center' 
                  }}
                >
                  <Box
                    component="img"
                    src="/images/hello_nurse.svg"
                    alt="Health Management System - Nurse"
                    sx={{ 
                      maxWidth: '100%', 
                      maxHeight: { xs: '300px', md: '400px' },
                      borderRadius: 4,
                      boxShadow: '0 16px 40px rgba(0,0,0,0.2)',
                      backgroundColor: 'white',
                      padding: 2
                    }}
                  />
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