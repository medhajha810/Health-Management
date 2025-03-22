import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  LinearProgress,
  CircularProgress,
  Grid,
  Chip,
  ButtonGroup,
  Button,
  Tabs,
  Tab,
  Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import HotelIcon from '@mui/icons-material/Hotel';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LineChart from '@mui/icons-material/ShowChart';

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  color: string;
  icon: React.ReactNode;
}

const HealthMetrics: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>('week');
  const [tabValue, setTabValue] = useState<number>(0);

  // Mock metrics data
  const metrics: Metric[] = [
    {
      id: 'steps',
      name: 'Steps',
      value: 8432,
      unit: 'steps',
      target: 10000,
      trend: 'up',
      change: 12.5,
      color: '#2196F3',
      icon: <DirectionsWalkIcon />
    },
    {
      id: 'heartrate',
      name: 'Heart Rate',
      value: 72,
      unit: 'bpm',
      target: 80,
      trend: 'stable',
      change: 0,
      color: '#F44336',
      icon: <FavoriteIcon />
    },
    {
      id: 'sleep',
      name: 'Sleep',
      value: 7.2,
      unit: 'hours',
      target: 8,
      trend: 'down',
      change: -5.3,
      color: '#673AB7',
      icon: <HotelIcon />
    },
    {
      id: 'calories',
      name: 'Calories',
      value: 1850,
      unit: 'kcal',
      target: 2000,
      trend: 'stable',
      change: 2.1,
      color: '#FF9800',
      icon: <RestaurantIcon />
    },
    {
      id: 'weight',
      name: 'Weight',
      value: 68.5,
      unit: 'kg',
      target: 70,
      trend: 'down',
      change: -1.2,
      color: '#4CAF50',
      icon: <MonitorWeightIcon />
    }
  ];

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Filter metrics based on selected tab
  const filteredMetrics = tabValue === 0 
    ? metrics 
    : tabValue === 1 
      ? metrics.filter(m => ['steps', 'calories'].includes(m.id))
      : metrics.filter(m => ['heartrate', 'sleep'].includes(m.id));

  const getTrendIcon = (trend: string, change: number) => {
    if (trend === 'up') {
      return (
        <Box component="span" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: change > 0 ? 'success.main' : 'error.main'
        }}>
          <ArrowUpwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          {Math.abs(change)}%
        </Box>
      );
    } else if (trend === 'down') {
      return (
        <Box component="span" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: change < 0 ? 'error.main' : 'success.main'
        }}>
          <ArrowDownwardIcon fontSize="small" sx={{ mr: 0.5 }} />
          {Math.abs(change)}%
        </Box>
      );
    } else {
      return (
        <Box component="span" sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'text.secondary'
        }}>
          {/* Horizontal arrow or stable indicator */}
          {Math.abs(change)}%
        </Box>
      );
    }
  };

  const getProgressColor = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    if (percentage >= 90) return 'success';
    if (percentage >= 75) return 'info';
    if (percentage >= 50) return 'warning';
    return 'error';
  };

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
          <Typography variant="h6" component="div">
            Health Metrics
          </Typography>
          <ButtonGroup size="small" variant="outlined">
            <Button 
              onClick={() => handleTimeRangeChange('week')} 
              variant={timeRange === 'week' ? 'contained' : 'outlined'}
            >
              Week
            </Button>
            <Button 
              onClick={() => handleTimeRangeChange('month')} 
              variant={timeRange === 'month' ? 'contained' : 'outlined'}
            >
              Month
            </Button>
            <Button 
              onClick={() => handleTimeRangeChange('year')} 
              variant={timeRange === 'year' ? 'contained' : 'outlined'}
            >
              Year
            </Button>
          </ButtonGroup>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          sx={{ mb: 2 }}
        >
          <Tab label="All" />
          <Tab label="Activity" />
          <Tab label="Health" />
        </Tabs>

        <Grid container spacing={2}>
          {filteredMetrics.map((metric) => (
            <Grid item xs={12} sm={6} key={metric.id}>
              <Box sx={{ 
                p: 1.5, 
                bgcolor: 'background.paper', 
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        color: metric.color, 
                        display: 'flex', 
                        mr: 1, 
                        '& > svg': { fontSize: '1.2rem' } 
                      }}
                    >
                      {metric.icon}
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {metric.name}
                    </Typography>
                  </Box>
                  {getTrendIcon(metric.trend, metric.change)}
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 0.5 }}>
                  <Typography variant="h6" component="div" sx={{ mr: 1 }}>
                    {metric.value.toLocaleString()}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {metric.unit}
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min((metric.value / metric.target) * 100, 100)} 
                    color={getProgressColor(metric.value, metric.target) as 'success' | 'info' | 'warning' | 'error'}
                    sx={{ flexGrow: 1, mr: 1, height: 6, borderRadius: 3 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {Math.round((metric.value / metric.target) * 100)}%
                  </Typography>
                </Box>
                
                <Typography variant="caption" color="text.secondary">
                  Target: {metric.target} {metric.unit}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Tooltip title="View detailed charts">
            <Chip 
              icon={<LineChart />} 
              label="View detailed trends" 
              color="primary" 
              variant="outlined"
              clickable
              onClick={() => console.log('View detailed trends')}
            />
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HealthMetrics; 