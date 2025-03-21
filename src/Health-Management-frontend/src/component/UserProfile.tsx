import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid as MuiGrid,
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
  DialogActions,
  Tooltip,
  Zoom,
  Card,
  CardContent,
  Badge,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import { useUser, UserProfile as ProfileType } from './UserContext';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import MedicationIcon from '@mui/icons-material/Medication';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// Rename Grid to avoid deprecation warnings throughout the code
const Grid = MuiGrid;

// Define interface for the MedicalInfoCard props
interface MedicalInfoCardProps {
  title: string;
  icon: React.ReactNode;
  items: string[];
  emptyMessage: string;
  onAdd: (item: string) => void;
  onDelete: (item: string) => void;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
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
    medications: [],
    abhaId: ''
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  const [newMedication, setNewMedication] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<string | null>(null);
  const [showAbhaLinkDialog, setShowAbhaLinkDialog] = useState(false);
  const [abhaDetails, setAbhaDetails] = useState({
    abhaId: '',
    otp: '',
    isVerifying: false,
    isVerified: false,
    error: '',
    demoOtp: ''
  });
  const [abhaLinked, setAbhaLinked] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const newProfileFileInputRef = useRef<HTMLInputElement>(null);
  const [newProfileAvatar, setNewProfileAvatar] = useState<string>('');

  useEffect(() => {
    // Check if the current profile has a linked ABHA ID
    if (currentProfile?.abhaId && currentProfile?.abhaCardLinked) {
      setAbhaLinked(true);
    } else {
      setAbhaLinked(false);
    }
  }, [currentProfile]);

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

  const handleNewProfileAvatarClick = () => {
    newProfileFileInputRef.current?.click();
  };

