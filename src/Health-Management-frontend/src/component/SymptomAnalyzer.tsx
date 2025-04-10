import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Button,
  Chip,
  Autocomplete,
  AutocompleteChangeDetails,
  AutocompleteChangeReason,
  AutocompleteRenderGetTagProps,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
  Paper,
  LinearProgress,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  AlertTitle
} from '@mui/material';
import { useTheme } from './ThemeContext';
import SearchIcon from '@mui/icons-material/Search';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import VideocamIcon from '@mui/icons-material/Videocam';

// This is a simplified mock implementation of a symptom analyzer
// In a real application, this would be connected to a medical API or database
// and would include proper medical disclaimers and regulatory compliance

const SymptomAnalyzer: React.FC = () => {
  const { darkMode } = useTheme();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);

  // Common symptoms list (this would be much more comprehensive in a real application)
  const commonSymptoms = [
    "Headache", "Fever", "Cough", "Fatigue", "Nausea", 
    "Sore throat", "Shortness of breath", "Dizziness", 
    "Chest pain", "Back pain", "Joint pain", "Abdominal pain",
    "Rash", "Runny nose", "Loss of appetite", "Muscle aches",
    "Chills", "Swelling", "Vision problems", "Difficulty sleeping"
  ];

  const handleSymptomChange = (
    event: React.SyntheticEvent, 
    newValue: string[], 
    reason?: AutocompleteChangeReason,
    details?: AutocompleteChangeDetails<string>
  ) => {
    setSelectedSymptoms(newValue);
    setResults(null);
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) return;
    
    setAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock results based on selected symptoms
      const resultData = generateMockResults(selectedSymptoms);
      setResults(resultData);
      setAnalyzing(false);
    }, 2000);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAcceptDisclaimer = () => {
    setDisclaimerAccepted(true);
    setOpenDialog(false);
  };

  // Generate mock results based on symptoms
  const generateMockResults = (symptoms: string[]) => {
    // This is a very simplified mock implementation
    // A real system would use medical databases and algorithms

    // Define some mock conditions with associated symptoms
    const conditions = [
      {
        name: "Common Cold",
        symptoms: ["Cough", "Sore throat", "Runny nose", "Fever", "Fatigue"],
        urgency: "low",
        description: "A viral infection of the upper respiratory tract. Usually resolves within 7-10 days with rest and hydration.",
        recommendations: [
          "Rest and stay hydrated",
          "Over-the-counter cold medications may help relieve symptoms",
          "Use a humidifier to ease congestion",
          "Contact a doctor if symptoms persist beyond 10 days"
        ]
      },
      {
        name: "Seasonal Allergies",
        symptoms: ["Runny nose", "Sore throat", "Cough", "Fatigue"],
        urgency: "low",
        description: "An immune response to environmental triggers like pollen, dust, or pet dander.",
        recommendations: [
          "Over-the-counter antihistamines may help reduce symptoms",
          "Avoid known allergy triggers when possible",
          "Consider using air purifiers in your home",
          "Consult with an allergist for persistent symptoms"
        ]
      },
      {
        name: "Influenza",
        symptoms: ["Fever", "Fatigue", "Muscle aches", "Cough", "Headache", "Chills"],
        urgency: "medium",
        description: "A viral infection that affects the respiratory system. More severe than the common cold.",
        recommendations: [
          "Rest and stay hydrated",
          "Take fever-reducing medications as needed",
          "Consider antiviral medications (must be started early)",
          "Seek medical attention if you have difficulty breathing or symptoms worsen"
        ]
      },
      {
        name: "Migraine",
        symptoms: ["Headache", "Vision problems", "Nausea", "Fatigue", "Dizziness"],
        urgency: "medium",
        description: "A neurological condition characterized by severe, debilitating headaches often accompanied by other symptoms.",
        recommendations: [
          "Rest in a quiet, dark room",
          "Over-the-counter pain relievers may help",
          "Apply cold or warm compresses to your head",
          "Consult a doctor for recurring migraines to discuss preventive treatments"
        ]
      },
      {
        name: "Gastroenteritis",
        symptoms: ["Nausea", "Abdominal pain", "Fatigue", "Loss of appetite"],
        urgency: "medium",
        description: "Inflammation of the stomach and intestines, typically due to viral infection or food poisoning.",
        recommendations: [
          "Stay hydrated with small sips of water or electrolyte solutions",
          "Eat bland foods when you feel able to eat",
          "Rest and avoid strenuous activity",
          "Seek medical attention if symptoms persist beyond 3 days or if you have signs of dehydration"
        ]
      },
      {
        name: "Chest Infection",
        symptoms: ["Cough", "Shortness of breath", "Chest pain", "Fever", "Fatigue"],
        urgency: "high",
        description: "An infection affecting the lungs or lower respiratory tract, which can include bronchitis or pneumonia.",
        recommendations: [
          "Seek medical attention promptly",
          "Rest and stay hydrated",
          "Take prescribed antibiotics as directed (if bacterial)",
          "Use a humidifier to help loosen mucus"
        ]
      }
    ];

    // Find matching conditions based on symptoms
    const matchingConditions = conditions.map(condition => {
      const matchingSymptoms = condition.symptoms.filter(s => symptoms.includes(s));
      const matchScore = matchingSymptoms.length / condition.symptoms.length;
      
      return {
        ...condition,
        matchingSymptoms,
        likelihood: matchScore > 0.6 ? "High" : matchScore > 0.3 ? "Medium" : "Low"
      };
    }).filter(condition => condition.matchingSymptoms.length > 0)
      .sort((a, b) => {
        // Sort by number of matching symptoms (descending)
        return b.matchingSymptoms.length - a.matchingSymptoms.length;
      });

    // Create a general observation based on the symptoms
    let generalAdvice = "Based on your symptoms, consider the following:";
    if (symptoms.includes("Chest pain") || symptoms.includes("Shortness of breath")) {
      generalAdvice = "Your symptoms may require urgent medical attention. Please consider consulting a healthcare provider promptly.";
    }
    
    return {
      possibleConditions: matchingConditions.slice(0, 3), // Top 3 matches
      generalAdvice
    };
  };

  return (
    <>
      <Card
        elevation={darkMode ? 3 : 1}
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          mb: 3,
          background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'white',
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{
            p: 3,
            background: darkMode ? 'rgba(83, 109, 254, 0.1)' : 'rgba(83, 109, 254, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LocalHospitalIcon sx={{ color: '#536DFE', mr: 2, fontSize: 28 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Symptom Analyzer
              </Typography>
            </Box>
            
            <Tooltip title="Important information about this tool">
              <IconButton onClick={handleOpenDialog} size="small">
                <InfoOutlinedIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Divider />
          
          {!disclaimerAccepted && (
            <Box sx={{ p: 3 }}>
              <Alert 
                severity="info" 
                sx={{ mb: 2 }}
                action={
                  <Button 
                    color="info" 
                    size="small" 
                    onClick={handleAcceptDisclaimer}
                    sx={{ textTransform: 'none' }}
                  >
                    Acknowledge
                  </Button>
                }
              >
                This tool is for informational purposes only and does not provide medical advice. Please read the full disclaimer before using.
              </Alert>
              
              <Button 
                variant="outlined" 
                color="primary" 
                fullWidth 
                onClick={handleOpenDialog}
                sx={{ textTransform: 'none' }}
              >
                Read Full Disclaimer
              </Button>
            </Box>
          )}
          
          {disclaimerAccepted && (
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Enter your symptoms to get potential causes and recommendations
              </Typography>
              
              <Autocomplete
                multiple
                id="symptoms-input"
                options={commonSymptoms}
                value={selectedSymptoms}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    placeholder="Type or select symptoms..."
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                )}
                onInputChange={(event, value) => {
                  // This handles input changes without triggering type errors
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option}
                      {...getTagProps({ index })}
                      sx={{
                        bgcolor: darkMode ? 'rgba(83, 109, 254, 0.2)' : 'rgba(83, 109, 254, 0.1)',
                        borderColor: darkMode ? 'rgba(83, 109, 254, 0.3)' : 'rgba(83, 109, 254, 0.2)',
                        color: darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.87)',
                      }}
                    />
                  ))
                }
              />
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleAnalyze}
                disabled={selectedSymptoms.length === 0 || analyzing}
                startIcon={<SearchIcon />}
                sx={{ 
                  mb: 3,
                  bgcolor: '#536DFE',
                  '&:hover': { bgcolor: '#3D5AFE' },
                  textTransform: 'none',
                  fontWeight: 'medium'
                }}
              >
                {analyzing ? 'Analyzing...' : 'Analyze Symptoms'}
              </Button>
              
              {analyzing && (
                <Box sx={{ width: '100%', mb: 3 }}>
                  <LinearProgress sx={{ height: 6, borderRadius: 3 }} />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                    Analyzing your symptoms...
                  </Typography>
                </Box>
              )}
              
              {results && (
                <>
                  <Alert 
                    severity={
                      results.possibleConditions.some((c: { urgency: string }) => c.urgency === 'high') ? 'warning' :
                      results.possibleConditions.some((c: { urgency: string }) => c.urgency === 'medium') ? 'info' : 'success'
                    }
                    sx={{ mb: 3 }}
                    icon={
                      results.possibleConditions.some((c: { urgency: string }) => c.urgency === 'high') ? <WarningAmberIcon /> :
                      results.possibleConditions.some((c: { urgency: string }) => c.urgency === 'medium') ? <InfoOutlinedIcon /> : <CheckCircleOutlineIcon />
                    }
                  >
                    {results.generalAdvice}
                  </Alert>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Possible Conditions
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" paragraph sx={{ mb: 2 }}>
                    Based on the symptoms you provided, these conditions might be relevant. Remember, only a healthcare professional can provide an accurate diagnosis.
                  </Typography>
                  
                  <List sx={{ mb: 2 }}>
                    {results.possibleConditions.map((condition: { urgency: string; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; likelihood: string; description: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; matchingSymptoms: any[]; recommendations: any[]; }, index: React.Key | null | undefined) => (
                      <Paper 
                        key={index} 
                        elevation={0} 
                        sx={{ 
                          mb: 2, 
                          borderRadius: 2,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                        }}
                      >
                        <Box sx={{ 
                          p: 2,
                          backgroundColor: 
                            condition.urgency === 'high' ? (darkMode ? 'rgba(239, 83, 80, 0.15)' : 'rgba(239, 83, 80, 0.05)') :
                            condition.urgency === 'medium' ? (darkMode ? 'rgba(255, 152, 0, 0.15)' : 'rgba(255, 152, 0, 0.05)') :
                            (darkMode ? 'rgba(102, 187, 106, 0.15)' : 'rgba(102, 187, 106, 0.05)')
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" component="h3" fontWeight="bold">
                              {condition.name}
                            </Typography>
                            
                            <Chip 
                              label={`Likelihood: ${condition.likelihood}`}
                              size="small"
                              sx={{ 
                                fontWeight: 'medium',
                                bgcolor: 
                                  condition.likelihood === 'High' ? (darkMode ? 'rgba(239, 83, 80, 0.2)' : 'rgba(239, 83, 80, 0.1)') :
                                  condition.likelihood === 'Medium' ? (darkMode ? 'rgba(255, 152, 0, 0.2)' : 'rgba(255, 152, 0, 0.1)') :
                                  (darkMode ? 'rgba(102, 187, 106, 0.2)' : 'rgba(102, 187, 106, 0.1)'),
                                color: 
                                  condition.likelihood === 'High' ? '#ef5350' :
                                  condition.likelihood === 'Medium' ? '#ff9800' : '#66bb6a'
                              }}
                            />
                          </Box>
                        </Box>
                        
                        <Box sx={{ p: 2 }}>
                          <Typography variant="body2" paragraph>
                            {condition.description}
                          </Typography>
                          
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            Matching Symptoms:
                          </Typography>
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                            {condition.matchingSymptoms.map((symptom, idx) => (
                              <Chip 
                                key={idx} 
                                label={symptom} 
                                size="small"
                                variant="outlined"
                                sx={{ 
                                  fontSize: '0.7rem', 
                                  height: 22
                                }}
                              />
                            ))}
                          </Box>
                          
                          <Typography variant="body2" fontWeight="medium" gutterBottom>
                            Recommendations:
                          </Typography>
                          
                          <List dense disablePadding>
                            {condition.recommendations.map((rec, idx) => (
                              <ListItem key={idx} sx={{ py: 0.5, px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 28 }}>
                                  <Box 
                                    component="span" 
                                    sx={{ 
                                      width: 18, 
                                      height: 18, 
                                      borderRadius: '50%', 
                                      bgcolor: '#536DFE20',
                                      color: '#536DFE',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontSize: 12,
                                      fontWeight: 'bold'
                                    }}
                                  >
                                    {idx + 1}
                                  </Box>
                                </ListItemIcon>
                                <ListItemText 
                                  primary={rec} 
                                  primaryTypographyProps={{ variant: 'body2' }}
                                />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                        
                        <Divider />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5 }}>
                          <Button 
                            size="small" 
                            startIcon={<HelpOutlineIcon />}
                            sx={{ textTransform: 'none' }}
                          >
                            Learn More
                          </Button>
                          
                          <Button 
                            size="small" 
                            variant="contained"
                            startIcon={<VideocamIcon />}
                            sx={{ 
                              bgcolor: '#536DFE',
                              '&:hover': { bgcolor: '#3D5AFE' },
                              textTransform: 'none'
                            }}
                          >
                            Consult Doctor
                          </Button>
                        </Box>
                      </Paper>
                    ))}
                  </List>
                  
                  <Alert severity="info" sx={{ mb: 2, mt: 3 }}>
                    <AlertTitle>Important Reminder</AlertTitle>
                    This analysis is for informational purposes only and does not replace professional medical advice. Always consult with a healthcare provider for proper diagnosis and treatment.
                  </Alert>
                </>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
      
      {/* Disclaimer Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center' }}>
            <ErrorOutlineIcon sx={{ mr: 1 }} /> 
            Medical Disclaimer
          </Typography>
          <IconButton onClick={handleCloseDialog} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" paragraph>
            The Symptom Analyzer tool is provided for informational and educational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment.
          </Typography>
          
          <Typography variant="body1" paragraph>
            <strong>This tool:</strong>
          </Typography>
          
          <List dense>
            <ListItem>
              <ListItemIcon><ErrorOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Does NOT provide medical advice or diagnosis" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ErrorOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Uses a simplified algorithm that is not comprehensive" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ErrorOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="May not account for your complete medical history or unique circumstances" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ErrorOutlineIcon fontSize="small" /></ListItemIcon>
              <ListItemText primary="Should never be used in place of consulting with a qualified healthcare professional" />
            </ListItem>
          </List>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            <strong>Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</strong> Never disregard professional medical advice or delay in seeking it because of something you have read or learned from this tool.
          </Typography>
          
          <Typography variant="body1" paragraph>
            If you think you may have a medical emergency, call your doctor or emergency services immediately.
          </Typography>
          
          <Typography variant="body1">
            By using this tool, you acknowledge that you understand and agree to these terms.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ textTransform: 'none' }}>
            Close
          </Button>
          <Button 
            onClick={handleAcceptDisclaimer} 
            variant="contained"
            sx={{ 
              bgcolor: '#536DFE',
              '&:hover': { bgcolor: '#3D5AFE' },
              textTransform: 'none'
            }}
          >
            I Understand and Accept
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SymptomAnalyzer; 