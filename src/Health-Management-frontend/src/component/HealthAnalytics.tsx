import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Card, 
  CardContent, Divider, FormControl, InputLabel,
  Select, MenuItem, Button, Tab, Tabs
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  LocalHospital as LocalHospitalIcon,
  FitnessCenter as FitnessCenterIcon,
  Monitor as MonitorIcon,
  Favorite as HeartIcon,
  DirectionsRun as RunningIcon,
  Healing as HealingIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  ShowChart as LineChartIcon,
  DateRange as DateRangeIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { motion } from 'framer-motion';
import { SelectChangeEvent } from '@mui/material/Select';

// Mock data for charts
const mockVitalData = {
  bloodPressure: [
    { date: '2023-01-01', systolic: 120, diastolic: 80 },
    { date: '2023-02-01', systolic: 118, diastolic: 78 },
    { date: '2023-03-01', systolic: 122, diastolic: 82 },
    { date: '2023-04-01', systolic: 125, diastolic: 85 },
    { date: '2023-05-01', systolic: 119, diastolic: 79 },
    { date: '2023-06-01', systolic: 121, diastolic: 81 }
  ],
  heartRate: [
    { date: '2023-01-01', value: 72 },
    { date: '2023-02-01', value: 74 },
    { date: '2023-03-01', value: 70 },
    { date: '2023-04-01', value: 73 },
    { date: '2023-05-01', value: 75 },
    { date: '2023-06-01', value: 72 }
  ],
  glucose: [
    { date: '2023-01-01', value: 95 },
    { date: '2023-02-01', value: 98 },
    { date: '2023-03-01', value: 92 },
    { date: '2023-04-01', value: 96 },
    { date: '2023-05-01', value: 97 },
    { date: '2023-06-01', value: 94 }
  ]
};

const mockExerciseData = [
  { day: 'Mon', calories: 250, steps: 8000, duration: 30 },
  { day: 'Tue', calories: 350, steps: 10000, duration: 45 },
  { day: 'Wed', calories: 200, steps: 7500, duration: 25 },
  { day: 'Thu', calories: 400, steps: 12000, duration: 50 },
  { day: 'Fri', calories: 300, steps: 9000, duration: 35 },
  { day: 'Sat', calories: 450, steps: 15000, duration: 60 },
  { day: 'Sun', calories: 150, steps: 5000, duration: 20 }
];

const mockMedicationData = [
  { name: 'Medication A', adherence: 95 },
  { name: 'Medication B', adherence: 80 },
  { name: 'Medication C', adherence: 100 },
  { name: 'Medication D', adherence: 75 }
];

