import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Button, 
  Card, CardContent, Divider, List, ListItem, 
  ListItemText, ListItemAvatar, Avatar, Chip,
  TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Snackbar,
  IconButton, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
  Switch, FormControlLabel, ListItemIcon
} from '@mui/material';
import { 
  Videocam as VideocamIcon,
  Chat as ChatIcon,
  Today as TodayIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  AccessTime as AccessTimeIcon,
  Language as LanguageIcon,
  Assignment as AssignmentIcon,
  LocalHospital as LocalHospitalIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideoIcon,
  VideocamOff as VideoOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  Star as StarIcon,
  StarOutline as StarOutlineIcon,
  Close as CloseIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Notifications as NotificationsIcon,
  StarHalf as StarHalfIcon
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../App';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  languages: string[];
  nextAvailability: string;
  image: string;
}

interface Appointment {
  id: string;
  doctorName: string;
  doctorImage: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  type: 'video' | 'chat';
  reminder: boolean;
  notes?: string;
}

interface Notification {
  id: string;
  appointmentId: string;
  message: string;
  date: string;
  isRead: boolean;
}

const TeleHealth: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const notificationContext = useContext(NotificationContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [appointmentDialog, setAppointmentDialog] = useState(false);
  const [manualAppointmentDialog, setManualAppointmentDialog] = useState(false);
  const [videoCallActive, setVideoCallActive] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenShareEnabled, setScreenShareEnabled] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Manual appointment form state
  const [manualDoctorName, setManualDoctorName] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [manualType, setManualType] = useState<'video' | 'chat'>('video');
  const [manualNotes, setManualNotes] = useState('');
  const [enableReminder, setEnableReminder] = useState(true);

  // Empty doctor listing - user will only see doctors they manually add
  const doctors: Doctor[] = [];

  // Start with empty appointment list - only show user-entered appointments
  const [userAppointments, setUserAppointments] = useState<Appointment[]>([]);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('telehealth_appointments');
    if (savedAppointments) {
      try {
        setUserAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error("Error parsing saved appointments:", e);
      }
    }

    // Set a timeout to avoid running during initial render
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('telehealth_appointments', JSON.stringify(userAppointments));
  }, [userAppointments]);

  // Optimize notification checking to run less frequently
  useEffect(() => {
    // Only run if there are any appointments with reminders
    if (!userAppointments.some(apt => apt.reminder && apt.status === 'scheduled')) {
      return;
    }

    // Create a function to check for notifications that should be run
    const checkNotifications = () => {
      // Skip processing if no appointments
      if (userAppointments.length === 0) return;
      
      // Create notifications only for appointments with reminders enabled
      const upcomingAppointments = userAppointments.filter(appointment => {
        // Skip processing for non-scheduled or no-reminder appointments
        if (!appointment.reminder || appointment.status !== 'scheduled') {
          return false;
        }

        const appointmentDate = new Date(appointment.date);
        const now = new Date();
        
        // Skip if date is invalid
        if (isNaN(appointmentDate.getTime())) {
          return false;
        }
        
        const timeDiff = appointmentDate.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        // Only create notifications for appointments within the next 24 hours
        return hoursDiff > 0 && hoursDiff <= 24;
      });

      // Skip processing if no upcoming appointments
      if (upcomingAppointments.length === 0) {
        return;
      }

      // Generate notifications for upcoming appointments
      const newNotifications: Notification[] = upcomingAppointments.map(appointment => {
        const appointmentDate = new Date(appointment.date);
        const now = new Date();
        const timeDiff = appointmentDate.getTime() - now.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
        
        return {
          id: `notification-${appointment.id}`,
          appointmentId: appointment.id,
          message: `Reminder: Your appointment with ${appointment.doctorName} is in ${hoursDiff} hours.`,
          date: new Date().toISOString(),
          isRead: false
        };
      });

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          // Filter out duplicate notifications
          const existingIds = prev.map(n => n.appointmentId);
          const uniqueNewNotifications = newNotifications.filter(
            n => !existingIds.includes(n.appointmentId)
          );
          return [...prev, ...uniqueNewNotifications];
        });
      }
    };

    // Run the check once on mount and when userAppointments changes
    checkNotifications();
    
    // Set up a timer to check less frequently (every 5 minutes) instead of on every render
    const intervalId = setInterval(checkNotifications, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, [userAppointments]);

  // Memoize appointment data
  const upcomingAppointments = React.useMemo(() => 
    userAppointments.filter(apt => apt.status === 'scheduled'),
    [userAppointments]
  );

  const pastAppointments = React.useMemo(() => 
    userAppointments.filter(apt => apt.status !== 'scheduled'),
    [userAppointments]
  );

  const unreadNotifications = React.useMemo(() => 
    notifications.filter(n => !n.isRead),
    [notifications]
  );

  // Function to cancel an appointment and update notifications
  const cancelAppointment = (appointmentId: string) => {
    // Update the appointment status
    setUserAppointments(prev => 
      prev.map(appointment => 
        appointment.id === appointmentId 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      )
    );

    // Create cancellation notification
    const appointment = userAppointments.find(apt => apt.id === appointmentId);
    if (!appointment) return;

    const cancellationNotification = {
      id: `cancel-${appointmentId}-${Date.now()}`,
      type: 'cancellation',
      title: 'Appointment Cancelled',
      message: `Your ${appointment.type} appointment with ${appointment.doctorName} on ${new Date(appointment.date).toLocaleString()} has been cancelled.`,
      date: new Date().toISOString(),
      isRead: false,
      priority: 'medium',
      action: {
        label: 'View Appointments',
        link: '/telehealth'
      }
    };

    // Add to all notification systems
    if (notificationContext) {
      notificationContext.addNotification(cancellationNotification);
    }
    
    if (window && (window as any).addHealthNotification) {
      (window as any).addHealthNotification(cancellationNotification);
    }
    
    if (window) {
      window.dispatchEvent(new CustomEvent('new-notification', { detail: cancellationNotification }));
    }

    // Show snackbar notification
    setSnackbar({
      open: true,
      message: `Appointment with ${appointment.doctorName} has been cancelled`,
      severity: 'info'
    });
  };

  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setAppointmentDialog(true);
  };

  const handleCloseAppointmentDialog = () => {
    setAppointmentDialog(false);
    setSelectedDoctor(null);
    setDate('');
    setTime('');
    setReason('');
  };

  const handleSubmitAppointment = () => {
    // Create a new appointment
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      doctorName: selectedDoctor?.name || '',
      doctorImage: selectedDoctor?.image || '',
      date: `${date}T${time}:00`,
      status: 'scheduled',
      type: 'video',
      reminder: true,
      notes: reason
    };

    // Add to appointments list
    setUserAppointments(prev => [...prev, newAppointment]);

    // Show success message
    setAppointmentDialog(false);
    setSnackbar({
      open: true,
      message: `Appointment scheduled with ${selectedDoctor?.name}`,
      severity: 'success'
    });
    
    setSelectedDoctor(null);
    setDate('');
    setTime('');
    setReason('');

    // Send notification to Notifications page
    sendToNotificationsPage(newAppointment);
  };

  const handleOpenManualAppointment = () => {
    setManualAppointmentDialog(true);
  };

  const handleCloseManualAppointment = () => {
    setManualAppointmentDialog(false);
    setManualDoctorName('');
    setManualDate('');
    setManualTime('');
    setManualType('video');
    setManualNotes('');
    setEnableReminder(true);
  };

  const handleSubmitManualAppointment = () => {
    // Create a new manual appointment
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      doctorName: manualDoctorName,
      doctorImage: '', // Don't load external image - use initials instead
      date: `${manualDate}T${manualTime}:00`,
      status: 'scheduled',
      type: manualType,
      reminder: enableReminder,
      notes: manualNotes
    };

    // Add to appointments list
    setUserAppointments(prev => [...prev, newAppointment]);

    // Send notification to Notifications page
    sendToNotificationsPage(newAppointment);

    // Show success message
    setManualAppointmentDialog(false);
    setSnackbar({
      open: true,
      message: `Manual appointment added successfully`,
      severity: 'success'
    });
    
    // Reset form
    handleCloseManualAppointment();
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    setManualType(event.target.value as 'video' | 'chat');
  };

  const handleToggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true } 
          : notification
      )
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const handleStartVideoCall = () => {
    setVideoCallActive(true);
    // Start call duration timer
    const intervalId = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Store the interval ID to clear it later
    return () => clearInterval(intervalId);
  };

  const handleEndVideoCall = () => {
    setVideoCallActive(false);
    setCallDuration(0);
    setSnackbar({
      open: true,
      message: 'Video call ended',
      severity: 'info'
    });
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const formatAppointmentDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarIcon key={i} sx={{ color: 'gold' }} />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<StarHalfIcon key={i} sx={{ color: 'gold' }} />);
      } else {
        stars.push(<StarOutlineIcon key={i} sx={{ color: 'gold' }} />);
      }
    }

    return stars;
  };

  // Simpler animations for faster loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.02 // Reduced stagger time significantly
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  // Optimization: disable animations on initial load
  const shouldAnimate = isLoaded;

  // Optimize the sendToNotificationsPage function to be more efficient
  const sendToNotificationsPage = (appointment: Appointment) => {
    try {
      // Create appointment notification
      const notification = {
        id: `appt-notification-${Date.now()}`,
        type: 'appointment',
        title: 'New Appointment Created',
        message: `You have scheduled a ${appointment.type} consultation with ${appointment.doctorName} on ${new Date(appointment.date).toLocaleString()}.`,
        date: new Date().toISOString(),
        isRead: false,
        priority: 'medium',
        action: {
          label: 'View Details',
          link: '/telehealth'
        }
      };
      
      // Add to global notification system using multiple methods for redundancy
      // 1. Use the context if available (preferred method)
      if (notificationContext) {
        notificationContext.addNotification(notification);
      }
      
      // 2. Use the global window function directly if available 
      if (window && (window as any).addHealthNotification) {
        (window as any).addHealthNotification(notification);
      }
      
      // 3. Dispatch an event as a fallback method
      if (window) {
        window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
      }

      // Store in localStorage directly as an additional safety measure
      try {
        const savedNotifications = localStorage.getItem('health_notifications');
        let notificationsArray = [];
        
        if (savedNotifications) {
          notificationsArray = JSON.parse(savedNotifications);
          // Make sure it's an array
          if (!Array.isArray(notificationsArray)) {
            notificationsArray = [];
          }
        }
        
        // Only add if not already present
        if (!notificationsArray.some((n: any) => n.id === notification.id)) {
          notificationsArray.unshift(notification); // Add to beginning
          localStorage.setItem('health_notifications', JSON.stringify(notificationsArray));
        }
      } catch (e) {
        console.error("Error updating notifications in localStorage", e);
      }
      
      // Only create a reminder if enabled
      if (appointment.reminder) {
        const appointmentDate = new Date(appointment.date);
        
        // Skip if date is invalid
        if (!isNaN(appointmentDate.getTime())) {
          const reminderNotification = {
            id: `reminder-${appointment.id}`,
            type: 'reminder',
            title: 'Appointment Reminder',
            message: `Don't forget your appointment with ${appointment.doctorName} on ${appointmentDate.toLocaleDateString()} at ${appointmentDate.toLocaleTimeString()}.`,
            date: appointment.date,
            isRead: false,
            priority: 'medium',
            action: {
              label: 'View Details',
              link: '/telehealth'
            }
          };
          
          // Use all available methods to ensure the reminder is saved
          if (notificationContext) {
            notificationContext.addNotification(reminderNotification);
          }
          
          if (window && (window as any).addHealthNotification) {
            (window as any).addHealthNotification(reminderNotification);
          }
          
          if (window) {
            window.dispatchEvent(new CustomEvent('new-notification', { detail: reminderNotification }));
          }
        }
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleViewAllNotifications = () => {
    navigate('/notifications');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {videoCallActive ? (
        <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: '#000', zIndex: 9999 }}>
          <Box sx={{ position: 'absolute', top: 20, right: 20, display: 'flex', gap: 2 }}>
            <Chip 
              label={`Duration: ${formatDuration(callDuration)}`} 
              color="primary" 
              icon={<AccessTimeIcon />} 
            />
            <Button 
              variant="contained" 
              color="error" 
              startIcon={<CloseIcon />}
              onClick={handleEndVideoCall}
            >
              End Call
            </Button>
          </Box>
          
          <Box sx={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color={audioEnabled ? 'primary' : 'error'}
              onClick={() => setAudioEnabled(!audioEnabled)}
            >
              {audioEnabled ? <MicIcon /> : <MicOffIcon />}
            </Button>
            
            <Button
              variant="contained"
              color={videoEnabled ? 'primary' : 'error'}
              onClick={() => setVideoEnabled(!videoEnabled)}
            >
              {videoEnabled ? <VideoIcon /> : <VideoOffIcon />}
            </Button>
            
            <Button
              variant="contained"
              color={screenShareEnabled ? 'secondary' : 'primary'}
              onClick={() => setScreenShareEnabled(!screenShareEnabled)}
            >
              {screenShareEnabled ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </Button>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%' 
          }}>
            {videoEnabled ? (
              <Box sx={{ position: 'relative', width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="h3" color="white">
                  Video Feed Would Display Here
                </Typography>
                
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 100, 
                  right: 20, 
                  width: 200, 
                  height: 150, 
                  bgcolor: 'grey.800',
                  border: '2px solid white',
                  borderRadius: 2,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Typography variant="body2" color="white">
                    Your Camera
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center' }}>
                <VideoOffIcon sx={{ fontSize: 100, color: 'white', mb: 2 }} />
                <Typography variant="h4" color="white">
                  Camera Off
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      ) : (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" component="h1" gutterBottom>
                <VideocamIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Telehealth Services
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Connect with healthcare professionals from the comfort of your home
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton 
                color="primary"
                onClick={handleToggleNotifications}
                sx={{ position: 'relative' }}
              >
                <NotificationsIcon />
                {unreadNotifications.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'error.main',
                      color: 'white',
                      borderRadius: '50%',
                      width: 18,
                      height: 18,
                      fontSize: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadNotifications.length}
                  </Box>
                )}
              </IconButton>
              
              <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={handleOpenManualAppointment}
              >
                Add Appointment
              </Button>
            </Box>
          </Box>
          
          {/* Notifications Panel */}
          {notificationsOpen && (
            <Paper 
              elevation={darkMode ? 4 : 1} 
              sx={{ 
                p: 2, 
                mb: 4, 
                borderRadius: 2,
                backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Notifications
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {notifications.length > 0 && (
                    <Button 
                      size="small" 
                      onClick={handleClearAllNotifications}
                    >
                      Clear All
                    </Button>
                  )}
                  <Button 
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={handleViewAllNotifications}
                  >
                    View All Notifications
                  </Button>
                </Box>
              </Box>
              
              <List>
                {notifications.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                    No notifications
                  </Typography>
                ) : (
                  notifications.map(notification => (
                    <React.Fragment key={notification.id}>
                      <ListItem
                        sx={{ 
                          bgcolor: notification.isRead ? 'transparent' : (darkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)'),
                          borderLeft: notification.isRead ? 'none' : '3px solid #1976d2'
                        }}
                        secondaryAction={
                          !notification.isRead && (
                            <Button 
                              size="small" 
                              onClick={() => handleMarkNotificationAsRead(notification.id)}
                            >
                              Mark as read
                            </Button>
                          )
                        }
                      >
                        <ListItemText
                          primary={notification.message}
                          secondary={new Date(notification.date).toLocaleString()}
                        />
                      </ListItem>
                      <Divider component="li" />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          )}
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={darkMode ? 4 : 1} 
                sx={{ 
                  p: 3, 
                  mb: 4, 
                  borderRadius: 2,
                  backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
                }}
              >
                <Typography variant="h5" gutterBottom>
                  <TodayIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Your Upcoming Appointments
                </Typography>
                
                <List>
                  {upcomingAppointments.length === 0 ? (
                    <Box sx={{ py: 2, textAlign: 'center' }}>
                      <Typography variant="body1" color="text.secondary">
                        You have no upcoming appointments
                      </Typography>
                      <Button 
                        variant="outlined" 
                        sx={{ mt: 2 }}
                        startIcon={<AddIcon />}
                        onClick={handleOpenManualAppointment}
                      >
                        Add Appointment
                      </Button>
                    </Box>
                  ) : (
                    upcomingAppointments.map(appointment => (
                      <React.Fragment key={appointment.id}>
                        <ListItem
                          alignItems="flex-start"
                          secondaryAction={
                            <Button 
                              variant="contained" 
                              color="primary"
                              startIcon={appointment.type === 'video' ? <VideocamIcon /> : <ChatIcon />}
                              onClick={handleStartVideoCall}
                            >
                              {appointment.type === 'video' ? 'Join Video' : 'Start Chat'}
                            </Button>
                          }
                        >
                          <ListItemAvatar>
                            <Avatar alt={appointment.doctorName}>
                              {appointment.doctorName.split(' ').map(name => name[0]).join('')}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {appointment.doctorName}
                                {appointment.reminder && (
                                  <Chip 
                                    size="small" 
                                    label="Reminder" 
                                    color="secondary" 
                                    sx={{ ml: 1, height: 20 }} 
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <React.Fragment>
                                <Typography
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {formatAppointmentDate(appointment.date)}
                                </Typography>
                                <br />
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                  <Chip
                                    size="small"
                                    label={appointment.type === 'video' ? 'Video Consultation' : 'Chat Consultation'}
                                    color={appointment.type === 'video' ? 'primary' : 'info'}
                                  />
                                  <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => cancelAppointment(appointment.id)}
                                  >
                                    Cancel
                                  </Button>
                                </Box>
                                {appointment.notes && (
                                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    Notes: {appointment.notes}
                                  </Typography>
                                )}
                              </React.Fragment>
                            }
                          />
                        </ListItem>
                        <Divider component="li" />
                      </React.Fragment>
                    ))
                  )}
                </List>
              </Paper>
            </Grid>
            
            {/* Only render these secondary sections when component is fully loaded */}
            {isLoaded && (
              <Grid item xs={12} md={4}>
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    p: 3, 
                    mb: 4, 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Appointment History
                  </Typography>
                  
                  <List>
                    {pastAppointments.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                        No past appointments
                      </Typography>
                    ) : (
                      pastAppointments.map(appointment => (
                        <React.Fragment key={appointment.id}>
                          <ListItem alignItems="flex-start">
                            <ListItemAvatar>
                              <Avatar alt={appointment.doctorName}>
                                {appointment.doctorName.split(' ').map(name => name[0]).join('')}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={appointment.doctorName}
                              secondary={
                                <React.Fragment>
                                  <Typography
                                    component="span"
                                    variant="body2"
                                    color="text.primary"
                                  >
                                    {formatAppointmentDate(appointment.date)}
                                  </Typography>
                                  <br />
                                  <Box sx={{ mt: 0.5, display: 'flex', gap: 1 }}>
                                    <Chip
                                      size="small"
                                      label={appointment.status}
                                      color={getStatusColor(appointment.status) as any}
                                    />
                                    <Chip
                                      size="small"
                                      label={appointment.type === 'video' ? 'Video' : 'Chat'}
                                      variant="outlined"
                                    />
                                  </Box>
                                </React.Fragment>
                              }
                            />
                          </ListItem>
                          <Divider component="li" />
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </Paper>
                
                <Paper 
                  elevation={darkMode ? 4 : 1} 
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    <InfoIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Telehealth Benefits
                  </Typography>
                  
                  <List dense>
                    {[
                      'Access healthcare from anywhere',
                      'Save time and travel costs',
                      'Reduced exposure to other illnesses',
                      'Easy access to specialists',
                      'Convenient follow-up visits'
                    ].map((benefit, index) => (
                      <ListItem key={index}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}
          </Grid>
          
          {/* Book Appointment Dialog */}
          <Dialog
            open={appointmentDialog}
            onClose={handleCloseAppointmentDialog}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Book Appointment with {selectedDoctor?.name}
            </DialogTitle>
            <DialogContent>
              {selectedDoctor && (
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                  <Avatar 
                    alt={selectedDoctor.name} 
                    sx={{ width: 64, height: 64, mr: 2 }}
                  >
                    {selectedDoctor.name.split(' ').map(name => name[0]).join('')}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedDoctor.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedDoctor.specialty}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        {selectedDoctor.rating}
                      </Typography>
                      {[...Array(5)].map((_, i) => (
                        i < Math.floor(selectedDoctor.rating) 
                          ? <StarIcon key={i} sx={{ fontSize: 16, color: 'gold' }} />
                          : <StarOutlineIcon key={i} sx={{ fontSize: 16, color: 'gold' }} />
                      ))}
                    </Box>
                  </Box>
                </Box>
              )}
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time"
                    type="time"
                    fullWidth
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Reason for Visit"
                    multiline
                    rows={4}
                    fullWidth
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseAppointmentDialog}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleSubmitAppointment}
                disabled={!date || !time || !reason}
              >
                Book Appointment
              </Button>
            </DialogActions>
          </Dialog>
          
          {/* Manual Appointment Dialog */}
          <Dialog
            open={manualAppointmentDialog}
            onClose={handleCloseManualAppointment}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle>
              Add Appointment Manually
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12}>
                  <TextField
                    label="Doctor/Healthcare Provider Name"
                    fullWidth
                    value={manualDoctorName}
                    onChange={(e) => setManualDoctorName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    value={manualDate}
                    onChange={(e) => setManualDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Time"
                    type="time"
                    fullWidth
                    value={manualTime}
                    onChange={(e) => setManualTime(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Appointment Type</InputLabel>
                    <Select
                      value={manualType}
                      label="Appointment Type"
                      onChange={handleTypeChange}
                    >
                      <MenuItem value="video">Video Consultation</MenuItem>
                      <MenuItem value="chat">Chat Consultation</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    fullWidth
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch 
                        checked={enableReminder} 
                        onChange={(e) => setEnableReminder(e.target.checked)} 
                        color="primary"
                      />
                    }
                    label="Enable appointment reminder"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseManualAppointment}>Cancel</Button>
              <Button 
                variant="contained" 
                onClick={handleSubmitManualAppointment}
                disabled={!manualDoctorName || !manualDate || !manualTime}
              >
                Add Appointment
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TeleHealth; 