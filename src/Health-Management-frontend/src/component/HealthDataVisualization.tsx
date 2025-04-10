import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  ButtonGroup,
  Tabs,
  Tab,
  Divider,
  Paper,
  useTheme as useMuiTheme
} from '@mui/material';
import { useTheme } from './ThemeContext';
import TimelineIcon from '@mui/icons-material/Timeline';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import BedtimeIcon from '@mui/icons-material/Bedtime';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

// Mock chart component - in a real app, you would use a library like recharts, visx, or chart.js
const Chart = ({ type, data, color }: { type: string; data: any[]; color: string }) => {
  const muiTheme = useMuiTheme();
  const { darkMode } = useTheme();
  
  // Simple line chart visualization
  return (
    <Box sx={{ height: 200, width: '100%', mt: 2, position: 'relative' }}>
      {/* Chart background grid */}
      <Box sx={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        display: 'grid',
        gridTemplateRows: 'repeat(4, 1fr)',
        gridTemplateColumns: 'repeat(1, 1fr)',
      }}>
        {[...Array(4)].map((_, i) => (
          <Box 
            key={i} 
            sx={{ 
              borderBottom: i === 3 ? '2px solid' : '1px dashed', 
              borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' 
            }} 
          />
        ))}
      </Box>
      
      {/* Chart line */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          p: 1
        }}
      >
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d={`M0,${100 - data[0]} ${data.map((value, index) => `L${index * (100 / (data.length - 1))},${100 - value}`).join(' ')}`}
            fill="none"
            stroke={color}
            strokeWidth="3"
          />
          {data.map((value, index) => (
            <circle
              key={index}
              cx={index * (100 / (data.length - 1))}
              cy={100 - value}
              r="2"
              fill={muiTheme.palette.background.paper}
              stroke={color}
              strokeWidth="2"
            />
          ))}
        </svg>
      </Box>
      
      {/* X-axis labels */}
      <Box sx={{ 
        position: 'absolute', 
        left: 0, 
        right: 0, 
        bottom: -25, 
        display: 'flex', 
        justifyContent: 'space-between',
        px: 1,
        fontSize: '0.75rem',
        color: 'text.secondary'
      }}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
          <Box key={i}>{day}</Box>
        ))}
      </Box>
    </Box>
  );
};

