import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Avatar, 
  IconButton,
  Tooltip,
  Fade,
  Divider 
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement';
import NightShelterIcon from '@mui/icons-material/NightShelter';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useTheme } from './ThemeContext';

interface Tip {
  id: number;
  category: string;
  title: string;
  content: string;
  icon: React.ReactNode;
  color: string;
}

const healthTips: Tip[] = [
  {
    id: 1,
    category: 'Nutrition',
    title: 'Hydration Matters',
    content: 'Drink at least 8 glasses of water daily. Stay hydrated to maintain energy levels and support organ function.',
    icon: <RestaurantIcon />,
    color: '#4CAF50'
  },
  {
    id: 2,
    category: 'Exercise',
    title: '10,000 Steps',
    content: 'Try to achieve 10,000 steps daily for cardiovascular health and weight management.',
    icon: <FitnessCenterIcon />,
    color: '#F44336'
  },
  {
    id: 3,
    category: 'Mental Health',
    title: 'Mindful Minutes',
    content: 'Take 5 minutes each day for mindfulness meditation to reduce stress and improve focus.',
    icon: <SelfImprovementIcon />,
    color: '#9C27B0'
  },
  {
    id: 4,
    category: 'Sleep',
    title: 'Sleep Routine',
    content: 'Maintain a consistent sleep schedule, even on weekends, to improve sleep quality.',
    icon: <NightShelterIcon />,
    color: '#2196F3'
  },
  {
    id: 5,
    category: 'Preventive Care',
    title: 'Regular Check-ups',
    content: 'Schedule annual check-ups even when feeling healthy to catch potential issues early.',
    icon: <LocalHospitalIcon />,
    color: '#FF9800'
  },
  {
    id: 6,
    category: 'Nutrition',
    title: 'Colorful Plate',
    content: 'Aim for a colorful plate with various fruits and vegetables to ensure diverse nutrient intake.',
    icon: <RestaurantIcon />,
    color: '#4CAF50'
  },
  {
    id: 7,
    category: 'Mental Health',
    title: 'Digital Detox',
    content: 'Take regular breaks from screens to reduce eye strain and improve mental clarity.',
    icon: <SentimentSatisfiedAltIcon />,
    color: '#9C27B0'
  },
  {
    id: 8,
    category: 'Exercise',
    title: 'Strength Training',
    content: 'Include strength training exercises at least twice a week to maintain muscle mass and bone density.',
    icon: <FitnessCenterIcon />,
    color: '#F44336'
  },
  {
    id: 9,
    category: 'Preventive Care',
    title: 'Sun Protection',
    content: 'Apply sunscreen daily, even on cloudy days, to protect your skin from UV damage.',
    icon: <LocalHospitalIcon />,
    color: '#FF9800'
  },
  {
    id: 10,
    category: 'Sleep',
    title: 'Bedtime Routine',
    content: 'Establish a relaxing bedtime routine to signal your body it\'s time to wind down.',
    icon: <NightShelterIcon />,
    color: '#2196F3'
  }
];

const HealthTips: React.FC = () => {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const { darkMode } = useTheme();

  useEffect(() => {
    getRandomTip();
  }, []);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * healthTips.length);
    setCurrentTip(healthTips[randomIndex]);
    setLiked(false);
  };

  if (!currentTip) return null;

  return (
    <Card sx={{ 
      height: '100%',
      transition: 'all 0.3s',
      '&:hover': {
        boxShadow: (theme) => `0 8px 16px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.1)'}`
      }
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                bgcolor: currentTip.color,
                mr: 1.5,
                boxShadow: darkMode ? '0 0 8px rgba(255,255,255,0.2)' : '0 2px 4px rgba(0,0,0,0.2)',
              }}
            >
              {currentTip.icon}
            </Avatar>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {currentTip.category}
              </Typography>
              <Typography variant="h6" component="div" gutterBottom={false}>
                {currentTip.title}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Tooltip title="Refresh tip" arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
              <IconButton onClick={getRandomTip} size="small">
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={liked ? "Saved" : "Save for later"} arrow TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
              <IconButton onClick={() => setLiked(!liked)} size="small">
                <FavoriteBorderIcon fontSize="small" color={liked ? "error" : "inherit"} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
          {currentTip.content}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          mt: 2, 
          opacity: 0.7,
          '&:hover': { opacity: 1 } 
        }}>
          <Typography variant="caption" color="text.secondary">
            Tip #{currentTip.id}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HealthTips; 