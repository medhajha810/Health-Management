import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Box, Paper, List, ListItem, 
  ListItemText, Divider, Button, Chip, IconButton 
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { NotificationContext } from '../App';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  type?: string;
  action?: {
    label: string;
    link: string;
  };
}

const SimpleNotifications: React.FC = () => {
  const { darkMode } = useTheme();
  const notificationContext = useContext(NotificationContext);
  const navigate = useNavigate();
  
  // Default example notifications only shown if no other notifications exist
  const defaultNotifications: Notification[] = [
    {
      id: '1',
      title: 'Welcome to Notifications',
      message: 'This is a sample notification to demonstrate the interface.',
      date: new Date().toISOString(),
      isRead: false,
      priority: 'medium',
      type: 'system'
    },
    {
      id: '2',
      title: 'System Update',
      message: 'The system has been updated with new features.',
      date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      isRead: true,
      priority: 'low',
      type: 'system'
    }
  ];
  
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage on component mount
  useEffect(() => {
    // First check if there are notifications in localStorage
    const savedNotifications = localStorage.getItem('health_notifications');
    let hasLoadedNotifications = false;
    
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(parsedNotifications) && parsedNotifications.length > 0) {
          setNotifications(parsedNotifications);
          hasLoadedNotifications = true;
        }
      } catch (e) {
        console.error("Error parsing saved notifications:", e);
      }
    }
    
    // Check telehealth appointments to ensure they're included in notifications
    const savedAppointments = localStorage.getItem('telehealth_appointments');
    if (savedAppointments) {
      try {
        const appointments = JSON.parse(savedAppointments);
        if (Array.isArray(appointments) && appointments.length > 0) {
          // Convert appointments to notifications if they don't already exist
          const appointmentNotifications: Notification[] = appointments.map(appt => ({
            id: `appt-${appt.id}`,
            title: 'Upcoming Appointment',
            message: `You have a ${appt.type} appointment with Dr. ${appt.doctor} on ${appt.date}`,
            date: new Date().toISOString(),
            isRead: false,
            priority: 'medium' as 'high' | 'medium' | 'low',
            action: {
              label: 'View Appointment',
              link: '/telehealth'
            }
          }));
          
          setNotifications(prev => {
            // Filter out any duplicates based on id
            const existingIds = prev.map(n => n.id);
            const newNotifications = appointmentNotifications.filter(
              n => !existingIds.includes(n.id)
            );
            
            hasLoadedNotifications = true;
            return [...prev, ...newNotifications];
          });
        }
      } catch (e) {
        console.error("Error converting appointments to notifications:", e);
      }
    }
    
    // Fall back to default notifications if none loaded
    if (!hasLoadedNotifications) {
      setNotifications(defaultNotifications);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem('health_notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  // Listen for new notifications from other components
  useEffect(() => {
    const handleNewNotification = (event: CustomEvent) => {
      if (event.detail) {
        addNotification(event.detail);
      }
    };

    window.addEventListener('new-notification' as any, handleNewNotification as any);
    
    return () => {
      window.removeEventListener('new-notification' as any, handleNewNotification as any);
    };
  }, []);

  // Function to add a new notification
  const addNotification = (notification: Notification) => {
    if (!notification.id) {
      notification.id = `notification-${Date.now()}`;
    }
    
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      return [notification, ...prev];
    });
  };

  // Register global notification function
  useEffect(() => {
    if (window) {
      (window as any).addHealthNotification = (notification: Notification) => {
        addNotification(notification);
        if (notificationContext) {
          notificationContext.addNotification(notification);
        }
      };
    }
    
    return () => {
      if (window) {
        delete (window as any).addHealthNotification;
      }
    };
  }, [notificationContext]);

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const handleAction = (link: string) => {
    navigate(link);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  // Get unread count for badge
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Notifications {unreadCount > 0 && `(${unreadCount} unread)`}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CheckIcon />}
            onClick={handleMarkAllAsRead}
            disabled={!notifications.some(n => !n.isRead)}
          >
            Mark All Read
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate('/telehealth')}
          >
            Telehealth Center
          </Button>
        </Box>
      </Box>
      
      <Paper 
        elevation={darkMode ? 4 : 1} 
        sx={{ 
          borderRadius: 2,
          backgroundColor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white',
          overflow: 'hidden'
        }}
      >
        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="text.secondary">
              No notifications to display
            </Typography>
          </Box>
        ) : (
          <List sx={{ width: '100%' }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem
                  alignItems="flex-start"
                  sx={{
                    px: 3,
                    py: 2,
                    backgroundColor: notification.isRead 
                      ? 'transparent' 
                      : darkMode 
                        ? 'rgba(144, 202, 249, 0.08)' 
                        : 'rgba(25, 118, 210, 0.05)'
                  }}
                  secondaryAction={
                    <Box>
                      <IconButton 
                        edge="end" 
                        aria-label="mark as read"
                        onClick={() => handleMarkAsRead(notification.id)}
                        disabled={notification.isRead}
                        sx={{ mr: 1 }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <IconButton 
                        edge="end" 
                        aria-label="delete" 
                        onClick={() => handleDelete(notification.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}
                        >
                          {notification.title}
                        </Typography>
                        <Chip 
                          label={notification.priority} 
                          size="small" 
                          color={
                            notification.priority === 'high' ? 'error' : 
                            notification.priority === 'medium' ? 'warning' : 'success'
                          }
                          sx={{ height: 24 }}
                        />
                        {notification.type && (
                          <Chip 
                            label={notification.type} 
                            size="small" 
                            variant="outlined"
                            sx={{ height: 24 }}
                          />
                        )}
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'primary.main',
                              ml: 1
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.primary"
                          sx={{ mb: 1, opacity: notification.isRead ? 0.8 : 1 }}
                        >
                          {notification.message}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            {formatDate(notification.date)}
                          </Typography>
                          {notification.action && (
                            <Button
                              size="small"
                              variant="outlined"
                              endIcon={<ArrowForwardIcon />}
                              onClick={() => handleAction(notification.action!.link)}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default SimpleNotifications; 