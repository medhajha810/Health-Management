import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Box, Paper, Grid, Button, 
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, FormControlLabel, Switch
} from '@mui/material';
import { Videocam as VideocamIcon, Add as AddIcon, Chat as ChatIcon } from '@mui/icons-material';
import { useTheme } from './ThemeContext';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../App';

interface Appointment {
  id: string;
  doctorName: string;
  date: string;
  notes?: string;
  type: 'video' | 'chat';
  reminder: boolean;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const SimpleTeleHealth: React.FC = () => {
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const notificationContext = useContext(NotificationContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    date: '',
    time: '',
    notes: '',
    type: 'video' as 'video' | 'chat',
    reminder: true
  });

  // Load appointments from localStorage on component mount
  useEffect(() => {
    const savedAppointments = localStorage.getItem('telehealth_appointments');
    if (savedAppointments) {
      try {
        setAppointments(JSON.parse(savedAppointments));
      } catch (e) {
        console.error("Error parsing saved appointments:", e);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('telehealth_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      doctorName: '',
      date: '',
      time: '',
      notes: '',
      type: 'video',
      reminder: true
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      reminder: e.target.checked
    }));
  };

  // Send notification to global system
  const sendNotification = (appointment: Appointment) => {
    if (!notificationContext) return;

    try {
      // Create appointment notification
      const notification = {
        id: `appt-notification-${Date.now()}`,
        type: 'appointment',
        title: 'Upcoming Appointment',
        message: `You have a ${appointment.type} appointment with ${appointment.doctorName} on ${new Date(appointment.date).toLocaleString()}.`,
        date: new Date().toISOString(),
        isRead: false,
        priority: 'medium',
        action: {
          label: 'View Appointments',
          link: '/telehealth'
        }
      };
      
      // Add to notification context
      notificationContext.addNotification(notification);
      
      // Create reminder if enabled
      if (appointment.reminder) {
        const reminderNotification = {
          id: `reminder-${appointment.id}`,
          type: 'reminder',
          title: 'Appointment Reminder',
          message: `Don't forget your appointment with ${appointment.doctorName} on ${new Date(appointment.date).toLocaleDateString()} at ${new Date(appointment.date).toLocaleTimeString()}.`,
          date: appointment.date,
          isRead: false,
          priority: 'medium',
          action: {
            label: 'View Details',
            link: '/telehealth'
          }
        };
        
        notificationContext.addNotification(reminderNotification);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  const handleAddAppointment = () => {
    const newAppointment: Appointment = {
      id: `appointment-${Date.now()}`,
      doctorName: formData.doctorName,
      date: `${formData.date}T${formData.time}:00`,
      notes: formData.notes,
      type: formData.type,
      reminder: formData.reminder,
      status: 'scheduled'
    };

    // Add to local state
    setAppointments(prev => [...prev, newAppointment]);
    
    // Send notification
    sendNotification(newAppointment);
    
    // Clear form and close dialog
    setDialogOpen(false);
    setFormData({
      doctorName: '',
      date: '',
      time: '',
      notes: '',
      type: 'video',
      reminder: true
    });
  };

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(apt => apt.status === 'scheduled');
  const pastAppointments = appointments.filter(apt => apt.status !== 'scheduled');

  const handleStartAppointment = (appointment: Appointment) => {
    alert(`Starting ${appointment.type} appointment with ${appointment.doctorName}`);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, status: 'cancelled' } 
          : appointment
      )
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">
          <VideocamIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Telehealth Services
        </Typography>
        
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Appointment
        </Button>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={darkMode ? 4 : 1}
            sx={{ 
              p: 3, 
              mb: 4,
              borderRadius: 2,
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Your Upcoming Appointments
            </Typography>
            
            {upcomingAppointments.length === 0 ? (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  You have no upcoming appointments scheduled.
                </Typography>
                <Button 
                  variant="outlined" 
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ mt: 2 }}
                >
                  Add Your First Appointment
                </Button>
              </Box>
            ) : (
              <List>
                {upcomingAppointments.map(appointment => (
                  <React.Fragment key={appointment.id}>
                    <ListItem 
                      alignItems="flex-start"
                      secondaryAction={
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleCancelAppointment(appointment.id)}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={appointment.type === 'video' ? <VideocamIcon /> : <ChatIcon />}
                            onClick={() => handleStartAppointment(appointment)}
                          >
                            {appointment.type === 'video' ? 'Join Video' : 'Start Chat'}
                          </Button>
                        </Box>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {appointment.doctorName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.doctorName}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {new Date(appointment.date).toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Typography variant="body2" color="primary">
                                {appointment.type === 'video' ? 'Video Consultation' : 'Chat Consultation'}
                              </Typography>
                              {appointment.reminder && (
                                <Typography variant="body2" color="secondary">
                                  Reminder enabled
                                </Typography>
                              )}
                            </Box>
                            {appointment.notes && (
                              <Typography variant="body2" sx={{ mt: 1 }}>
                                Notes: {appointment.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
          
          <Paper
            elevation={darkMode ? 4 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Telehealth Benefits
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Convenience
                  </Typography>
                  <Typography variant="body2">
                    Access healthcare from anywhere without the need to travel to a facility.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Time-saving
                  </Typography>
                  <Typography variant="body2">
                    No waiting rooms - connect with healthcare providers at your scheduled time.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Safety
                  </Typography>
                  <Typography variant="body2">
                    Reduce exposure to other illnesses by avoiding in-person waiting areas.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Follow-up Care
                  </Typography>
                  <Typography variant="body2">
                    Convenient follow-up appointments without disrupting your schedule.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={darkMode ? 4 : 1}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              bgcolor: darkMode ? 'rgba(30, 30, 30, 0.8)' : 'white'
            }}
          >
            <Typography variant="h5" gutterBottom>
              Appointment History
            </Typography>
            
            {pastAppointments.length === 0 ? (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography color="text.secondary">
                  You have no past appointments.
                </Typography>
              </Box>
            ) : (
              <List>
                {pastAppointments.map(appointment => (
                  <React.Fragment key={appointment.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Avatar>
                          {appointment.doctorName.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={appointment.doctorName}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">
                              {new Date(appointment.date).toLocaleString()}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Typography 
                                variant="body2" 
                                color={appointment.status === 'cancelled' ? 'error' : 'success'}
                              >
                                {appointment.status}
                              </Typography>
                              <Typography variant="body2">
                                {appointment.type === 'video' ? 'Video' : 'Chat'}
                              </Typography>
                            </Box>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider component="li" />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add New Appointment</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12}>
              <TextField
                label="Doctor/Healthcare Provider Name"
                name="doctorName"
                value={formData.doctorName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  name="type"
                  value={formData.type}
                  label="Appointment Type"
                  onChange={handleSelectChange}
                >
                  <MenuItem value="video">Video Consultation</MenuItem>
                  <MenuItem value="chat">Chat Consultation</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                multiline
                rows={3}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch 
                    checked={formData.reminder} 
                    onChange={handleSwitchChange}
                    color="primary"
                  />
                }
                label="Enable appointment reminder"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleAddAppointment}
            disabled={!formData.doctorName || !formData.date || !formData.time}
          >
            Add Appointment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SimpleTeleHealth;

 