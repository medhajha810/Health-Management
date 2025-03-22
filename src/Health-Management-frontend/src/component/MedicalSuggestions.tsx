import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Box,
  Grid,
  Chip,
  IconButton,
  Divider,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useTheme } from './ThemeContext';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import WaterIcon from '@mui/icons-material/Water';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import MedicationIcon from '@mui/icons-material/Medication';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface MedicalAdvice {
  id: number;
  title: string;
  shortDescription: string;
  fullContent: string;
  category: string;
  icon: React.ReactNode;
  color: string;
  tags: string[];
  importance: 'high' | 'medium' | 'low';
  actionItems?: string[];
}

const MedicalSuggestions: React.FC = () => {
  const { darkMode } = useTheme();
  const [selectedAdvice, setSelectedAdvice] = useState<MedicalAdvice | null>(null);
  const [savedAdvice, setSavedAdvice] = useState<number[]>([]);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = (advice: MedicalAdvice) => {
    setSelectedAdvice(advice);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const toggleSaveAdvice = (id: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setSavedAdvice(prev => 
      prev.includes(id) 
        ? prev.filter(adviceId => adviceId !== id) 
        : [...prev, id]
    );
  };

  const medicalAdvices: MedicalAdvice[] = [
    {
      id: 1,
      title: "Preventive Health Screenings",
      shortDescription: "Regular health screenings can detect problems before symptoms appear",
      fullContent: "Regular health screenings are essential for early detection of potential health issues. Different screenings are recommended based on age, gender, family history, and risk factors. Common preventive screenings include blood pressure checks, cholesterol tests, diabetes screenings, cancer screenings, and bone density tests.",
      category: "Preventive Care",
      icon: <MedicalServicesIcon />,
      color: "#42A5F5",
      tags: ["screening", "prevention", "checkup"],
      importance: "high",
      actionItems: [
        "Schedule an annual physical examination with your primary care physician",
        "Discuss which screenings are appropriate for your age and risk factors",
        "Keep track of your screening results and follow recommended intervals for repeat screenings",
        "Don't postpone recommended screenings - early detection saves lives"
      ]
    },
    {
      id: 2,
      title: "Healthy Heart Habits",
      shortDescription: "Cardiovascular health impacts your overall wellbeing and longevity",
      fullContent: "Heart disease remains the leading cause of death globally. Your cardiovascular health affects nearly every system in your body. Simple lifestyle changes can significantly reduce your risk of heart disease. Maintaining a healthy diet, regular exercise, avoiding smoking, limiting alcohol intake, and managing stress are foundational to heart health.",
      category: "Cardiovascular",
      icon: <FavoriteBorderIcon />,
      color: "#EF5350",
      tags: ["heart", "cardiovascular", "circulation"],
      importance: "high",
      actionItems: [
        "Aim for at least 150 minutes of moderate-intensity exercise per week",
        "Follow a diet rich in fruits, vegetables, whole grains, and lean proteins",
        "Limit sodium, saturated fats, and added sugars in your diet",
        "Monitor your blood pressure regularly",
        "Learn stress reduction techniques like meditation or deep breathing"
      ]
    },
    {
      id: 3,
      title: "Hydration Importance",
      shortDescription: "Proper hydration is essential for all bodily functions",
      fullContent: "Water is vital for nearly every bodily function including regulating temperature, delivering nutrients to cells, and keeping organs functioning properly. Dehydration can cause fatigue, headaches, reduced cognitive function, and in severe cases, serious health problems. While individual needs vary, a general guideline is to drink enough so that you're rarely thirsty and your urine is colorless or light yellow.",
      category: "Nutrition",
      icon: <WaterIcon />,
      color: "#29B6F6",
      tags: ["water", "hydration", "fluids"],
      importance: "medium",
      actionItems: [
        "Aim to drink 8-10 glasses (about 2 liters) of water daily",
        "Increase intake during hot weather, illness, or physical activity",
        "Set reminders to drink water throughout the day",
        "Consider carrying a reusable water bottle with you",
        "Eat water-rich foods like fruits and vegetables"
      ]
    },
    {
      id: 4,
      title: "Balanced Nutrition",
      shortDescription: "A balanced diet provides essential nutrients for optimal health",
      fullContent: "Nutrition is the foundation of good health. A balanced diet provides the nutrients your body needs to function properly. The key components include proteins, carbohydrates, fats, vitamins, minerals, and water. Eating a variety of foods from all food groups ensures you get the necessary nutrients. Portion control is also important for maintaining a healthy weight.",
      category: "Nutrition",
      icon: <RestaurantIcon />,
      color: "#66BB6A",
      tags: ["diet", "nutrition", "food"],
      importance: "high",
      actionItems: [
        "Fill half your plate with fruits and vegetables",
        "Choose whole grains over refined grains",
        "Include lean proteins in your meals",
        "Limit processed foods and added sugars",
        "Practice mindful eating - pay attention to hunger and fullness cues"
      ]
    },
    {
      id: 5,
      title: "Physical Activity Benefits",
      shortDescription: "Regular exercise improves physical and mental wellbeing",
      fullContent: "Regular physical activity has numerous health benefits including improved cardiovascular health, stronger muscles and bones, better weight management, enhanced mental health, and reduced risk of many chronic diseases. Exercise doesn't have to be intense to be beneficial - consistent moderate activity provides significant health benefits.",
      category: "Fitness",
      icon: <FitnessCenterIcon />,
      color: "#FF7043",
      tags: ["exercise", "fitness", "activity"],
      importance: "high",
      actionItems: [
        "Find activities you enjoy to make exercise sustainable",
        "Include both aerobic exercise and strength training in your routine",
        "Start with small, achievable goals and gradually increase intensity",
        "Schedule exercise into your day like any other important appointment",
        "Consider finding an exercise buddy for motivation and accountability"
      ]
    },
    {
      id: 6,
      title: "Sleep Hygiene",
      shortDescription: "Quality sleep is essential for physical and mental recovery",
      fullContent: "Sleep is a critical time for the body to repair and regenerate. Poor sleep is linked to numerous health problems including weakened immunity, increased inflammation, higher risk of heart disease and diabetes, impaired cognitive function, and mental health disorders. Establishing good sleep hygiene habits can significantly improve sleep quality.",
      category: "Wellness",
      icon: <BedtimeIcon />,
      color: "#7E57C2",
      tags: ["sleep", "rest", "recovery"],
      importance: "high",
      actionItems: [
        "Aim for 7-9 hours of sleep per night",
        "Establish a consistent sleep schedule, even on weekends",
        "Create a relaxing bedtime routine",
        "Make your bedroom dark, quiet, and cool",
        "Limit screen time and avoid caffeine before bed"
      ]
    },
    {
      id: 7,
      title: "Medication Management",
      shortDescription: "Proper medication use ensures effectiveness and reduces risks",
      fullContent: "Taking medications properly is crucial for treating health conditions effectively and avoiding potential adverse effects. This includes taking the correct dose at the right time, understanding potential side effects and interactions, and properly storing medications. Never stop prescribed medications without consulting your healthcare provider.",
      category: "Prescription",
      icon: <MedicationIcon />,
      color: "#EC407A",
      tags: ["medication", "prescription", "treatment"],
      importance: "high",
      actionItems: [
        "Use a medication organizer if taking multiple medications",
        "Set reminders to take medications on schedule",
        "Keep an updated list of all medications including over-the-counter drugs and supplements",
        "Ask your healthcare provider or pharmacist about any concerns or side effects",
        "Store medications properly according to instructions"
      ]
    },
    {
      id: 8,
      title: "Stress Management",
      shortDescription: "Chronic stress negatively impacts physical and mental health",
      fullContent: "While some stress is normal, chronic stress can have serious health consequences including increased risk of heart disease, digestive problems, weakened immune system, sleep disturbances, and mental health disorders. Learning effective stress management techniques can help mitigate these negative effects and improve overall wellbeing.",
      category: "Mental Health",
      icon: <MonitorHeartIcon />,
      color: "#9C27B0",
      tags: ["stress", "mental health", "relaxation"],
      importance: "medium",
      actionItems: [
        "Practice mindfulness meditation or deep breathing exercises",
        "Engage in regular physical activity",
        "Maintain social connections and seek support when needed",
        "Set boundaries and learn to say no when necessary",
        "Consider professional help if stress becomes overwhelming"
      ]
    }
  ];

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
            background: darkMode ? 'rgba(66, 165, 245, 0.1)' : 'rgba(66, 165, 245, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MedicalServicesIcon sx={{ color: '#42A5F5', mr: 2, fontSize: 28 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Medical Recommendations
              </Typography>
            </Box>
            <Chip 
              label={`${medicalAdvices.length} Tips`} 
              color="primary" 
              size="small"
              sx={{ fontWeight: 'medium' }}
            />
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            <Grid container spacing={2}>
              {medicalAdvices.slice(0, 4).map((advice) => (
                <Grid item xs={12} sm={6} key={advice.id}>
                  <Card 
                    elevation={0} 
                    sx={{ 
                      height: '100%',
                      border: '1px solid',
                      borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      borderRadius: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: darkMode ? '0 4px 12px rgba(255,255,255,0.1)' : '0 4px 12px rgba(0,0,0,0.08)',
                        transform: 'translateY(-3px)',
                      }
                    }}
                  >
                    <CardActionArea 
                      onClick={() => handleOpenDialog(advice)}
                      sx={{ height: '100%', p: 0 }}
                    >
                      <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        <Box sx={{ display: 'flex', mb: 1.5, justifyContent: 'space-between' }}>
                          <Box 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              p: 0.5, 
                              borderRadius: 1,
                              bgcolor: `${advice.color}15`,
                              color: advice.color,
                            }}
                          >
                            {advice.icon}
                            <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 'medium' }}>
                              {advice.category}
                            </Typography>
                          </Box>
                          <IconButton 
                            size="small" 
                            onClick={(e) => toggleSaveAdvice(advice.id, e)}
                            sx={{ color: savedAdvice.includes(advice.id) ? advice.color : 'text.secondary' }}
                          >
                            {savedAdvice.includes(advice.id) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                          </IconButton>
                        </Box>
                        
                        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                          {advice.title}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {advice.shortDescription}
                        </Typography>
                        
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {advice.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              variant="outlined"
                              sx={{ 
                                fontSize: '0.7rem', 
                                height: 22,
                                border: '1px solid',
                                borderColor: darkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Button 
              variant="outlined" 
              color="primary" 
              sx={{ 
                mt: 2, 
                width: '100%', 
                borderRadius: 1.5,
                textTransform: 'none',
                fontWeight: 'medium'
              }}
              onClick={() => {}}
            >
              View All Medical Recommendations
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Detailed advice dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' } as any}
      >
        {selectedAdvice && (
          <>
            <DialogTitle 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                pb: 1
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box 
                  sx={{ 
                    mr: 1.5, 
                    display: 'flex', 
                    p: 1, 
                    borderRadius: '50%', 
                    bgcolor: `${selectedAdvice.color}20`,
                    color: selectedAdvice.color
                  }}
                >
                  {selectedAdvice.icon}
                </Box>
                {selectedAdvice.title}
              </Box>
              <IconButton onClick={handleCloseDialog} size="small">
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>
            <Divider />
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedAdvice.fullContent}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mt: 3, mb: 1, fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                Recommended Actions
              </Typography>
              
              <List dense disablePadding>
                {selectedAdvice.actionItems?.map((item, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 28 }}>
                      <Box 
                        sx={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: '50%', 
                          bgcolor: `${selectedAdvice.color}20`,
                          color: selectedAdvice.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 14,
                          fontWeight: 'bold'
                        }}
                      >
                        {index + 1}
                      </Box>
                    </ListItemIcon>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 1 }}>
              <Button 
                onClick={(e) => toggleSaveAdvice(selectedAdvice.id, e)}
                startIcon={savedAdvice.includes(selectedAdvice.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                sx={{ textTransform: 'none' }}
              >
                {savedAdvice.includes(selectedAdvice.id) ? 'Saved' : 'Save for Later'}
              </Button>
              <Button 
                startIcon={<ShareIcon />}
                sx={{ textTransform: 'none' }}
              >
                Share
              </Button>
              <Button 
                variant="contained" 
                onClick={handleCloseDialog}
                sx={{ 
                  ml: 'auto', 
                  bgcolor: selectedAdvice.color,
                  '&:hover': {
                    bgcolor: selectedAdvice.color,
                    filter: 'brightness(0.9)'
                  },
                  textTransform: 'none'
                }}
              >
                Got It
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
};

export default MedicalSuggestions; 