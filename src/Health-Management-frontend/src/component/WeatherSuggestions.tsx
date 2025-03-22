import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  CircularProgress,
  Divider,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Grid,
  Alert
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import FlareIcon from '@mui/icons-material/Flare';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import MasksIcon from '@mui/icons-material/Masks';
import FilterDramaIcon from '@mui/icons-material/FilterDrama';
import OpacityIcon from '@mui/icons-material/Opacity';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import { useTheme } from './ThemeContext';

interface WeatherSuggestion {
  id: number;
  condition: string;
  icon: React.ReactNode;
  color: string;
  tips: Array<{
    text: string;
    importance: 'high' | 'medium' | 'low';
  }>;
}

const WeatherSuggestions: React.FC = () => {
  const { darkMode } = useTheme();
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTips, setSelectedTips] = useState<WeatherSuggestion | null>(null);

  // Mock weather data - in a real application, this would come from a weather API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Generate random weather for demo purposes
      const conditions = ['sunny', 'rainy', 'hot', 'cold', 'humid', 'windy', 'stormy', 'snowy', 'polluted', 'foggy'];
      const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
      
      const mockWeather = {
        location: 'New Delhi, India',
        temperature: Math.floor(Math.random() * 30) + 10, // 10-40°C
        condition: randomCondition,
        humidity: Math.floor(Math.random() * 60) + 30, // 30-90%
        windSpeed: Math.floor(Math.random() * 20) + 1, // 1-21 km/h
        uvIndex: Math.floor(Math.random() * 10) + 1, // 1-11
        aqi: Math.floor(Math.random() * 300) + 20, // 20-320
      };
      
      setWeather(mockWeather);
      setLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (weather) {
      const matchedSuggestion = weatherSuggestions.find(s => s.condition === weather.condition);
      setSelectedTips(matchedSuggestion || null);
    }
  }, [weather]);

  // Weather-based health suggestions - these are legitimate health tips based on weather conditions
  const weatherSuggestions: WeatherSuggestion[] = [
    {
      id: 1,
      condition: 'sunny',
      icon: <WbSunnyIcon fontSize="large" />,
      color: '#FFB300',
      tips: [
        { 
          text: 'Apply broad-spectrum sunscreen with SPF 30+ every 2 hours when outdoors', 
          importance: 'high' 
        },
        { 
          text: 'Wear UV-blocking sunglasses to protect your eyes from harmful rays',
          importance: 'high' 
        },
        { 
          text: 'Schedule outdoor activities before 10 AM or after 4 PM to avoid peak UV hours',
          importance: 'medium' 
        },
        { 
          text: 'Wear lightweight, loose-fitting clothing that covers arms and legs',
          importance: 'medium' 
        },
        { 
          text: 'Stay in the shade when possible, especially during midday hours',
          importance: 'medium' 
        }
      ]
    },
    {
      id: 2,
      condition: 'rainy',
      icon: <UmbrellaIcon fontSize="large" />,
      color: '#42A5F5',
      tips: [
        { 
          text: 'Ensure you dry off completely when coming indoors to prevent chills',
          importance: 'medium' 
        },
        { 
          text: 'Wear waterproof footwear to keep feet dry and prevent fungal infections',
          importance: 'medium' 
        },
        { 
          text: 'Be cautious of slippery surfaces to avoid falls and injuries',
          importance: 'high' 
        },
        { 
          text: 'Avoid wading through flooded areas which may contain contaminants',
          importance: 'high' 
        },
        { 
          text: 'Check for water leaks in your home that could lead to mold growth',
          importance: 'medium' 
        }
      ]
    },
    {
      id: 3,
      condition: 'hot',
      icon: <ThermostatIcon fontSize="large" />,
      color: '#F44336',
      tips: [
        { 
          text: 'Drink plenty of water throughout the day, even if you don\'t feel thirsty',
          importance: 'high' 
        },
        { 
          text: 'Avoid alcohol, caffeine, and sugary drinks which can contribute to dehydration',
          importance: 'medium' 
        },
        { 
          text: 'Take frequent breaks in air-conditioned or shaded areas when outdoors',
          importance: 'high' 
        },
        { 
          text: 'Watch for signs of heat exhaustion: heavy sweating, weakness, cold/pale/clammy skin',
          importance: 'high' 
        },
        { 
          text: 'Wear lightweight, light-colored, loose-fitting clothing to stay cooler',
          importance: 'medium' 
        }
      ]
    },
    {
      id: 4,
      condition: 'cold',
      icon: <AcUnitIcon fontSize="large" />,
      color: '#90CAF9',
      tips: [
        { 
          text: 'Dress in layers to trap warm air between clothing and regulate body temperature',
          importance: 'high' 
        },
        { 
          text: 'Keep your head, hands, and feet covered as they lose heat quickly',
          importance: 'high' 
        },
        { 
          text: 'Maintain indoor temperature between 18-21°C (64-70°F) for comfort and health',
          importance: 'medium' 
        },
        { 
          text: 'Stay dry - wet clothing loses insulating properties and cools the body quickly',
          importance: 'high' 
        },
        { 
          text: 'Watch for signs of hypothermia: shivering, confusion, drowsiness, or slurred speech',
          importance: 'high' 
        }
      ]
    },
    {
      id: 5,
      condition: 'humid',
      icon: <OpacityIcon fontSize="large" />,
      color: '#4FC3F7',
      tips: [
        { 
          text: 'Use a dehumidifier to keep indoor humidity levels between 30-50%',
          importance: 'medium' 
        },
        { 
          text: 'Wear moisture-wicking clothing to help sweat evaporate from your skin',
          importance: 'medium' 
        },
        { 
          text: 'Stay hydrated as your body works harder to cool itself in humid conditions',
          importance: 'high' 
        },
        { 
          text: 'Avoid intense physical activity during peak humidity hours',
          importance: 'high' 
        },
        { 
          text: 'Be vigilant about mold growth in your home, which thrives in humid conditions',
          importance: 'medium' 
        }
      ]
    },
    {
      id: 6,
      condition: 'windy',
      icon: <AirIcon fontSize="large" />,
      color: '#78909C',
      tips: [
        { 
          text: 'Secure loose objects around your home to prevent injuries from flying debris',
          importance: 'high' 
        },
        { 
          text: 'Apply moisturizer to prevent skin from drying out due to increased evaporation',
          importance: 'medium' 
        },
        { 
          text: 'Wear eye protection in very windy conditions to prevent irritation from dust',
          importance: 'medium' 
        },
        { 
          text: 'Be cautious of pollen levels which can be higher on windy days',
          importance: 'medium' 
        },
        { 
          text: 'If you have respiratory conditions, consider limiting outdoor exposure',
          importance: 'high' 
        }
      ]
    },
    {
      id: 7,
      condition: 'stormy',
      icon: <ThunderstormIcon fontSize="large" />,
      color: '#5C6BC0',
      tips: [
        { 
          text: 'Stay indoors during thunderstorms and away from windows',
          importance: 'high' 
        },
        { 
          text: 'Avoid using corded phones and electrical appliances during lightning storms',
          importance: 'high' 
        },
        { 
          text: 'Have an emergency kit ready with essentials like medications, water, and first aid',
          importance: 'high' 
        },
        { 
          text: 'If you have medical equipment requiring electricity, have a backup power plan',
          importance: 'high' 
        },
        { 
          text: 'Keep your phone charged to stay updated on weather alerts',
          importance: 'medium' 
        }
      ]
    },
    {
      id: 8,
      condition: 'snowy',
      icon: <AcUnitIcon fontSize="large" />,
      color: '#B3E5FC',
      tips: [
        { 
          text: 'Wear footwear with good traction to prevent slips and falls',
          importance: 'high' 
        },
        { 
          text: 'Dress in waterproof, insulated layers to stay warm and dry',
          importance: 'high' 
        },
        { 
          text: 'Avoid overexertion when shoveling snow to reduce risk of heart strain',
          importance: 'high' 
        },
        { 
          text: 'Keep emergency supplies in your vehicle including blankets and food',
          importance: 'medium' 
        },
        { 
          text: 'Be aware of carbon monoxide dangers from snow-blocked vents or improperly used heaters',
          importance: 'high' 
        }
      ]
    },
    {
      id: 9,
      condition: 'polluted',
      icon: <MasksIcon fontSize="large" />,
      color: '#78909C',
      tips: [
        { 
          text: 'Monitor air quality index (AQI) and limit outdoor activities when levels are unhealthy',
          importance: 'high' 
        },
        { 
          text: 'Consider wearing an N95 respirator mask when outdoors in poor air quality',
          importance: 'high' 
        },
        { 
          text: 'Keep windows closed and use air purifiers with HEPA filters indoors',
          importance: 'medium' 
        },
        { 
          text: 'Stay well-hydrated to help your body clear toxins more efficiently',
          importance: 'medium' 
        },
        { 
          text: 'If you have asthma or other respiratory conditions, keep rescue medications readily available',
          importance: 'high' 
        }
      ]
    },
    {
      id: 10,
      condition: 'foggy',
      icon: <FilterDramaIcon fontSize="large" />,
      color: '#BDBDBD',
      tips: [
        { 
          text: 'Drive with caution and use low beam headlights in foggy conditions',
          importance: 'high' 
        },
        { 
          text: 'Wear reflective clothing if walking outdoors to increase visibility',
          importance: 'high' 
        },
        { 
          text: 'Be aware that fog can trigger respiratory symptoms in sensitive individuals',
          importance: 'medium' 
        },
        { 
          text: 'Allow extra time for travel to reduce stress and accident risk',
          importance: 'medium' 
        },
        { 
          text: 'Consider postponing outdoor exercise until visibility improves',
          importance: 'medium' 
        }
      ]
    }
  ];

  if (loading) {
    return (
      <Card 
        elevation={darkMode ? 3 : 1}
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 3,
          background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'white',
        }}
      >
        <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 250 }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} sx={{ mb: 2 }} />
            <Typography variant="body1">Loading weather information...</Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        elevation={darkMode ? 3 : 1}
        sx={{ 
          borderRadius: 2, 
          overflow: 'hidden',
          mb: 3,
          background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'white',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Typography variant="body2">
            We're unable to provide weather-based health suggestions at this time. Please check back later.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
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
          background: selectedTips ? `linear-gradient(to right, ${selectedTips.color}${darkMode ? '40' : '15'}, ${darkMode ? 'rgba(30, 30, 30, 0)' : 'rgba(255, 255, 255, 0)'})` : 'transparent',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            mr: 2, 
            color: selectedTips?.color
          }}>
            {selectedTips?.icon || <WbSunnyIcon fontSize="large" />}
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mr: 2 }}>
            Weather Health Tips
          </Typography>
          <Chip 
            label={weather.condition.charAt(0).toUpperCase() + weather.condition.slice(1)} 
            color="primary" 
            size="small"
            sx={{ 
              bgcolor: selectedTips?.color || 'primary.main', 
              fontWeight: 'bold',
              color: '#fff'
            }} 
          />
        </Box>
        
        <Divider />
        
        <Grid container>
          {/* Weather data panel */}
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, borderRight: { xs: 'none', md: '1px solid' }, borderColor: 'divider', height: '100%' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Current Weather in {weather.location}
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <ThermostatIcon color="error" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Temperature" 
                    secondary={`${weather.temperature}°C`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <WaterDropIcon color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Humidity" 
                    secondary={`${weather.humidity}%`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <AirIcon color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Wind Speed" 
                    secondary={`${weather.windSpeed} km/h`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <FlareIcon sx={{ color: '#FFA000' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="UV Index" 
                    secondary={`${weather.uvIndex} ${weather.uvIndex > 5 ? '(High)' : '(Moderate)'}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold' }}
                  />
                </ListItem>
                
                <ListItem>
                  <ListItemIcon>
                    <MasksIcon color="disabled" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Air Quality" 
                    secondary={`AQI: ${weather.aqi} ${weather.aqi > 100 ? '(Unhealthy)' : weather.aqi > 50 ? '(Moderate)' : '(Good)'}`} 
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'body1', fontWeight: 'bold', color: weather.aqi > 100 ? 'error.main' : weather.aqi > 50 ? 'warning.main' : 'success.main' }}
                  />
                </ListItem>
              </List>
            </Box>
          </Grid>
          
          {/* Health tips panel */}
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center' }}>
                <Box component="span" sx={{ 
                  display: 'inline-block', 
                  width: 12, 
                  height: 12, 
                  borderRadius: '50%', 
                  bgcolor: selectedTips?.color || 'primary.main',
                  mr: 1 
                }} />
                Recommended Health Precautions
              </Typography>
              
              {selectedTips ? (
                <List>
                  {selectedTips.tips.map((tip, index) => (
                    <ListItem key={index} alignItems="flex-start" sx={{ py: 1 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box 
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            borderRadius: '50%', 
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: tip.importance === 'high' ? 'error.main' : tip.importance === 'medium' ? 'warning.main' : 'info.main',
                            color: 'white',
                            fontSize: 14,
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={tip.text}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          fontWeight: tip.importance === 'high' ? 'bold' : 'regular'
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No specific health recommendations available for the current weather conditions.
                </Typography>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    bgcolor: darkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 1
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    These recommendations are based on general guidelines. If you have specific health conditions, please consult your healthcare provider for personalized advice.
                  </Typography>
                </Paper>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default WeatherSuggestions; 