const HealthDataVisualization: React.FC = () => {
  const { darkMode } = useTheme();
  const [timeRange, setTimeRange] = useState<string>('week');
  const [dataType, setDataType] = useState<string>('activity');
  
  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };
  
  const handleDataTypeChange = (event: React.SyntheticEvent, newValue: string) => {
    setDataType(newValue);
  };
  
  // Mock health data
  const healthData = {
    activity: {
      daily: [5400, 7200, 8300, 6500, 9000, 7800, 5000],
      week: [6500, 7100, 7500, 6800, 7900, 7200, 6000],
      month: [6800, 7000, 7300, 7500, 7200, 7400, 7100],
      unit: 'steps',
      goal: 8000,
      color: '#FF7043',
      insights: [
        "You've been 15% more active compared to last week",
        "Try to reach 8,000 steps daily for optimal cardiovascular health",
        "Your most active day is Wednesday"
      ]
    },
    heartRate: {
      daily: [72, 75, 78, 71, 74, 73, 70],
      week: [73, 74, 75, 73, 72, 71, 72],
      month: [74, 73, 72, 73, 72, 71, 72],
      unit: 'bpm',
      goal: 'Below 80',
      color: '#EF5350',
      insights: [
        "Your resting heart rate is within a healthy range",
        "Your heart rate variability shows good recovery patterns",
        "Your heart rate is typically lowest in the early morning"
      ]
    },
    sleep: {
      daily: [6.5, 7.2, 6.8, 7.5, 6.7, 8.0, 7.2],
      week: [7.0, 7.2, 7.1, 7.3, 7.2, 7.5, 7.1],
      month: [7.2, 7.1, 7.0, 7.3, 7.4, 7.2, 7.1],
      unit: 'hours',
      goal: '7-9',
      color: '#7E57C2',
      insights: [
        "Your sleep quality is improving based on reduced nighttime awakenings",
        "You typically get more deep sleep on days with higher physical activity",
        "Consider going to bed 30 minutes earlier to optimize your sleep cycle"
      ]
    },
    weight: {
      daily: [75.5, 75.3, 75.4, 75.2, 75.0, 74.9, 75.1],
      week: [75.2, 75.1, 75.0, 74.9, 74.8, 74.7, 74.8],
      month: [76.0, 75.8, 75.5, 75.3, 75.1, 74.9, 74.8],
      unit: 'kg',
      goal: '70-75',
      color: '#26A69A',
      insights: [
        "Your weight has been stable over the past week",
        "You're making steady progress toward your target weight range",
        "Weight fluctuations are normal - focus on the overall trend"
      ]
    },
    nutrition: {
      daily: [1900, 2100, 2000, 2200, 1950, 2250, 2050],
      week: [2050, 2100, 2000, 2050, 2100, 2150, 2050],
      month: [2100, 2050, 2100, 2150, 2100, 2050, 2100],
      unit: 'kcal',
      goal: '2000',
      color: '#66BB6A',
      insights: [
        "You're maintaining a good calorie balance most days",
        "Consider increasing protein intake on workout days",
        "Your weekend meals tend to be higher in calories than weekday meals"
      ]
    }
  };
  
  // Get current data based on selected type and time range
  const currentData = healthData[dataType as keyof typeof healthData][timeRange as keyof typeof healthData.activity];
  const currentUnit = healthData[dataType as keyof typeof healthData].unit;
  const currentColor = healthData[dataType as keyof typeof healthData].color;
  const currentGoal = healthData[dataType as keyof typeof healthData].goal;
  const currentInsights = healthData[dataType as keyof typeof healthData].insights;
  
  // Calculate average value
  const average = Array.isArray(currentData) 
    ? Math.round((currentData as number[]).reduce((sum: number, value: number) => sum + value, 0) / (currentData as number[]).length)
    : 0;
  
  // Calculate percentage change (mock calculation)
  const percentChange = Array.isArray(currentData) && currentData.length > 0
    ? Math.round((((currentData as number[])[currentData.length - 1] - (currentData as number[])[0]) / (currentData as number[])[0]) * 100)
    : 0;
  
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <DirectionsRunIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Fitness Data
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your fitness progress and achieve your health goals
        </Typography>
      </Box>
    
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
            background: darkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TimelineIcon sx={{ color: '#1976D2', mr: 2, fontSize: 28 }} />
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                Health Data Insights
              </Typography>
            </Box>
            
            <ButtonGroup size="small" variant="outlined">
              <Button 
                onClick={() => handleTimeRangeChange('daily')}
                sx={{ 
                  fontSize: '0.75rem',
                  backgroundColor: timeRange === 'daily' ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25, 118, 210, 0.1)') : 'transparent',
                  borderColor: 'divider',
                  color: timeRange === 'daily' ? 'primary.main' : 'text.secondary',
                  '&:hover': { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.05)' }
                }}
              >
                Daily
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('week')}
                sx={{ 
                  fontSize: '0.75rem',
                  backgroundColor: timeRange === 'week' ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25, 118, 210, 0.1)') : 'transparent',
                  borderColor: 'divider',
                  color: timeRange === 'week' ? 'primary.main' : 'text.secondary',
                  '&:hover': { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.05)' }
                }}
              >
                Weekly
              </Button>
              <Button 
                onClick={() => handleTimeRangeChange('month')}
                sx={{ 
                  fontSize: '0.75rem',
                  backgroundColor: timeRange === 'month' ? (darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(25, 118, 210, 0.1)') : 'transparent',
                  borderColor: 'divider',
                  color: timeRange === 'month' ? 'primary.main' : 'text.secondary',
                  '&:hover': { backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(25, 118, 210, 0.05)' }
                }}
              >
                Monthly
              </Button>
            </ButtonGroup>
          </Box>
          
          <Divider />
          
          <Box sx={{ p: 3 }}>
            <Tabs
              value={dataType}
              onChange={handleDataTypeChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                mb: 3,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                  fontSize: '0.875rem',
                }
              }}
            >
              <Tab 
                icon={<DirectionsRunIcon fontSize="small" />} 
                iconPosition="start" 
                label="Activity" 
                value="activity" 
                sx={{ color: dataType === 'activity' ? healthData.activity.color : 'inherit' }}
              />
              <Tab 
                icon={<FavoriteIcon fontSize="small" />} 
                iconPosition="start" 
                label="Heart Rate" 
                value="heartRate" 
                sx={{ color: dataType === 'heartRate' ? healthData.heartRate.color : 'inherit' }}
              />
              <Tab 
                icon={<BedtimeIcon fontSize="small" />} 
                iconPosition="start" 
                label="Sleep" 
                value="sleep" 
                sx={{ color: dataType === 'sleep' ? healthData.sleep.color : 'inherit' }}
              />
              <Tab 
                icon={<MonitorWeightIcon fontSize="small" />} 
                iconPosition="start" 
                label="Weight" 
                value="weight" 
                sx={{ color: dataType === 'weight' ? healthData.weight.color : 'inherit' }}
              />
              <Tab 
                icon={<RestaurantIcon fontSize="small" />} 
                iconPosition="start" 
                label="Nutrition" 
                value="nutrition" 
                sx={{ color: dataType === 'nutrition' ? healthData.nutrition.color : 'inherit' }}
              />
            </Tabs>
            
            <Grid container spacing={3}>
              {/* Chart section */}
              <Grid item xs={12} md={8}>
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: currentColor }}>
                      {dataType === 'activity' && 'Daily Steps'}
                      {dataType === 'heartRate' && 'Resting Heart Rate'}
                      {dataType === 'sleep' && 'Sleep Duration'}
                      {dataType === 'weight' && 'Weight Tracking'}
                      {dataType === 'nutrition' && 'Calorie Intake'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Goal: {currentGoal} {currentUnit}
                    </Typography>
                  </Box>
                  
                  <Chart 
                    type={dataType} 
                    data={Array.isArray(currentData) 
                      ? (currentData as number[]).map((value: number) => value * 90 / Math.max(...(currentData as number[])))
                      : []} 
                    color={currentColor} 
                  />
                  
                  <Box sx={{ 
                    mt: 3, 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'flex-end'
                  }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Average
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', color: currentColor, lineHeight: 1.2 }}>
                        {average}
                        <Typography component="span" variant="body2" sx={{ ml: 0.5 }}>
                          {currentUnit}
                        </Typography>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ textAlign: 'right' }}>
                      <Box sx={{ 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        backgroundColor: percentChange >= 0 ? 'rgba(102, 187, 106, 0.1)' : 'rgba(239, 83, 80, 0.1)',
                        color: percentChange >= 0 ? 'success.main' : 'error.main',
                      }}>
                        <Typography variant="body2" fontWeight="medium">
                          {percentChange >= 0 ? '+' : ''}{percentChange}% from {timeRange === 'daily' ? 'yesterday' : timeRange === 'week' ? 'last week' : 'last month'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              
              {/* Insights section */}
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    height: '100%',
                    backgroundColor: darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <InfoOutlinedIcon fontSize="small" sx={{ mr: 1, color: currentColor }} />
                    <Typography variant="subtitle1" fontWeight="bold">
                      AI Insights
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ mb: 2 }} />
                  
                  {currentInsights.map((insight, index) => (
                    <Box 
                      key={index} 
                      sx={{ 
                        mb: 1.5, 
                        p: 1.5,
                        borderRadius: 1,
                        backgroundColor: `${currentColor}10`,
                        border: '1px solid',
                        borderColor: `${currentColor}30`
                      }}
                    >
                      <Typography variant="body2">
                        {insight}
                      </Typography>
                    </Box>
                  ))}
                  
                  <Button 
                    variant="outlined" 
                    size="small" 
                    fullWidth 
                    sx={{ 
                      mt: 1,
                      borderColor: currentColor,
                      color: currentColor,
                      '&:hover': {
                        borderColor: currentColor,
                        backgroundColor: `${currentColor}10`
                      },
                      textTransform: 'none'
                    }}
                  >
                    View Detailed Analysis
                  </Button>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};

export default HealthDataVisualization; 