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
  useMediaQuery
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
        description: "Implements FHIR (Fast Healthcare Interoperability Resources) standards to ensure compatibility with existing healthcare systems",
        icon: <MedicalServicesIcon fontSize="large" color="primary" />
      },
      {
        name: "Cross-Platform Access",
        description: "Provides secure access to health records across web, mobile, and tablet devices with consistent user experience",
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
          ? 'linear-gradient(135deg, #263238 0%, #37474f 100%)' 
          : 'linear-gradient(135deg, #e1f5fe 0%, #b3e5fc 100%)',
        minHeight: '100vh',
        pt: 8,
        pb: 10
      }}>
        <Container maxWidth="lg">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Header Section */}
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h2" 
                component="h1" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 2,
                  color: darkMode ? 'white' : '#01579b'
                }}
              >
                Welcome to Health Management System
              </Typography>
              <Typography 
                variant="h5" 
                align="center"
                sx={{ 
                  mb: 3,
                  color: darkMode ? 'rgba(255,255,255,0.8)' : '#37474f',
                  maxWidth: '800px',
                  mx: 'auto'
                }}
              >
                A revolutionary blockchain-based platform that puts you in control of your health data
              </Typography>
              
              {/* Header image - Nurse */}
              <Box
                component="img"
                src="/images/hello_nurse.svg"
                alt="Healthcare Professional - Nurse"
                sx={{ 
                  display: 'block',
                  maxWidth: '280px',
                  maxHeight: '280px',
                  mx: 'auto',
                  mb: 6,
                  borderRadius: '50%',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                  border: darkMode ? '4px solid rgba(255,255,255,0.1)' : '4px solid rgba(25,118,210,0.1)',
                  backgroundColor: 'white',
                  padding: 2
                }}
              />
            </motion.div>

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
                      src="/images/healthcare.svg"
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

            {/* Technology Section */}
            <motion.div variants={itemVariants}>
              <Typography 
                variant="h3" 
                component="h2" 
                align="center"
                sx={{ 
                  fontWeight: 'bold',
                  mb: 4,
                  color: darkMode ? 'white' : '#01579b'
                }}
              >
                Our Technology Stack
              </Typography>
            </motion.div>

            <Grid container spacing={4} sx={{ mb: 8 }}>
              {technologies.map((tech, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <motion.div variants={itemVariants}>
                    <Card 
                      sx={{ 
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                        backgroundColor: darkMode ? 'rgba(42, 42, 42, 0.8)' : 'white',
                        transition: 'transform 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', mb: 2 }}>
                          {tech.icon}
                        </Box>
                        <Typography 
                          variant="h5" 
                          component="h3" 
                          gutterBottom
                          sx={{ fontWeight: 'bold', color: 'text.primary' }}
                        >
                          {tech.name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          {tech.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Team Section */}
            <Box sx={{ mb: 6 }}>
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 3 : 1}
                  sx={{ 
                    p: 4, 
                    borderRadius: 4,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
                  }}
                >
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 'bold',
                      color: darkMode ? 'white' : '#01579b',
                      textAlign: 'center',
                      mb: 4
                    }}
                  >
                    Our Team
                  </Typography>
                  
                  {/* Team illustration */}
                  <Box
                    component="img"
                    src="/images/team.svg"
                    alt="Healthcare Team Illustration"
                    sx={{ 
                      display: 'block',
                      maxWidth: '350px',
                      height: 'auto',
                      mx: 'auto',
                      mb: 4,
                      borderRadius: 3,
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    }}
                  />
                  
                  <Typography 
                    variant="body1" 
                    paragraph
                    align="center"
                    sx={{ 
                      fontSize: '1.1rem', 
                      color: 'text.primary',
                      maxWidth: '900px',
                      mx: 'auto'
                    }}
                  >
                    Our diverse team of healthcare professionals, blockchain experts, and software engineers is dedicated to creating a secure and patient-centric platform that revolutionizes health data management.
                  </Typography>
                  <Typography 
                    variant="body1"
                    align="center"
                    sx={{ 
                      fontSize: '1.1rem',
                      color: 'text.primary',
                      maxWidth: '900px',
                      mx: 'auto'
                    }}
                  >
                    We're committed to building a system that empowers patients, streamlines healthcare processes, and protects sensitive medical information through cutting-edge technology.
                  </Typography>
                </Paper>
              </motion.div>
            </Box>

            {/* Call to Action */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ textAlign: 'center' }}
            >
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
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
                }}
              >
                Enter Dashboard
              </Button>
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