  const handleNewProfileFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewProfileAvatar(base64String);
        setNewProfile({
          ...newProfile,
          avatar: base64String
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateProfile = () => {
    if (newProfile.name) {
      // Ensure newProfile has the required fields
      const completeProfile = {
        ...newProfile,
        id: `profile-${Date.now()}`, // Generate a unique ID if the addProfile doesn't
        allergies: newProfile.allergies || [],
        medications: newProfile.medications || [],
        conditions: newProfile.conditions || [],
        avatar: newProfileAvatar || ''
      } as ProfileType;
      
      addProfile(completeProfile);
      setCurrentProfile(completeProfile.id);
      setShowNewProfile(false);
      setNewProfile({
        name: '',
        email: '',
        phone: '',
        bloodType: '',
        allergies: [],
        conditions: [],
        medications: [],
        abhaId: ''
      });
      setNewProfileAvatar('');
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

  const handleDeleteProfile = (id: string) => {
    deleteProfile(id);
  };

  const switchToProfile = (id: string) => {
    setCurrentProfile(id);
  };

  const handleAbhaDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAbhaDetails({
      ...abhaDetails,
      [e.target.name]: e.target.value,
      error: ''
    });
  };

  const handleSendAbhaOtp = () => {
    // Validate ABHA ID format first
    const abhaIdRegex = /^\d{14}$|^\d{4}-\d{4}-\d{4}-\d{4}$/;
    
    if (!abhaIdRegex.test(abhaDetails.abhaId)) {
      setAbhaDetails({
        ...abhaDetails,
        error: 'Please enter a valid 14-digit ABHA ID (format: XXXX-XXXX-XXXX-XXXX or 14 digits)'
      });
      return;
    }
    
    setAbhaDetails({
      ...abhaDetails,
      isVerifying: true,
      error: ''
    });
    
    // In a real implementation, this would call the ABDM /api/v1/auth/generateOtp endpoint
    // For demo, we'll simulate OTP generation after a delay
    setTimeout(() => {
      // Create a fixed OTP for demo purposes - would be real in production
      const demoOtp = '123456';
      // Store OTP in session storage for verification
      sessionStorage.setItem('abha_otp', demoOtp);
      
      setAbhaDetails(prev => ({
        ...prev,
        isVerifying: false,
        error: '',
        // In a real app, we would not expose the OTP to the frontend
        // This is only for demo purposes
        demoOtp
      }));
    }, 1500);
  };

  const handleVerifyAbhaOtp = () => {
    // Validate OTP length
    if (abhaDetails.otp.length !== 6) {
      setAbhaDetails({
        ...abhaDetails,
        error: 'OTP must be 6 digits'
      });
      return;
    }
    
    setAbhaDetails({
      ...abhaDetails,
      isVerifying: true,
      error: ''
    });
    
    // In a real implementation, this would call the ABDM /api/v1/auth/verifyOtp endpoint
    setTimeout(() => {
      const storedOtp = sessionStorage.getItem('abha_otp');
      
      if (abhaDetails.otp === storedOtp) {
        // Success
        // In a real app, the server would return a token and user details
        const demoAbhaToken = 'abha_' + Date.now().toString();
        sessionStorage.setItem('abha_token', demoAbhaToken);
        
        // Simulate fetching user details from ABHA system
        const abhaUserDetails = {
          name: currentProfile?.name || "ABHA User",
          gender: "Male",
          yearOfBirth: "1990",
          phone: currentProfile?.phone || "9XXXXXXXX0",
          email: currentProfile?.email || "user@example.com",
          healthId: abhaDetails.abhaId,
          healthIdNumber: abhaDetails.abhaId.replace(/-/g, ''),
          address: {
            line: "123 Health Street",
            district: "Central District",
            state: "Delhi",
            pincode: "110001"
          },
          bloodGroup: currentProfile?.bloodType || "B+",
          // Additional fields that would come from ABHA
          allergies: ["Peanuts", "Penicillin"],
          conditions: ["Hypertension", "Type 2 Diabetes"],
          medications: ["Metformin 500mg", "Lisinopril 10mg"]
        };
        
        // Store the user details
        sessionStorage.setItem('abha_user_details', JSON.stringify(abhaUserDetails));
        
        setAbhaDetails({
          ...abhaDetails,
          isVerified: true,
          isVerifying: false
        });
        
        // Update profile with ABHA ID and details
        if (currentProfile) {
          // Merge ABHA data with current profile data
          const updatedProfile = {
            ...currentProfile,
            abhaId: abhaDetails.abhaId,
            abhaCardLinked: true,
            // Update profile with data from ABHA (in a real app)
            bloodType: abhaUserDetails.bloodGroup || currentProfile.bloodType,
            allergies: [...new Set([...(currentProfile.allergies || []), ...abhaUserDetails.allergies])],
            conditions: [...new Set([...(currentProfile.conditions || []), ...abhaUserDetails.conditions])],
            medications: [...new Set([...(currentProfile.medications || []), ...abhaUserDetails.medications])]
          };
          
          updateProfile(currentProfile.id, updatedProfile);
          setAbhaLinked(true);
          
          // Alert user that data was imported (in real app would be a nicer UI)
          alert(`Successfully linked ABHA ID and imported health data.`);
        }
      } else {
        setAbhaDetails({
          ...abhaDetails,
          isVerifying: false,
          error: 'Invalid OTP. Please try again.'
        });
      }
    }, 1500);
  };

  const handleLinkAbha = () => {
    setShowAbhaLinkDialog(true);
    setAbhaDetails({
      abhaId: currentProfile?.abhaId || '',
      otp: '',
      isVerifying: false,
      isVerified: false,
      error: '',
      demoOtp: ''
    });
  };

  const handleProfilePictureClick = () => {
    setShowProfilePictureDialog(true);
  };

  const handleProfilePictureDialogClose = () => {
    setShowProfilePictureDialog(false);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile(currentProfile.id, { avatar: base64String });
        setShowProfilePictureDialog(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const ABHADetailsCard = () => {
    // Get the stored ABHA user details if available
    const abhaUserDetailsStr = sessionStorage.getItem('abha_user_details');
    const abhaUserDetails = abhaUserDetailsStr ? JSON.parse(abhaUserDetailsStr) : null;
    
    if (!currentProfile?.abhaId || !currentProfile?.abhaCardLinked) return null;
    
    return (
      <Card 
        sx={{ 
          mb: 3, 
          borderRadius: 2,
          boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
          border: '1px solid rgba(230,230,230,0.5)',
          background: 'linear-gradient(145deg, #f8fbff, #ffffff)',
          position: 'relative',
          overflow: 'hidden',
          animation: 'fadeIn 0.8s ease-out',
          '@keyframes fadeIn': {
            '0%': { opacity: 0, transform: 'translateY(20px)' },
            '100%': { opacity: 1, transform: 'translateY(0)' }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0) 70%)',
            zIndex: 0
          },
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 15px 25px rgba(0,0,0,0.1), 0 5px 10px rgba(76,175,80,0.08)',
          }
        }}
      >
        <CardContent sx={{ position: 'relative', zIndex: 1 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 2,
              animation: 'slideRight 0.5s ease-out',
              '@keyframes slideRight': {
                '0%': { opacity: 0, transform: 'translateX(-20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          >
            <Box
              sx={{
                backgroundColor: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '50%',
                width: 40,
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 1.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(76, 175, 80, 0.2)',
                  transform: 'rotate(10deg)'
                }
              }}
            >
              <HealthAndSafetyIcon sx={{ color: '#4caf50', fontSize: 24 }} />
            </Box>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              color="#4caf50"
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -3,
                  left: 0,
                  width: '30px',
                  height: '2px',
                  backgroundColor: '#4caf50',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '100%'
                }
              }}
            >
              ABHA Details
            </Typography>
          </Box>
          
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              mb: 1,
              animation: 'slideRight 0.5s ease-out 0.1s both',
              '@keyframes slideRight': {
                '0%': { opacity: 0, transform: 'translateX(-20px)' },
                '100%': { opacity: 1, transform: 'translateX(0)' }
              }
            }}
          >
            <CheckCircleOutlineIcon 
              color="success" 
              sx={{ 
                mr: 1, 
                fontSize: 18,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' },
                  '100%': { transform: 'scale(1)' }
                }
              }} 
            />
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {currentProfile.abhaId}
            </Typography>
          </Box>
          
          {abhaUserDetails && (
            <>
              <Divider 
                sx={{ 
                  my: 2,
                  '&::after': {
                    content: '""',
                    display: 'block',
                    width: '50px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #4caf50, rgba(76, 175, 80, 0.2))',
                    borderRadius: '2px',
                    marginTop: '-1px'
                  }
                }} 
              />
              <Grid 
                container 
                spacing={2}
                sx={{
                  animation: 'fadeUp 0.5s ease-out 0.2s both',
                  '@keyframes fadeUp': {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                }}
              >
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Name on ABHA:
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: '#4caf50' }
                    }}
                  >
                    {abhaUserDetails.name}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Gender:
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: '#4caf50' }
                    }}
                  >
                    {abhaUserDetails.gender}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Year of Birth:
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: '#4caf50' }
                    }}
                  >
                    {abhaUserDetails.yearOfBirth}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Linked on:
                  </Typography>
                  <Typography 
                    variant="body1"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': { color: '#4caf50' }
                    }}
                  >
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  const MedicalInfoCard = ({ title, icon, items, emptyMessage, onAdd, onDelete }: MedicalInfoCardProps) => {
    const [newItem, setNewItem] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    // Create typed helper functions
    const handleAddItem = (item: string) => {
      onAdd(item);
    };

    const handleDeleteItem = (item: string) => {
      onDelete(item);
    };

    return (
      <Card 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: 2,
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          background: 'linear-gradient(145deg, #ffffff, #f5f8ff)',
          boxShadow: isHovered 
            ? '0 15px 30px rgba(0,0,0,0.15), 0 5px 15px rgba(25,118,210,0.08)' 
            : '0 5px 15px rgba(0,0,0,0.06)',
          transform: isHovered ? 'translateY(-8px) scale(1.01)' : 'translateY(0) scale(1)',
          overflow: 'hidden',
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            height: '5px',
            background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
            transform: isHovered ? 'scaleX(1)' : 'scaleX(0)',
            transformOrigin: 'left',
            transition: 'transform 0.4s ease',
          }
        }}
      >
        <CardContent sx={{ flexGrow: 1, zIndex: 1 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <Box 
              mr={1.5} 
              color="primary.main"
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(25, 118, 210, 0.1)',
                borderRadius: '50%',
                padding: 1,
                transition: 'transform 0.3s ease-in-out',
                transform: isHovered ? 'rotate(360deg) scale(1.1)' : 'rotate(0) scale(1)',
              }}
            >
              {icon}
            </Box>
            <Typography 
              variant="h6" 
              fontWeight="bold" 
              color="primary.main"
              sx={{
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -2,
                  left: 0,
                  width: isHovered ? '100%' : '0%',
                  height: '2px',
                  backgroundColor: 'primary.main',
                  transition: 'width 0.3s ease'
                }
              }}
            >
              {title}
            </Typography>
          </Box>
          
          {items.length > 0 ? (
            <Box 
              display="flex" 
              flexWrap="wrap" 
              gap={1} 
              mb={2}
              sx={{
                animation: 'fadeIn 0.5s ease-in-out',
                '@keyframes fadeIn': {
                  '0%': { opacity: 0 },
                  '100%': { opacity: 1 }
                }
              }}
            >
              {items.map((item: string, index: number) => (
                <Chip
                  key={index}
                  label={item}
                  onDelete={() => handleDeleteItem(item)}
                  sx={{ 
                    bgcolor: isHovered ? '#e3f2fd' : '#ffe0b2', 
                    fontWeight: 'medium',
                    color: 'text.primary',
                    transition: 'all 0.3s ease',
                    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s`,
                    '&:hover': {
                      bgcolor: '#bbdefb',
                      transform: 'translateY(-2px)'
                    }
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography 
              variant="body2" 
              color="text.primary" 
              sx={{ 
                fontStyle: 'italic', 
                mb: 2,
                opacity: 0.7,
                transition: 'opacity 0.3s ease',
                '&:hover': {
                  opacity: 1
                }
              }}
            >
              {emptyMessage}
            </Typography>
          )}
          
          <Box 
            display="flex" 
            mt="auto"
            sx={{
              opacity: isHovered ? 1 : 0.9,
              transform: isHovered ? 'translateY(0)' : 'translateY(5px)',
              transition: 'all 0.3s ease'
            }}
          >
            <TextField
              size="small"
              placeholder="Add new..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              sx={{ 
                flexGrow: 1,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: isHovered ? 'primary.light' : 'rgba(0, 0, 0, 0.23)',
                    transition: 'all 0.3s ease'
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                }
              }}
              InputProps={{
                sx: { bgcolor: 'background.paper', color: 'text.primary' }
              }}
            />
            <Button 
              color="primary" 
              variant="contained"
              disabled={!newItem.trim()}
              onClick={() => {
                if (newItem.trim()) {
                  handleAddItem(newItem.trim());
                  setNewItem('');
                }
              }}
              sx={{ 
                ml: 1,
                transition: 'all 0.3s ease',
                bgcolor: isHovered ? 'primary.main' : 'primary.light',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  bgcolor: 'primary.dark',
                  boxShadow: '0 4px 8px rgba(25,118,210,0.3)'
                }
              }}
            >
              <AddIcon />
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
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
    <Container 
      maxWidth="lg" 
      sx={{
        position: 'relative',
        py: 4,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(216,241,230,0.46) 0%, rgba(233,226,248,0.46) 50.91%, rgba(231,241,255,0.46) 90%)',
          backgroundSize: 'cover',
          zIndex: -1,
          borderRadius: 2,
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3,
        animation: 'fadeIn 0.8s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' }
        }
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Profile Settings
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<HomeIcon />}
          onClick={() => navigate('/')}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            py: 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 4px 12px rgba(25,118,210,0.3)',
            }
          }}
        >
          Home
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} sx={{
          animation: 'slideInLeft 0.8s ease-in-out',
          '@keyframes slideInLeft': {
            '0%': { opacity: 0, transform: 'translateX(-20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' }
          }
        }}>
          <Card 
            elevation={3} 
            sx={{ 
              p: 3, 
              height: '100%',
              borderRadius: 2,
              transition: 'transform 0.3s, box-shadow 0.3s',
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              },
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Edit Profile" arrow>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#1976d2', 
                        color: 'white',
                        '&:hover': { bgcolor: '#1565c0' } 
                      }}
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                  badgeContent={
                    <Tooltip title="Upload Photo" arrow>
                      <IconButton 
                        size="small" 
                        sx={{ 
                          bgcolor: '#9c27b0', 
                          color: 'white',
                          '&:hover': { bgcolor: '#7b1fa2' } 
                        }}
                        onClick={handleProfilePictureClick}
                      >
                        <PhotoCameraIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <Avatar 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      fontSize: 40, 
                      bgcolor: currentProfile?.avatar ? 'transparent' : '#1976d2',
                      mb: 2,
                      mx: 'auto',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                    src={currentProfile?.avatar || ''}
                  >
                    {!currentProfile?.avatar && (currentProfile?.name?.charAt(0) || 'U')}
                  </Avatar>
                </Badge>
              </Badge>
              <Typography variant="h5" fontWeight="bold">{currentProfile?.name}</Typography>
              {currentProfile?.email && (
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentProfile.email}
                </Typography>
              )}
              {currentProfile?.phone && (
                <Typography variant="body2" color="text.secondary">
                  {currentProfile.phone}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <BloodtypeIcon sx={{ mr: 1, color: '#e53935' }} />
                <Typography variant="subtitle2" fontWeight="bold">Blood Type</Typography>
              </Box>
              <Typography variant="body1" sx={{ ml: 4 }}>
                {currentProfile?.bloodType || 'Not specified'}
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <HealthAndSafetyIcon sx={{ mr: 1, color: '#4caf50' }} />
                <Typography variant="subtitle2" fontWeight="bold">ABHA ID</Typography>
              </Box>
              
              {currentProfile?.abhaId ? (
                <Box sx={{ ml: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircleOutlineIcon color="success" sx={{ mr: 1, fontSize: 18 }} />
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {currentProfile.abhaId}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Your ABHA ID is linked to this profile
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    color="primary"
                    startIcon={<LinkIcon />}
                    onClick={handleLinkAbha}
                    sx={{ mt: 1, borderRadius: 1.5 }}
                  >
                    Update ABHA Link
                  </Button>
                </Box>
              ) : (
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No ABHA ID linked to this profile
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    startIcon={<LinkIcon />}
                    onClick={handleLinkAbha}
                    sx={{ mt: 1, borderRadius: 1.5 }}
                  >
                    Link ABHA ID
                  </Button>
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                Available Profiles
              </Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto', bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {profiles.map(profile => (
                  <ListItem
                    component="div" 
                    key={profile.id}
                    onClick={() => switchToProfile(profile.id)}
                    sx={{ 
                      borderRadius: 1,
                      mb: 0.5,
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: '#e3f2fd',
                      },
                      ...(profile.id === currentProfile?.id && {
                        bgcolor: '#bbdefb !important',
                      })
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ bgcolor: profile.id === currentProfile?.id ? '#1976d2' : '#90caf9' }}
                        src={profile.avatar || ''}
                      >
                        {!profile.avatar && profile.name?.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={profile.name} />
                    {profiles.length > 1 && (
                      <Tooltip title="Delete Profile">
                        <IconButton 
                          edge="end" 
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmProfileDelete(profile.id);
                          }} 
                          color="error"
                          size="small"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </ListItem>
                ))}
              </List>
              <Button
                fullWidth
                variant="outlined"
                color="primary"
                startIcon={<PersonAddIcon />}
                onClick={() => setShowNewProfile(true)}
                sx={{ 
                  mt: 2, 
                  borderRadius: 2,
                  textTransform: 'none',
                  transition: 'all 0.2s',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  }
                }}
              >
                Add New Profile
              </Button>
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8} sx={{
          animation: 'slideInRight 0.8s ease-in-out',
          '@keyframes slideInRight': {
            '0%': { opacity: 0, transform: 'translateX(20px)' },
            '100%': { opacity: 1, transform: 'translateX(0)' }
          }
        }}>
          <Card 
            elevation={3} 
            sx={{ 
              p: 3, 
              borderRadius: 2,
              height: '100%',
              background: 'linear-gradient(135deg, #ffffff 0%, #f7f9fc 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                right: 0,
                width: '150px',
                height: '150px',
                background: 'radial-gradient(circle, rgba(25,118,210,0.1) 0%, rgba(25,118,210,0) 70%)',
                zIndex: 0,
                borderRadius: '0 0 0 100%'
              }
            }}
          >
            <Typography 
              variant="h5" 
              fontWeight="bold" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                position: 'relative',
                zIndex: 1,
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -5,
                  left: 0,
                  width: '40px',
                  height: '3px',
                  backgroundColor: '#1976d2',
                  transition: 'width 0.3s ease',
                },
                '&:hover::after': {
                  width: '80px'
                }
              }}
            >
              Medical Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <ABHADetailsCard />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <MedicalInfoCard
                  title="Allergies"
                  icon={<WarningAmberIcon />}
                  items={currentProfile?.allergies || []}
                  emptyMessage="No allergies recorded"
                  onAdd={(allergy: string) => {
                    if (currentProfile) {
                      const allergies = [...(currentProfile.allergies || []), allergy];
                      updateProfile(currentProfile.id, { ...currentProfile, allergies });
                    }
                  }}
                  onDelete={(allergy: string) => {
                    if (currentProfile && currentProfile.allergies) {
                      const allergies = currentProfile.allergies.filter(a => a !== allergy);
                      updateProfile(currentProfile.id, { ...currentProfile, allergies });
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <MedicalInfoCard
                  title="Medications"
                  icon={<MedicationIcon />}
                  items={currentProfile?.medications || []}
                  emptyMessage="No medications recorded"
                  onAdd={(medication: string) => {
                    if (currentProfile) {
                      const medications = [...(currentProfile.medications || []), medication];
                      updateProfile(currentProfile.id, { ...currentProfile, medications });
                    }
                  }}
                  onDelete={(medication: string) => {
                    if (currentProfile && currentProfile.medications) {
                      const medications = currentProfile.medications.filter(m => m !== medication);
                      updateProfile(currentProfile.id, { ...currentProfile, medications });
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <MedicalInfoCard
                  title="Medical Conditions"
                  icon={<MonitorHeartIcon />}
                  items={currentProfile?.conditions || []}
                  emptyMessage="No medical conditions recorded"
                  onAdd={(condition: string) => {
                    if (currentProfile) {
                      const conditions = [...(currentProfile.conditions || []), condition];
                      updateProfile(currentProfile.id, { ...currentProfile, conditions });
                    }
                  }}
                  onDelete={(condition: string) => {
                    if (currentProfile && currentProfile.conditions) {
                      const conditions = currentProfile.conditions.filter(c => c !== condition);
                      updateProfile(currentProfile.id, { ...currentProfile, conditions });
                    }
                  }}
                />
              </Grid>
            </Grid>

            {isEditing && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Edit Profile
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name="name"
                      value={editedProfile?.name || ''}
                      onChange={handleProfileChange}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Type"
                      name="bloodType"
                      value={editedProfile?.bloodType || ''}
                      onChange={handleProfileChange}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Email"
                      name="email"
                      value={editedProfile?.email || ''}
                      onChange={handleProfileChange}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone"
                      name="phone"
                      value={editedProfile?.phone || ''}
                      onChange={handleProfileChange}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Allergies
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Allergy"
                        value={newAllergy}
                        onChange={(e) => setNewAllergy(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddAllergy}
                        disabled={!newAllergy}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Medical Conditions
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Condition"
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddCondition}
                        disabled={!newCondition}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Medications
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <TextField
                        fullWidth
                        label="Add Medication"
                        value={newMedication}
                        onChange={(e) => setNewMedication(e.target.value)}
                        variant="outlined"
                        size="small"
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddMedication}
                        disabled={!newMedication}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        Add
                      </Button>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="ABHA ID"
                      name="abhaId"
                      value={editedProfile?.abhaId || ''}
                      onChange={handleProfileChange}
                      variant="outlined"
                      placeholder="14-digit ABHA ID"
                      helperText="Your Ayushman Bharat Health Account ID"
                      sx={{ mb: 2 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
                      <Button
                        variant="outlined"
                        onClick={() => setIsEditing(false)}
                        startIcon={<CancelIcon />}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSaveProfile}
                        startIcon={<CheckCircleIcon />}
                        sx={{ 
                          bgcolor: '#4caf50',
                          '&:hover': { bgcolor: '#388e3c' }
                        }}
                      >
                        Save Changes
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* New Profile Dialog */}
      <Dialog 
        open={showNewProfile} 
        onClose={() => setShowNewProfile(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
            background: 'transparent',
          }
        }}
        TransitionComponent={Zoom}
        transitionDuration={400}
      >
        <Box 
          sx={{ 
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url("https://img.freepik.com/free-vector/abstract-medical-wallpaper-template-design_53876-61802.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.15,
              zIndex: -1,
            }
          }}
        >
          <Box 
            sx={{ 
              backgroundImage: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
                animation: 'pulse 5s infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)', opacity: 0.5 },
                  '50%': { transform: 'scale(1.5)', opacity: 0.7 },
                  '100%': { transform: 'scale(1)', opacity: 0.5 }
                }
              }
            }}
          >
            <DialogTitle sx={{ p: 0, color: 'white', fontWeight: 'bold' }}>
              Create New Profile
            </DialogTitle>
          </Box>
          <DialogContent 
            sx={{ 
              mt: 2,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(5px)',
              borderRadius: '0 0 8px 8px',
              position: 'relative'
            }}
          >
            <Box 
              display="flex" 
              justifyContent="center" 
              mb={3} mt={1}
              sx={{ 
                animation: 'fadeInDown 0.5s ease-out',
                '@keyframes fadeInDown': {
                  '0%': { opacity: 0, transform: 'translateY(-20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title="Upload Photo" arrow>
                    <IconButton 
                      size="small" 
                      sx={{ 
                        bgcolor: '#1976d2', 
                        color: 'white',
                        '&:hover': { 
                          bgcolor: '#1565c0',
                          transform: 'scale(1.1)'
                        },
                        transition: 'transform 0.2s ease-out',
                        animation: 'bounce 2s infinite ease-in-out',
                        '@keyframes bounce': {
                          '0%, 100%': { transform: 'scale(1)' },
                          '50%': { transform: 'scale(1.1)' }
                        }
                      }}
                      onClick={handleNewProfileAvatarClick}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
              >
                <Avatar 
                  sx={{ 
                    width: 100, 
                    height: 100, 
                    fontSize: 36, 
                    bgcolor: newProfileAvatar ? 'transparent' : '#bbdefb',
                    color: '#1976d2',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
                    border: '3px solid #fff',
                    transition: 'transform 0.3s ease-out',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                  src={newProfileAvatar || ''}
                >
                  {!newProfileAvatar && <PersonAddIcon sx={{ fontSize: 50 }} />}
                </Avatar>
              </Badge>
            </Box>

            <Grid 
              container 
              spacing={2}
              sx={{
                '& .MuiGrid-item': {
                  animation: 'fadeInUp 0.5s ease-out',
                  '@keyframes fadeInUp': {
                    '0%': { opacity: 0, transform: 'translateY(20px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' }
                  }
                },
                '& .MuiGrid-item:nth-of-type(1)': { animationDelay: '0s' },
                '& .MuiGrid-item:nth-of-type(2)': { animationDelay: '0.1s' },
                '& .MuiGrid-item:nth-of-type(3)': { animationDelay: '0.2s' },
                '& .MuiGrid-item:nth-of-type(4)': { animationDelay: '0.3s' },
                '& .MuiGrid-item:nth-of-type(5)': { animationDelay: '0.4s' }
              }}
            >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Name"
                  name="name"
                  value={newProfile.name || ''}
                  onChange={handleNewProfileChange}
                  InputLabelProps={{
                    sx: { color: 'text.secondary' }
                  }}
                  InputProps={{
                    sx: { 
                      color: 'text.primary',
                      '&:focus': {
                        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                      },
                    }
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  value={newProfile.email}
                  onChange={handleNewProfileChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={newProfile.phone}
                  onChange={handleNewProfileChange}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Blood Type"
                  name="bloodType"
                  value={newProfile.bloodType}
                  onChange={handleNewProfileChange}
                  fullWidth
                  variant="outlined"
                  placeholder="e.g., A+, B-, O+"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="ABHA ID (optional)"
                  name="abhaId"
                  value={newProfile.abhaId || ''}
                  onChange={handleNewProfileChange}
                  fullWidth
                  variant="outlined"
                  placeholder="14-digit ABHA ID"
                  helperText="Your Ayushman Bharat Health Account ID"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    }
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions 
            sx={{ 
              px: 3, 
              pb: 3,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(5px)',
              animation: 'fadeInUp 0.5s ease-out 0.5s both',
              '@keyframes fadeInUp': {
                '0%': { opacity: 0, transform: 'translateY(20px)' },
                '100%': { opacity: 1, transform: 'translateY(0)' }
              }
            }}
          >
            <Button 
              onClick={() => setShowNewProfile(false)}
              sx={{ 
                color: 'text.primary',
                '&:hover': {
                  bgcolor: 'rgba(0,0,0,0.05)',
                  transform: 'translateY(-2px)'
                },
                transition: 'transform 0.2s ease'
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateProfile}
              variant="contained" 
              color="primary"
              disabled={!newProfile.name}
              sx={{ 
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                '&:hover': { 
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)',
                  animation: 'shimmer 2s infinite',
                  '@keyframes shimmer': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' }
                  }
                }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Box 
          sx={{ 
            backgroundImage: 'linear-gradient(45deg, #f44336 30%, #e57373 90%)',
            p: 2
          }}
        >
          <DialogTitle sx={{ p: 0, color: 'white', fontWeight: 'bold' }}>
            Confirm Delete
          </DialogTitle>
        </Box>
        <DialogContent sx={{ mt: 2 }}>
          <Typography color="text.primary">
            Are you sure you want to delete this profile? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={() => setConfirmDelete(false)}
            sx={{ 
              color: 'text.primary',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (profileToDelete) {
                handleDeleteProfile(profileToDelete);
                setConfirmDelete(false);
              }
            }}
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add ABHA Link Dialog */}
      <Dialog
        open={showAbhaLinkDialog}
        onClose={() => !abhaDetails.isVerifying && setShowAbhaLinkDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: 'hidden'
          }
        }}
      >
        <Box 
          sx={{ 
            backgroundImage: 'linear-gradient(45deg, #4caf50 30%, #81c784 90%)',
            p: 2
          }}
        >
          <DialogTitle sx={{ p: 0, color: 'white', fontWeight: 'bold' }}>
            Link ABHA ID
          </DialogTitle>
        </Box>
        
        <DialogContent sx={{ mt: 2 }}>
          {abhaDetails.isVerified ? (
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom color="success.main" fontWeight="bold">
                ABHA ID Successfully Linked!
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                Your Ayushman Bharat Health Account has been linked to your profile and your health data has been imported.
              </Typography>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Card sx={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 2, mb: 2 }}>
                  <CardContent sx={{ px: 3, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <HealthAndSafetyIcon sx={{ color: '#4caf50', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        ABHA ID Details
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Linked ABHA ID:
                    </Typography>
                    <Typography variant="body1" fontWeight="medium" gutterBottom>
                      {abhaDetails.abhaId}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mt: 1 }}>
                      Linked on:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </Card>

                <Card sx={{ width: '100%', maxWidth: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 2 }}>
                  <CardContent sx={{ px: 3, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <PersonIcon sx={{ color: '#1976d2', mr: 1 }} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Imported Health Data
                      </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    {(() => {
                      // Get the stored ABHA user details
                      const abhaUserDetailsStr = sessionStorage.getItem('abha_user_details');
                      if (!abhaUserDetailsStr) return null;
                      
                      const abhaUserDetails = JSON.parse(abhaUserDetailsStr);
                      return (
                        <>
                          <Grid container spacing={2}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Name:</Typography>
                              <Typography variant="body1" gutterBottom>{abhaUserDetails.name}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Gender:</Typography>
                              <Typography variant="body1" gutterBottom>{abhaUserDetails.gender}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Year of Birth:</Typography>
                              <Typography variant="body1" gutterBottom>{abhaUserDetails.yearOfBirth}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="text.secondary">Blood Group:</Typography>
                              <Typography variant="body1" gutterBottom>{abhaUserDetails.bloodGroup}</Typography>
                            </Grid>
                          </Grid>
                          
                          <Divider sx={{ my: 1 }} />
                          
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Additional data imported:
                          </Typography>
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="body2" color="text.secondary">
                              • {abhaUserDetails.allergies.length} allergies
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • {abhaUserDetails.conditions.length} medical conditions
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              • {abhaUserDetails.medications.length} medications
                            </Typography>
                          </Box>
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" paragraph>
                Enter your 14-digit ABHA ID to link your Ayushman Bharat Health Account with your profile. 
                This will allow you to access your health records from the National Digital Health ecosystem.
              </Typography>
              
              <TextField
                fullWidth
                margin="normal"
                label="ABHA ID"
                name="abhaId"
                value={abhaDetails.abhaId}
                onChange={handleAbhaDetailsChange}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                disabled={abhaDetails.isVerifying}
                sx={{ mb: 2 }}
                error={!!abhaDetails.error && abhaDetails.error.includes('ABHA')}
                helperText={abhaDetails.error && abhaDetails.error.includes('ABHA') ? abhaDetails.error : ''}
              />
              
              {abhaDetails.abhaId && (
                <>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      label="OTP"
                      name="otp"
                      type="number"
                      value={abhaDetails.otp}
                      onChange={handleAbhaDetailsChange}
                      disabled={abhaDetails.isVerifying}
                      placeholder="Enter 6-digit OTP"
                      error={!!abhaDetails.error && abhaDetails.error.includes('OTP')}
                      helperText={abhaDetails.error && abhaDetails.error.includes('OTP') ? abhaDetails.error : ''}
                      InputProps={{
                        inputProps: { 
                          maxLength: 6,
                          pattern: '[0-9]*'
                        }
                      }}
                    />
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSendAbhaOtp}
                      disabled={!abhaDetails.abhaId || abhaDetails.isVerifying}
                      sx={{ whiteSpace: 'nowrap', mt: 1 }}
                    >
                      {abhaDetails.isVerifying ? 'Sending...' : 'Send OTP'}
                    </Button>
                  </Box>
                  
                  {abhaDetails.demoOtp && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2">
                        <strong>DEMO MODE:</strong> For testing purposes, use OTP: <strong>{abhaDetails.demoOtp}</strong>
                      </Typography>
                    </Alert>
                  )}
                  
                  {abhaDetails.error && !abhaDetails.error.includes('ABHA') && !abhaDetails.error.includes('OTP') && (
                    <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                      {abhaDetails.error}
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ px: 3, pb: 3 }}>
          {abhaDetails.isVerified ? (
            <Button 
              onClick={() => setShowAbhaLinkDialog(false)}
              variant="contained" 
              color="primary"
              fullWidth
            >
              Done
            </Button>
          ) : (
            <>
              <Button 
                onClick={() => setShowAbhaLinkDialog(false)}
                sx={{ 
                  color: 'text.primary',
                  '&:hover': {
                    bgcolor: 'rgba(0,0,0,0.05)'
                  }
                }}
                disabled={abhaDetails.isVerifying}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleVerifyAbhaOtp}
                variant="contained" 
                color="primary"
                disabled={!abhaDetails.otp || abhaDetails.isVerifying || !abhaDetails.abhaId}
              >
                {abhaDetails.isVerifying ? 'Verifying...' : 'Verify & Link'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {/* Profile Picture Upload Dialog */}
      <Dialog open={showProfilePictureDialog} onClose={handleProfilePictureDialogClose}>
        <DialogTitle>Update Profile Picture</DialogTitle>
        <DialogContent>
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            p={2}
          >
            <Avatar 
              src={currentProfile?.avatar || ''} 
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                fontSize: 60,
                bgcolor: currentProfile?.avatar ? 'transparent' : '#1976d2'
              }}
            >
              {!currentProfile?.avatar && (currentProfile?.name?.charAt(0) || 'U')}
            </Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              <Button
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                onClick={handleUploadClick}
                sx={{ mb: 1 }}
              >
                Upload Photo
              </Button>
              {currentProfile?.avatar && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    if (currentProfile) {
                      updateProfile(currentProfile.id, { avatar: '' });
                      setShowProfilePictureDialog(false);
                    }
                  }}
                >
                  Remove Photo
                </Button>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfilePictureDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />

      <input
        type="file"
        ref={newProfileFileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleNewProfileFileInputChange}
      />
    </Container>
  );
};

export default UserProfile; 