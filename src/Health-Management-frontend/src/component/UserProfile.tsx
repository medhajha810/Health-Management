import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useUser, UserProfile as ProfileType } from './UserContext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserProfile: React.FC = () => {
  const { currentProfile, updateProfile, profiles, addProfile, deleteProfile, setCurrentProfile } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<ProfileType>>(currentProfile || {});
  const [showNewProfile, setShowNewProfile] = useState(false);
  const [newProfile, setNewProfile] = useState<Partial<ProfileType>>({
    name: '',
    email: '',
    phone: '',
    bloodType: '',
    allergies: [],
    conditions: [],
    medications: []
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleNewProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewProfile({
      ...newProfile,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = () => {
    if (currentProfile && editedProfile) {
      updateProfile(currentProfile.id, editedProfile);
      setIsEditing(false);
    }
  };

  const handleCreateProfile = () => {
    if (newProfile.name) {
      const profile = addProfile(newProfile as ProfileType);
      setCurrentProfile(profile.id);
      setShowNewProfile(false);
      setNewProfile({
        name: '',
        email: '',
        phone: '',
        bloodType: '',
        allergies: [],
        conditions: [],
        medications: []
      });
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy && editedProfile) {
      const allergies = [...(editedProfile.allergies || []), newAllergy];
      setEditedProfile({ ...editedProfile, allergies });
      setNewAllergy('');
    }
  };

  const handleAddCondition = () => {
    if (newCondition && editedProfile) {
      const conditions = [...(editedProfile.conditions || []), newCondition];
      setEditedProfile({ ...editedProfile, conditions });
      setNewCondition('');
    }
  };

  const handleAddMedication = () => {
    if (newMedication && editedProfile) {
      const medications = [...(editedProfile.medications || []), newMedication];
      setEditedProfile({ ...editedProfile, medications });
      setNewMedication('');
    }
  };

  const handleRemoveAllergy = (allergy: string) => {
    if (editedProfile && editedProfile.allergies) {
      const allergies = editedProfile.allergies.filter(a => a !== allergy);
      setEditedProfile({ ...editedProfile, allergies });
    }
  };

  const handleRemoveCondition = (condition: string) => {
    if (editedProfile && editedProfile.conditions) {
      const conditions = editedProfile.conditions.filter(c => c !== condition);
      setEditedProfile({ ...editedProfile, conditions });
    }
  };

  const handleRemoveMedication = (medication: string) => {
    if (editedProfile && editedProfile.medications) {
      const medications = editedProfile.medications.filter(m => m !== medication);
      setEditedProfile({ ...editedProfile, medications });
    }
  };

  const confirmProfileDelete = (id: string) => {
    setProfileToDelete(id);
    setConfirmDelete(true);
  };

  const handleDeleteProfile = () => {
    if (profileToDelete) {
      deleteProfile(profileToDelete);
      setConfirmDelete(false);
      setProfileToDelete(null);
    }
  };

  const switchToProfile = (id: string) => {
    setCurrentProfile(id);
  };

  if (!currentProfile) {
    return (
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
          <Typography variant="h4" gutterBottom>
            No Profile Found
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowNewProfile(true)}
          >
            Create New Profile
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            User Profile
          </Typography>
          <Box>
            {!isEditing ? (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveProfile}
              >
                Save Changes
              </Button>
            )}
          </Box>
        </Box>

        {!isEditing ? (
          // Profile View
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
              <Avatar
                alt={currentProfile.name}
                src={currentProfile.avatar}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Typography variant="h6">{currentProfile.name}</Typography>
              {currentProfile.email && (
                <Typography variant="body2" color="text.secondary">{currentProfile.email}</Typography>
              )}
              {currentProfile.phone && (
                <Typography variant="body2" color="text.secondary">{currentProfile.phone}</Typography>
              )}
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>Medical Information</Typography>
              {currentProfile.bloodType && (
                <Box mb={2}>
                  <Typography variant="subtitle2" color="text.secondary">Blood Type</Typography>
                  <Typography variant="body1">{currentProfile.bloodType}</Typography>
                </Box>
              )}
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">Allergies</Typography>
                <Box mt={1}>
                  {currentProfile.allergies && currentProfile.allergies.length > 0 ? (
                    currentProfile.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} sx={{ m: 0.5 }} />
                    ))
                  ) : (
                    <Typography variant="body2">No allergies recorded</Typography>
                  )}
                </Box>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">Medical Conditions</Typography>
                <Box mt={1}>
                  {currentProfile.conditions && currentProfile.conditions.length > 0 ? (
                    currentProfile.conditions.map((condition, index) => (
                      <Chip key={index} label={condition} sx={{ m: 0.5 }} />
                    ))
                  ) : (
                    <Typography variant="body2">No medical conditions recorded</Typography>
                  )}
                </Box>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" color="text.secondary">Current Medications</Typography>
                <Box mt={1}>
                  {currentProfile.medications && currentProfile.medications.length > 0 ? (
                    currentProfile.medications.map((medication, index) => (
                      <Chip key={index} label={medication} sx={{ m: 0.5 }} />
                    ))
                  ) : (
                    <Typography variant="body2">No medications recorded</Typography>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        ) : (
          // Edit Profile Form
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4} display="flex" flexDirection="column" alignItems="center">
              <Avatar
                alt={editedProfile.name || ''}
                src={editedProfile.avatar}
                sx={{ width: 120, height: 120, mb: 2 }}
              />
              <Button variant="outlined" size="small">Change Avatar</Button>
            </Grid>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={editedProfile.name || ''}
                onChange={handleProfileChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                value={editedProfile.email || ''}
                onChange={handleProfileChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Phone"
                name="phone"
                value={editedProfile.phone || ''}
                onChange={handleProfileChange}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Blood Type"
                name="bloodType"
                value={editedProfile.bloodType || ''}
                onChange={handleProfileChange}
              />
              
              <Box mt={3}>
                <Typography variant="subtitle1">Allergies</Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Allergy"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                  />
                  <IconButton color="primary" onClick={handleAddAllergy}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box mt={1}>
                  {editedProfile.allergies && editedProfile.allergies.map((allergy, index) => (
                    <Chip
                      key={index}
                      label={allergy}
                      onDelete={() => handleRemoveAllergy(allergy)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box mt={3}>
                <Typography variant="subtitle1">Medical Conditions</Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Condition"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                  />
                  <IconButton color="primary" onClick={handleAddCondition}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box mt={1}>
                  {editedProfile.conditions && editedProfile.conditions.map((condition, index) => (
                    <Chip
                      key={index}
                      label={condition}
                      onDelete={() => handleRemoveCondition(condition)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
              
              <Box mt={3}>
                <Typography variant="subtitle1">Current Medications</Typography>
                <Box display="flex" alignItems="center" mt={1}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Add Medication"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                  />
                  <IconButton color="primary" onClick={handleAddMedication}>
                    <AddIcon />
                  </IconButton>
                </Box>
                <Box mt={1}>
                  {editedProfile.medications && editedProfile.medications.map((medication, index) => (
                    <Chip
                      key={index}
                      label={medication}
                      onDelete={() => handleRemoveMedication(medication)}
                      sx={{ m: 0.5 }}
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
        
        {/* Profile Management Section */}
        <Box mt={4}>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" gutterBottom>Manage Profiles</Typography>
          
          <List>
            {profiles.map(profile => (
              <ListItem
                key={profile.id}
                secondaryAction={
                  profiles.length > 1 && (
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => confirmProfileDelete(profile.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    alt={profile.name}
                    src={profile.avatar}
                    sx={{ bgcolor: currentProfile.id === profile.id ? 'primary.main' : 'grey.400' }}
                  />
                </ListItemAvatar>
                <ListItemText 
                  primary={profile.name} 
                  secondary={currentProfile.id === profile.id ? 'Current profile' : (
                    <Button 
                      size="small" 
                      onClick={() => switchToProfile(profile.id)}
                    >
                      Switch to this profile
                    </Button>
                  )} 
                />
              </ListItem>
            ))}
          </List>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PersonAddIcon />}
            onClick={() => setShowNewProfile(true)}
            sx={{ mt: 2 }}
          >
            Add New Profile
          </Button>
        </Box>
      </Paper>
      
      {/* New Profile Dialog */}
      <Dialog open={showNewProfile} onClose={() => setShowNewProfile(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create New Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            required
            value={newProfile.name}
            onChange={handleNewProfileChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            fullWidth
            value={newProfile.email || ''}
            onChange={handleNewProfileChange}
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            fullWidth
            value={newProfile.phone || ''}
            onChange={handleNewProfileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNewProfile(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateProfile} 
            variant="contained" 
            color="primary"
            disabled={!newProfile.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this profile? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteProfile} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UserProfile; 