const HealthAnalytics: React.FC = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState('6m'); // 1w, 1m, 3m, 6m, 1y
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleTimeRangeChange = (event: SelectChangeEvent) => {
    setTimeRange(event.target.value as string);
  };

  // Animation variants
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

  // Sample chart components (we would use a real charting library like recharts or chart.js in a real app)
  const VitalsChart = () => (
    <Box sx={{ p: 2, height: 300, position: 'relative' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', height: '100%' }}>
          <Box sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            pr: 2 
          }}>
            {/* Y-axis labels */}
            {[160, 140, 120, 100, 80, 60].map((value, index) => (
              <Box key={index} sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" component="span" sx={{ position: 'absolute', left: -25 }}>
                  {value}
                </Typography>
                <Box sx={{ flexGrow: 1, borderBottom: '1px dashed rgba(128,128,128,0.2)' }} />
              </Box>
            ))}
          </Box>

          {/* Sample chart lines */}
          <Box sx={{ 
            position: 'absolute', 
            top: 20, 
            left: 30, 
            right: 0, 
            bottom: 20, 
            display: 'flex', 
            alignItems: 'flex-end' 
          }}>
            {/* Systolic */}
            <Box sx={{ 
              position: 'relative', 
              width: '100%', 
              height: '100%' 
            }}>
              <Box sx={{ 
                position: 'absolute', 
                bottom: '10%', 
                left: 0, 
                right: 0, 
                height: '60%',
                background: 'linear-gradient(to top, rgba(25, 118, 210, 0.1), rgba(25, 118, 210, 0.01))',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                zIndex: 1
              }} />
              <Box sx={{ 
                position: 'absolute', 
                top: '30%', 
                left: 0, 
                width: '100%', 
                height: 3,
                borderRadius: 1,
                backgroundColor: 'primary.main',
                zIndex: 2
              }} />
              
              {/* Sample data points */}
              {mockVitalData.bloodPressure.map((bp, index) => {
                const x = `${index * (100 / (mockVitalData.bloodPressure.length - 1))}%`;
                const y = `${100 - (bp.systolic - 60) * (100 / 100)}%`;
                
                return (
                  <Box
                    key={`systolic-${index}`}
                    sx={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'primary.main',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 3,
                      boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.2)'
                    }}
                  />
                );
              })}
              
              {/* Diastolic */}
              {mockVitalData.bloodPressure.map((bp, index) => {
                const x = `${index * (100 / (mockVitalData.bloodPressure.length - 1))}%`;
                const y = `${100 - (bp.diastolic - 60) * (100 / 100)}%`;
                
                return (
                  <Box
                    key={`diastolic-${index}`}
                    sx={{
                      position: 'absolute',
                      left: x,
                      top: y,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                      transform: 'translate(-50%, -50%)',
                      zIndex: 3,
                      boxShadow: '0 0 0 3px rgba(211, 47, 47, 0.2)'
                    }}
                  />
                );
              })}
              
              {/* X-axis labels */}
              <Box sx={{ 
                position: 'absolute', 
                bottom: -25, 
                left: 0, 
                right: 0, 
                display: 'flex', 
                justifyContent: 'space-between' 
              }}>
                {mockVitalData.bloodPressure.map((bp, index) => (
                  <Typography key={index} variant="caption" component="span">
                    {bp.date.substring(5)}
                  </Typography>
                ))}
              </Box>
            </Box>
          </Box>
          
          {/* Legend */}
          <Box sx={{ position: 'absolute', top: 5, right: 10, display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'primary.main', mr: 1 }} />
              <Typography variant="caption">Systolic</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'error.main', mr: 1 }} />
              <Typography variant="caption">Diastolic</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );

  const ExerciseChart = () => (
    <Box sx={{ p: 2, height: 300, position: 'relative' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', height: '100%' }}>
          {/* Labels and Axes */}
          <Box sx={{ position: 'absolute', top: 0, left: 30, bottom: 30, width: 1, bgcolor: 'text.secondary' }} />
          <Box sx={{ position: 'absolute', bottom: 30, left: 30, right: 0, height: 1, bgcolor: 'text.secondary' }} />
          
          {/* Bars */}
          <Box sx={{ 
            position: 'absolute', 
            bottom: 31, 
            left: 31, 
            right: 20, 
            height: 'calc(100% - 50px)', 
            display: 'flex', 
            alignItems: 'flex-end',
            justifyContent: 'space-around'
          }}>
            {mockExerciseData.map((day, index) => {
              const height = `${(day.steps / 15000) * 100}%`;
              
              return (
                <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '12%' }}>
                  <Box 
                    sx={{ 
                      width: '100%', 
                      height, 
                      bgcolor: 'success.main',
                      borderTopLeftRadius: 4,
                      borderTopRightRadius: 4
                    }} 
                  />
                  <Typography variant="caption" sx={{ mt: 1 }}>
                    {day.day}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          
          {/* Y-axis labels */}
          <Box sx={{ position: 'absolute', top: 10, left: 0, height: 'calc(100% - 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {[15000, 10000, 5000, 0].map((value, index) => (
              <Typography key={index} variant="caption" sx={{ transform: 'translateY(50%)' }}>
                {value}
              </Typography>
            ))}
          </Box>
          
          {/* Title and Legend */}
          <Box sx={{ position: 'absolute', top: 5, right: 10 }}>
            <Typography variant="subtitle2">Steps Per Day</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );

  const MedicationAdherenceChart = () => (
    <Box sx={{ p: 2, height: 300, position: 'relative' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography>Loading chart data...</Typography>
        </Box>
      ) : (
        <Box sx={{ position: 'relative', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ 
            width: 200,
            height: 200,
            borderRadius: '50%',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {mockMedicationData.map((med, index) => {
              const startAngle = index === 0 ? 0 : mockMedicationData.slice(0, index).reduce((sum, m) => sum + m.adherence, 0);
              const endAngle = startAngle + med.adherence;
              const startAngleRad = (startAngle / 100) * (2 * Math.PI);
              const endAngleRad = (endAngle / 100) * (2 * Math.PI);
              
              const x1 = 100 + 100 * Math.cos(startAngleRad - Math.PI/2);
              const y1 = 100 + 100 * Math.sin(startAngleRad - Math.PI/2);
              const x2 = 100 + 100 * Math.cos(endAngleRad - Math.PI/2);
              const y2 = 100 + 100 * Math.sin(endAngleRad - Math.PI/2);
              
              const largeArcFlag = endAngle - startAngle > 50 ? 1 : 0;
              
              const colors = ['#1976d2', '#4caf50', '#f44336', '#ff9800'];
              
              return (
                <svg key={index} width="200" height="200" style={{ position: 'absolute', top: 0, left: 0 }}>
                  <path
                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                    fill={colors[index % colors.length]}
                    opacity={0.8}
                  />
                </svg>
              );
            })}
            
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              width: 120,
              height: 120,
              borderRadius: '50%',
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Typography variant="h4" color="primary" fontWeight="bold">
                87%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Overall Adherence
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', gap: 1 }}>
            {mockMedicationData.map((med, index) => {
              const colors = ['#1976d2', '#4caf50', '#f44336', '#ff9800'];
              
              return (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, bgcolor: colors[index % colors.length], borderRadius: 1 }} />
                  <Typography variant="caption">
                    {med.name} ({med.adherence}%)
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <motion.div variants={itemVariants}>
            <Typography variant="h4" component="h1" gutterBottom>
              <BarChartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Health Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your health metrics and visualize your progress
            </Typography>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel id="time-range-label">Time Range</InputLabel>
              <Select
                labelId="time-range-label"
                value={timeRange}
                onChange={handleTimeRangeChange}
                label="Time Range"
              >
                <MenuItem value="1w">Last Week</MenuItem>
                <MenuItem value="1m">Last Month</MenuItem>
                <MenuItem value="3m">Last 3 Months</MenuItem>
                <MenuItem value="6m">Last 6 Months</MenuItem>
                <MenuItem value="1y">Last Year</MenuItem>
              </Select>
            </FormControl>
          </motion.div>
        </Box>
        
        <motion.div variants={itemVariants}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
              <Tab label="Overview" icon={<TimelineIcon />} iconPosition="start" />
              <Tab label="Vitals" icon={<HeartIcon />} iconPosition="start" />
              <Tab label="Medications" icon={<LocalHospitalIcon />} iconPosition="start" />
              <Tab label="Exercise" icon={<FitnessCenterIcon />} iconPosition="start" />
              <Tab label="Sleep" icon={<MonitorIcon />} iconPosition="start" />
              <Tab label="Nutrition" icon={<HealingIcon />} iconPosition="start" />
            </Tabs>
          </Box>
        </motion.div>
        
        {/* Overview Tab */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                    overflow: 'hidden',
                    mb: 3
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      <HeartIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Blood Pressure Trends
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<LineChartIcon />}>Line</Button>
                      <Button size="small" startIcon={<BarChartIcon />}>Bar</Button>
                    </Box>
                  </Box>
                  <VitalsChart />
                </Paper>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">
                      <RunningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Physical Activity
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" startIcon={<DateRangeIcon />}>Week</Button>
                      <Button size="small" startIcon={<DateRangeIcon />}>Month</Button>
                    </Box>
                  </Box>
                  <ExerciseChart />
                </Paper>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                    overflow: 'hidden',
                    mb: 3
                  }}
                >
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">
                      <LocalHospitalIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Medication Adherence
                    </Typography>
                  </Box>
                  <MedicationAdherenceChart />
                </Paper>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                    p: 2
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    <TrendingUpIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Health Insights
                  </Typography>
                  <Box sx={{ py: 1 }}>
                    <Typography variant="body2" color="primary" fontWeight="medium" gutterBottom>
                      Your blood pressure is consistently within the normal range.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Consistent readings of 120/80 mmHg over the last 6 months.
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="warning.main" fontWeight="medium" gutterBottom>
                      Your weekly exercise is below your target goal.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      You've achieved 70% of your weekly step goal. Try to increase daily activity.
                    </Typography>
                    <Divider sx={{ my: 1.5 }} />
                    <Typography variant="body2" color="success.main" fontWeight="medium" gutterBottom>
                      Great improvement in medication adherence.
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Your adherence has improved by 15% compared to last month.
                    </Typography>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <Button 
                      variant="outlined" 
                      fullWidth
                      endIcon={<ArrowForwardIcon />}
                    >
                      View Detailed Insights
                    </Button>
                  </Box>
                </Paper>
              </motion.div>
            </Grid>
          </Grid>
        )}
        
        {/* Other tabs would be implemented similarly */}
        {activeTab === 1 && (
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={darkMode ? 4 : 1} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Vitals Details
              </Typography>
              <Typography variant="body1">
                Detailed vitals tracking and analysis would be shown here.
              </Typography>
            </Paper>
          </motion.div>
        )}
        
        {activeTab > 1 && (
          <motion.div variants={itemVariants}>
            <Paper 
              elevation={darkMode ? 4 : 1} 
              sx={{ 
                p: 4, 
                borderRadius: 2,
                backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                {activeTab === 2 ? 'Medications' : activeTab === 3 ? 'Exercise' : activeTab === 4 ? 'Sleep' : 'Nutrition'} Analytics
              </Typography>
              <Typography variant="body1">
                Detailed {activeTab === 2 ? 'medication' : activeTab === 3 ? 'exercise' : activeTab === 4 ? 'sleep' : 'nutrition'} tracking and analysis would be shown here.
              </Typography>
            </Paper>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default HealthAnalytics; 