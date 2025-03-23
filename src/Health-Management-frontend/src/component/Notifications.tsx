import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Box, Paper, List, ListItem, 
  ListItemText, ListItemIcon, Divider, Button, 
  Chip, IconButton, TextField, MenuItem, Select,
  FormControl, InputLabel, Switch, FormControlLabel,
  Badge, Tab, Tabs, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Alert, Snackbar, Grid
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  NotificationsActive as NotificationsActiveIcon,
  NotificationsOff as NotificationsOffIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  Schedule as ScheduleIcon,
  Medication as MedicationIcon,
  Event as EventIcon,
  CalendarMonth as CalendarMonthIcon,
  Article as ArticleIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  MedicalServices as MedicalServicesIcon,
  Settings as SettingsIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { NotificationContext } from '../App';
import { SelectChangeEvent } from '@mui/material/Select';

interface Notification {
  id: string;
  type: 'appointment' | 'medication' | 'report' | 'reminder' | 'system';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  action?: {
    label: string;
    link: string;
  };
}

const Notifications: React.FC = () => {
  const { darkMode } = useTheme();
  const notificationContext = useContext(NotificationContext);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [filter, setFilter] = useState<string>('all');
  const [showSettings, setShowSettings] = useState(false);
  const [createReminderDialog, setCreateReminderDialog] = useState(false);
  const [newReminder, setNewReminder] = useState({
    title: '',
    message: '',
    date: '',
    time: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [settings, setSettings] = useState({
    receiveAppointmentNotifications: true,
    receiveMedicationReminders: true,
    receiveReportNotifications: true,
    receiveSystemUpdates: true,
    emailNotifications: true,
    pushNotifications: true,
    notificationSound: true
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Initialize with empty array on component mount
  useEffect(() => {
    setNotifications([]);
  }, []);
  
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

  // Function to add a new notification/reminder from other components
  const addNotification = (notification: Notification) => {
    // Add to local state
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      
      return [...prev, notification];
    });

    // Also add to context if available
    if (notificationContext) {
      try {
        notificationContext.addNotification(notification);
      } catch (error) {
        console.error("Error adding to context:", error);
      }
    }
  };

  // Expose the addNotification function via window for global access
  useEffect(() => {
    // Register this component to receive notifications
    if (window) {
      (window as any).addHealthNotification = addNotification;
    }
    
    return () => {
      // Clean up
      if (window) {
        delete (window as any).addHealthNotification;
      }
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value);
  };

  const handleReadNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
    setSnackbar({
      open: true,
      message: 'Notification deleted',
      severity: 'success'
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => ({ ...notification, isRead: true }))
    );
    setSnackbar({
      open: true,
      message: 'All notifications marked as read',
      severity: 'success'
    });
  };

  const handleDeleteAllRead = () => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => !notification.isRead)
    );
    setSnackbar({
      open: true,
      message: 'Read notifications deleted',
      severity: 'success'
    });
  };

  const handleSettingChange = (setting: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [setting]: event.target.checked
    });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Filter by tab
    if (activeTab === 1) {
      filtered = filtered.filter(notification => !notification.isRead);
    } else if (activeTab === 2) {
      filtered = filtered.filter(notification => notification.isRead);
    }
    
    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(notification => notification.type === filter);
    }
    
    return filtered;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment':
        return <CalendarMonthIcon color="primary" />;
      case 'medication':
        return <MedicationIcon color="error" />;
      case 'report':
        return <ArticleIcon color="info" />;
      case 'reminder':
        return <ScheduleIcon color="warning" />;
      case 'system':
        return <HealthAndSafetyIcon color="success" />;
      default:
        return <NotificationsIcon />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Lightweight animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 }
    }
  };

  const handleCreateReminder = () => {
    setCreateReminderDialog(true);
  };

  const handleCloseReminderDialog = () => {
    setCreateReminderDialog(false);
    setNewReminder({
      title: '',
      message: '',
      date: '',
      time: '',
      priority: 'medium'
    });
  };

  const handleSubmitReminder = () => {
    const newNotification: Notification = {
      id: `reminder-${Date.now()}`,
      type: 'reminder',
      title: newReminder.title,
      message: newReminder.message,
      date: `${newReminder.date}T${newReminder.time}:00`,
      isRead: false,
      priority: newReminder.priority
    };

    addNotification(newNotification);
    setSnackbar({
      open: true,
      message: 'Reminder created successfully',
      severity: 'success'
    });
    handleCloseReminderDialog();
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            <NotificationsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Notifications
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<ScheduleIcon />}
              onClick={handleCreateReminder}
            >
              Create Reminder
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<SettingsIcon />}
              onClick={() => setShowSettings(true)}
            >
              Settings
            </Button>
            
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
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDeleteAllRead}
              disabled={!notifications.some(n => n.isRead)}
            >
              Clear Read
            </Button>
          </Box>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsIcon sx={{ mr: 1 }} />
                    All
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Badge badgeContent={notifications.filter(n => !n.isRead).length} color="error">
                      <NotificationsActiveIcon sx={{ mr: 1 }} />
                    </Badge>
                    Unread
                  </Box>
                } 
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <NotificationsOffIcon sx={{ mr: 1 }} />
                    Read
                  </Box>
                } 
              />
            </Tabs>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <FilterListIcon sx={{ mr: 1 }} />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="filter-select-label">Filter By Type</InputLabel>
                <Select
                  labelId="filter-select-label"
                  value={filter}
                  label="Filter By Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="appointment">Appointments</MenuItem>
                  <MenuItem value="medication">Medications</MenuItem>
                  <MenuItem value="report">Reports</MenuItem>
                  <MenuItem value="reminder">Reminders</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                </Select>
              </FormControl>
            </Box>
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
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : getFilteredNotifications().length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <NotificationsOffIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No notifications to display
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {filter !== 'all' 
                  ? `No ${filter} notifications found` 
                  : activeTab === 1 
                    ? 'You have no unread notifications' 
                    : activeTab === 2 
                      ? 'You have no read notifications' 
                      : 'You have no notifications'}
              </Typography>
            </Box>
          ) : (
            <List sx={{ width: '100%' }}>
              {getFilteredNotifications().map((notification, index) => (
                <motion.div
                  key={notification.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                >
                  <ListItem
                    alignItems="flex-start"
                    sx={{
                      px: 3,
                      py: 2,
                      backgroundColor: notification.isRead 
                        ? 'transparent' 
                        : darkMode 
                          ? 'rgba(144, 202, 249, 0.08)' 
                          : 'rgba(25, 118, 210, 0.05)',
                      transition: 'background-color 0.3s'
                    }}
                    secondaryAction={
                      <Box>
                        <IconButton 
                          edge="end" 
                          aria-label="mark as read"
                          onClick={() => handleReadNotification(notification.id)}
                          disabled={notification.isRead}
                          sx={{ mr: 1 }}
                        >
                          <CheckIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteNotification(notification.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemIcon>
                      {getNotificationIcon(notification.type)}
                    </ListItemIcon>
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
                            color={getPriorityColor(notification.priority) as any}
                            sx={{ height: 24 }}
                          />
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
                                sx={{ ml: 2 }}
                                href={notification.action.link}
                              >
                                {notification.action.label}
                              </Button>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < getFilteredNotifications().length - 1 && <Divider component="li" />}
                </motion.div>
              ))}
            </List>
          )}
        </Paper>
      </Box>
      
      {/* Notification Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <SettingsIcon sx={{ mr: 1 }} />
            Notification Settings
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 1, mb: 2, fontWeight: 'bold' }}>
            Notification Types
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.receiveAppointmentNotifications}
                  onChange={handleSettingChange('receiveAppointmentNotifications')}
                  color="primary"
                />
              }
              label="Appointment Notifications"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.receiveMedicationReminders}
                  onChange={handleSettingChange('receiveMedicationReminders')}
                  color="primary"
                />
              }
              label="Medication Reminders"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.receiveReportNotifications}
                  onChange={handleSettingChange('receiveReportNotifications')}
                  color="primary"
                />
              }
              label="Lab Reports & Test Results"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.receiveSystemUpdates}
                  onChange={handleSettingChange('receiveSystemUpdates')}
                  color="primary"
                />
              }
              label="System Updates & Maintenance"
            />
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 2, fontWeight: 'bold' }}>
            Delivery Methods
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleSettingChange('emailNotifications')}
                  color="primary"
                />
              }
              label="Email Notifications"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.pushNotifications}
                  onChange={handleSettingChange('pushNotifications')}
                  color="primary"
                />
              }
              label="Push Notifications"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={settings.notificationSound}
                  onChange={handleSettingChange('notificationSound')}
                  color="primary"
                />
              }
              label="Notification Sounds"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              setShowSettings(false);
              setSnackbar({
                open: true,
                message: 'Notification settings saved',
                severity: 'success'
              });
            }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Create Reminder Dialog */}
      <Dialog
        open={createReminderDialog}
        onClose={handleCloseReminderDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ScheduleIcon sx={{ mr: 1 }} />
            Create New Reminder
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Reminder Title"
                fullWidth
                value={newReminder.title}
                onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Message"
                multiline
                rows={3}
                fullWidth
                value={newReminder.message}
                onChange={(e) => setNewReminder({...newReminder, message: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                fullWidth
                value={newReminder.date}
                onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
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
                value={newReminder.time}
                onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newReminder.priority}
                  label="Priority"
                  onChange={(e) => setNewReminder({...newReminder, priority: e.target.value as 'low' | 'medium' | 'high'})}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReminderDialog}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmitReminder}
            disabled={!newReminder.title || !newReminder.message || !newReminder.date || !newReminder.time}
          >
            Create Reminder
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Notifications; 