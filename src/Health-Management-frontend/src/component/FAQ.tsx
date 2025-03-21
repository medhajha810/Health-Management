import React from 'react';
import {
  Container, 
  Paper, 
  Typography, 
  Box, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails, 
  Button,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SecurityIcon from '@mui/icons-material/Security';
import { useNavigate } from 'react-router-dom';
import { useTheme } from './ThemeContext';

const FAQ: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  
  // Combine all FAQs into categories
  const generalFaqs = [
    {
      question: "What is a Health Management System?",
      answer: "A Health Management System is a digital platform that allows you to securely store, manage, and access your health records. It helps you maintain a comprehensive view of your medical history, track your healthcare journey, and share important information with healthcare providers when needed."
    },
    {
      question: "How do I add a new health record?",
      answer: "To add a new health record, navigate to the Records page and click the 'Add New Record' button. Fill in the record details including type, date, doctor name, and description. You can also attach relevant documents or images. Click 'Save Record' to store it in your health profile."
    },
    {
      question: "Can I use this system on mobile devices?",
      answer: "Yes, our Health Management System is fully responsive and works on smartphones, tablets, and desktop computers. You can access all features through your mobile browser without needing to install a separate app."
    }
  ];
  
  const recordFaqs = [
    {
      question: "How do I share my health records with a doctor?",
      answer: "You can share your health records with your doctor by downloading the record as a PDF and sending it via secure email, or by showing it during your appointment. For ABHA-linked records, you can generate a temporary sharing link."
    },
    {
      question: "Are my health records secure?",
      answer: "Yes, all health records are encrypted and stored securely. Your data is only accessible to you unless explicitly shared. When using ABHA-linked records, additional government security measures are in place."
    },
    {
      question: "Can I edit my health records after saving them?",
      answer: "You can edit the basic information like record type, doctor name, and description. However, for data integrity reasons, you cannot modify the original date or attachments once added, though you can delete and re-add attachments."
    },
    {
      question: "What happens if I delete my health record?",
      answer: "When you delete a health record, it is permanently removed from the system and cannot be recovered. Make sure to download or backup important records before deleting them."
    }
  ];
  
  const abhaFaqs = [
    {
      question: "What is ABHA (Ayushman Bharat Health Account)?",
      answer: "ABHA is a government initiative that provides citizens with a unique health ID and digital health records management. It enables secure and seamless sharing of health information between patients and healthcare providers across India."
    },
    {
      question: "How do I link my ABHA ID with my health records?",
      answer: "To link your ABHA ID, go to your profile settings and select 'Link ABHA ID'. You'll need to provide your ABHA number and complete the verification process, which may include OTP verification."
    },
    {
      question: "What are the benefits of linking my ABHA ID?",
      answer: "Linking your ABHA ID provides several benefits including access to your national health records, easier sharing with new healthcare providers, standardized health information across institutions, and participation in India's national digital health ecosystem."
    }
  ];
  
  const technicalFaqs = [
    {
      question: "Can I access my records offline?",
      answer: "Yes, records you've previously accessed while online are stored securely on your device and can be viewed offline. However, you won't be able to add new records or sync with the backend until you're back online."
    },
    {
      question: "What file types can I attach to my health records?",
      answer: "You can attach various file types including images (JPG, PNG), documents (PDF, DOC, DOCX), lab results, and medical imaging files. The system supports most common file formats, with a maximum size of 10MB per file."
    },
    {
      question: "How do I report a technical issue?",
      answer: "To report a technical issue, click on the 'Contact Support' button in the top navigation bar. Provide detailed information about the issue you're experiencing, including what steps led to the problem and any error messages you received."
    }
  ];

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ 
        p: 4, 
        mt: 4,
        mb: 4,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <Box display="flex" alignItems="center" mb={3}>
          <HelpIcon sx={{ color: 'primary.main', fontSize: 40, mr: 2 }} />
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
            Frequently Asked Questions
          </Typography>
        </Box>
        
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
        >
          Back
        </Button>
        
        <Typography variant="body1" paragraph color="text.secondary">
          Find answers to commonly asked questions about our Health Management System. If you can't find the information you're looking for, please visit our Contact Support page.
        </Typography>
        
        {/* General FAQs */}
        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <HealthAndSafetyIcon sx={{ color: '#4caf50', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="#4caf50">
              General Questions
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {generalFaqs.map((faq, index) => (
            <Accordion 
              key={`general-${index}`}
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: darkMode ? '#1e2830' : 'background.paper',
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(76, 175, 80, 0.2)' : 'rgba(76, 175, 80, 0.1)'
                }}
              >
                <Typography fontWeight="medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        {/* Health Records FAQs */}
        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <LocalHospitalIcon sx={{ color: '#1976d2', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="#1976d2">
              Health Records
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {recordFaqs.map((faq, index) => (
            <Accordion 
              key={`record-${index}`}
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: darkMode ? '#1e2830' : 'background.paper',
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(25, 118, 210, 0.2)' : 'rgba(25, 118, 210, 0.1)'
                }}
              >
                <Typography fontWeight="medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        {/* ABHA FAQs */}
        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <SecurityIcon sx={{ color: '#9c27b0', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="#9c27b0">
              ABHA Integration
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {abhaFaqs.map((faq, index) => (
            <Accordion 
              key={`abha-${index}`}
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: darkMode ? '#1e2830' : 'background.paper',
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(156, 39, 176, 0.2)' : 'rgba(156, 39, 176, 0.1)'
                }}
              >
                <Typography fontWeight="medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        {/* Technical FAQs */}
        <Box mt={4}>
          <Box display="flex" alignItems="center" mb={2}>
            <HelpIcon sx={{ color: '#f57c00', mr: 1 }} />
            <Typography variant="h5" fontWeight="bold" color="#f57c00">
              Technical Support
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          
          {technicalFaqs.map((faq, index) => (
            <Accordion 
              key={`tech-${index}`}
              sx={{ 
                mb: 2, 
                borderRadius: 2, 
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                backgroundColor: darkMode ? '#1e2830' : 'background.paper',
                '&:before': {
                  display: 'none'
                },
                '&.Mui-expanded': {
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  backgroundColor: darkMode ? 'rgba(245, 124, 0, 0.2)' : 'rgba(245, 124, 0, 0.1)'
                }}
              >
                <Typography fontWeight="medium">{faq.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
        <Box mt={4} textAlign="center">
          <Typography variant="subtitle1" gutterBottom>
            Still have questions?
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/contact')}
            sx={{
              mt: 1,
              textTransform: 'none',
              borderRadius: 8,
              px: 4
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FAQ; 