import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  CircularProgress,
  Box,
  Alert,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Zoom,
  Card,
  CardContent,
  Slide,
  Fab,
  Snackbar,
  TextField
} from '@mui/material';
import { useAuth } from '../App';
import { useUser } from './UserContext';
import { useTheme } from './ThemeContext';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import BugReportIcon from '@mui/icons-material/BugReport';
import RefreshIcon from '@mui/icons-material/Refresh';
import LiveHelpIcon from '@mui/icons-material/LiveHelp';
import HelpIcon from '@mui/icons-material/Help';
import { motion } from 'framer-motion';

interface HealthRecord {
  id: string;
  date: string | bigint;
  record_type: string;
  description: string;
  doctor: string;
  patient: any;
}

const RecordList: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actor } = useAuth();
  const { currentProfile, updateProfile } = useUser();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openDebugDialog, setOpenDebugDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { darkMode } = useTheme();

  useEffect(() => {
    console.log('RecordList component mounted or updated');
    
    // Test if localStorage is working properly
    testLocalStorage();
    
    fetchRecords();
    
    // Check various success messages
    checkSuccessMessages();
    
    // Add animation to table rows when component mounts
    const animateRows = () => {
      const rows = document.querySelectorAll('tbody tr');
      rows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add('animate-row');
        }, 100 * index);
      });
    };
    
    if (!loading) {
      setTimeout(animateRows, 300);
    }
  }, [actor, location.pathname]);

  const fetchRecords = async () => {
    console.log('fetchRecords function called');
    try {
      // Force clear records for refetch
      setRecords([]);
      
      let backendRecords: HealthRecord[] = [];
      
      // Try to fetch records from the backend if an actor is available
      if (actor) {
        try {
          console.log('Attempting to fetch records from backend with actor:', actor);
          backendRecords = await actor.get_health_records();
          console.log('Records fetched from backend:', backendRecords);
        } catch (error) {
          console.error('Error fetching records from backend:', error);
        }
      } else {
        console.log('No actor available, skipping backend fetch');
      }
      
      // Get records from local storage
      console.log('Attempting to fetch records from localStorage');
      const localRecordsString = localStorage.getItem('health_records');
      console.log('Raw data from localStorage (health_records):', localRecordsString);
      
      let localRecords: HealthRecord[] = [];
      
      if (localRecordsString) {
        try {
          // Parse local records
          localRecords = JSON.parse(localRecordsString);
          console.log('Records successfully parsed from localStorage:', localRecords);
          console.log('Number of local records found:', localRecords.length);
          
          // Verify it's an array
          if (!Array.isArray(localRecords)) {
            console.error('Local records is not an array, resetting to empty array');
            localStorage.setItem('health_records', '[]');
            localRecords = [];
          }
          
          // Check if records have expected structure
          if (localRecords.length > 0) {
            console.log('Sample local record structure:', localRecords[0]);
            
            // Validate each record has required fields
            const validRecords = localRecords.filter(record => 
              record && 
              record.id && 
              record.date && 
              record.record_type && 
              record.doctor
            );
            
            if (validRecords.length !== localRecords.length) {
              console.warn(`Filtered out ${localRecords.length - validRecords.length} invalid records`);
              localStorage.setItem('health_records', JSON.stringify(validRecords));
              localRecords = validRecords;
            }
          }
        } catch (error) {
          console.error('Error parsing local records:', error);
          // Initialize health_records if broken
          localStorage.setItem('health_records', '[]');
        }
      } else {
        console.log('No records found in localStorage');
        // Initialize empty health_records array
        localStorage.setItem('health_records', '[]');
      }
      
      // Combine records
      console.log('Combining backend and local records');
      const combinedRecords = [...backendRecords, ...localRecords];
      console.log('Combined records (before deduplication):', combinedRecords);
      console.log('Number of combined records:', combinedRecords.length);
      
      // If we have records, process them
      if (combinedRecords.length > 0) {
        // Remove duplicates based on ID (prefer backend records)
        const uniqueRecords = combinedRecords.reduce((acc: HealthRecord[], record) => {
          // Ensure the record has all required fields
          if (!record.id || !record.record_type || !record.doctor) {
            console.warn('Skipping invalid record:', record);
            return acc;
          }
        
          // If we don't already have a record with this ID, add it
          if (!acc.some(r => r.id === record.id)) {
            acc.push(record);
          }
          return acc;
        }, []);
        
        console.log('Deduplicated records:', uniqueRecords);
        console.log('Number of unique records:', uniqueRecords.length);
        
        // Sort records by date (newest first)
        uniqueRecords.sort((a, b) => {
          const dateA = typeof a.date === 'string' ? parseInt(a.date) : Number(a.date);
          const dateB = typeof b.date === 'string' ? parseInt(b.date) : Number(b.date);
          return dateB - dateA;
        });
        
        // Save records to localStorage with BigInt handling
        try {
          // Prepare records for storage by handling BigInt values
          const recordsForStorage = uniqueRecords.map(record => ({
            ...record,
            date: typeof record.date === 'bigint' ? record.date.toString() : record.date
          }));
          
          // Store records in localStorage with custom replacer for BigInt
          localStorage.setItem('health_records', JSON.stringify(recordsForStorage, (key, value) => {
            if (typeof value === 'bigint') {
              return value.toString();
            }
            return value;
          }));
          
          console.log('Successfully saved records to localStorage with BigInt handling');
        } catch (error) {
          console.error('Error saving records to localStorage:', error);
        }
        
        console.log('Sorted records to display:', uniqueRecords);
        console.log('Setting records state with these values');
        setRecords(uniqueRecords);
      } else {
        console.log('No records to display');
      }
    } catch (error) {
      setError('Failed to load records');
      console.error('Error in fetchRecords:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (id: string) => {
    console.log(`RecordList: Viewing record with ID: ${id}`);
    
    try {
      // First clear any existing record in sessionStorage
      sessionStorage.removeItem('currentRecord');
      
      // Find the record in the current records array
      const record = records.find(r => r.id === id);
      
      if (!record) {
        console.error('RecordList: Record not found with ID:', id);
        throw new Error(`Record with ID ${id} not found`);
      }
      
      // Log the record being viewed
      console.log('RecordList: Found record to view:', record);
      
      // Ensure record has all required fields
      if (!record.id || !record.record_type || !record.doctor) {
        console.error('RecordList: Record is missing required fields:', record);
        throw new Error('Invalid record data');
      }
      
      // Make a clean copy of the record to avoid any reference issues
      // and handle BigInt serialization by converting date to string if it's BigInt
      const recordCopy = {
        id: record.id,
        date: typeof record.date === 'bigint' ? record.date.toString() : record.date,
        record_type: record.record_type,
        description: record.description || '',
        doctor: record.doctor,
        patient: record.patient
      };
      
      // Convert record to string with custom replacer to handle BigInt
      const recordStr = JSON.stringify(recordCopy, (key, value) => {
        // Convert BigInt to string if encountered
        if (typeof value === 'bigint') {
          return value.toString();
        }
        return value;
      });
      
      console.log('RecordList: Storing record in sessionStorage:', recordStr);
      sessionStorage.setItem('currentRecord', recordStr);
      
      // Verify it was stored correctly
      const storedRecord = sessionStorage.getItem('currentRecord');
      console.log('RecordList: Verification - Record retrieved from sessionStorage:', storedRecord);
      
      if (!storedRecord) {
        console.error('RecordList: Failed to store record in sessionStorage');
        throw new Error('Failed to store record data');
      }
      
      try {
        // Parse the stored record to verify it's valid JSON
        const parsedRecord = JSON.parse(storedRecord);
        console.log('RecordList: Parsed record from sessionStorage verification:', parsedRecord);
        
        if (!parsedRecord.id || parsedRecord.id !== id) {
          console.error('RecordList: Stored record ID mismatch or missing');
          throw new Error('Record ID verification failed');
        }
      } catch (parseError) {
        console.error('RecordList: Error parsing verification record:', parseError);
        throw new Error('Failed to validate stored record');
      }
      
      // Navigate to the record detail page
      console.log(`RecordList: Navigation to /records/${id}`);
    navigate(`/records/${id}`);
    } catch (error) {
      console.error('RecordList: Error in handleViewRecord:', error);
      alert(`Error viewing record: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Still attempt to navigate even if there was an error
      navigate(`/records/${id}`);
    }
  };

  const handleProfilePictureClick = () => {
    setOpenProfileDialog(true);
  };

  const handleProfileDialogClose = () => {
    setOpenProfileDialog(false);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && currentProfile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        updateProfile(currentProfile.id, { avatar: base64String });
      };
      reader.readAsDataURL(file);
      setOpenProfileDialog(false);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDiseasePrediction = () => {
    window.open('https://schandel08-app.hf.space', '_blank');
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const checkSuccessMessages = () => {
    // Check for save success
    const recordSaved = localStorage.getItem('record_saved_success');
    const lastSavedRecord = localStorage.getItem('last_saved_record');
    
    if (recordSaved === 'true') {
      let message = 'Record saved successfully!';
      
      if (lastSavedRecord) {
        try {
          const recordData = JSON.parse(lastSavedRecord);
          message = `Record "${recordData.record_type}" saved successfully!`;
        } catch (e) {
          console.error('Error parsing last saved record:', e);
        }
      }
      
      setSuccessMessage(message);
      setOpenSnackbar(true);
      
      // Clear the success flag
      localStorage.removeItem('record_saved_success');
      localStorage.removeItem('last_saved_record');
    }
    
    // Check for delete success
    const recordDeleted = localStorage.getItem('record_deleted_success');
    const deletedRecordType = localStorage.getItem('deleted_record_type');
    
    if (recordDeleted === 'true') {
      let message = 'Record deleted successfully!';
      
      if (deletedRecordType) {
        message = `Record "${deletedRecordType}" deleted successfully!`;
      }
      
      setSuccessMessage(message);
      setOpenSnackbar(true);
      
      // Clear the success flag
      localStorage.removeItem('record_deleted_success');
      localStorage.removeItem('deleted_record_type');
    }
    
    // Check for update success
    const recordUpdated = localStorage.getItem('record_updated_success');
    
    if (recordUpdated === 'true') {
      setSuccessMessage('Record updated successfully!');
      setOpenSnackbar(true);
      
      // Clear the success flag
      localStorage.removeItem('record_updated_success');
    }
  };

  const handleShowDebugInfo = () => {
    try {
      const healthRecords = localStorage.getItem('health_records');
      const parsedRecords = healthRecords ? JSON.parse(healthRecords) : [];
      
      const debugData = {
        recordsInLocalStorage: parsedRecords,
        recordsInState: records,
        localStorage: {
          health_records: healthRecords,
          record_saved_success: localStorage.getItem('record_saved_success'),
          last_saved_record: localStorage.getItem('last_saved_record')
        }
      };
      
      setDebugInfo(JSON.stringify(debugData, null, 2));
      setOpenDebugDialog(true);
    } catch (error) {
      console.error('Error generating debug info:', error);
      setDebugInfo('Error generating debug info: ' + error);
      setOpenDebugDialog(true);
    }
  };

  // Function to manually refresh the records
  const handleRefresh = () => {
    console.log('Manual refresh requested');
    setLoading(true);
    fetchRecords();
  };

  // Function to test if localStorage is working properly
  const testLocalStorage = () => {
    try {
      console.log('Testing localStorage functionality');
      
      // Try to write to localStorage
      localStorage.setItem('test_item', 'test_value');
      
      // Try to read from localStorage
      const testValue = localStorage.getItem('test_item');
      console.log('Test read from localStorage:', testValue);
      
      // Verify the value
      if (testValue === 'test_value') {
        console.log('localStorage is working properly');
      } else {
        console.error('localStorage read/write test failed - returned value does not match');
      }
      
      // Clean up
      localStorage.removeItem('test_item');
    } catch (error) {
      console.error('localStorage test failed with error:', error);
    }
  };

  // Adding a function to force reload from localStorage for debugging
  const forceReloadFromLocalStorage = () => {
    try {
      const healthRecords = localStorage.getItem('health_records');
      if (healthRecords) {
        const parsedRecords = JSON.parse(healthRecords);
        if (parsedRecords && Array.isArray(parsedRecords)) {
          setRecords(parsedRecords);
          alert('Records reloaded from localStorage: ' + parsedRecords.length + ' records found');
        } else {
          alert('Invalid record format in localStorage');
        }
      } else {
        alert('No records found in localStorage');
      }
    } catch (error) {
      console.error('Error reloading from localStorage:', error);
      alert('Error reloading from localStorage: ' + error);
    }
  };

  const backgroundStyle = {
    position: 'relative',
    minHeight: '100vh',
    backgroundImage: darkMode 
      ? 'linear-gradient(rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.9))' 
      : 'url("https://img.freepik.com/free-vector/abstract-medical-background-with-hexagons-pattern_1017-26363.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    padding: '20px',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: darkMode ? 'rgba(18, 18, 18, 0.7)' : 'rgba(255, 255, 255, 0.9)',
      zIndex: -1
    }
  };

  if (loading) {
    console.log('Rendering loading state');
    return (
      <Box sx={backgroundStyle}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (error) {
    console.log('Rendering error state:', error);
    return (
      <Box sx={backgroundStyle}>
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  console.log('About to render record list. Records length:', records.length);

  if (records.length === 0) {
    console.log('Rendering empty records state');
    return (
      <Box sx={backgroundStyle}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: 'primary.main', 
                fontWeight: 'bold',
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Health Records
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Refresh Records">
                <IconButton
                  onClick={handleRefresh}
                  sx={{ 
                    transition: 'transform 0.3s', 
                    '&:hover': { transform: 'rotate(180deg)' } 
                  }}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View FAQs">
                <IconButton
                  onClick={() => navigate('/records/faq')}
                  sx={{ 
                    transition: 'transform 0.3s', 
                    '&:hover': { transform: 'scale(1.1)' } 
                  }}
                >
                  <HelpIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Update Profile Picture">
                <IconButton 
                  onClick={handleProfilePictureClick} 
                  sx={{ 
                    transition: 'transform 0.3s', 
                    '&:hover': { transform: 'scale(1.1)' } 
                  }}
                >
                  <Avatar 
                    src={currentProfile?.avatar || ''} 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      border: '2px solid #1976d2',
                      backgroundColor: currentProfile?.avatar ? 'transparent' : '#1976d2' 
                    }}
                  >
                    {!currentProfile?.avatar && currentProfile?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/')}
                startIcon={<HomeIcon />}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  borderRadius: 8,
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                  py: 1,
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                Home
              </Button>
            </Box>
          </Box>

          <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={800}>
            <Card 
              sx={{ 
                mb: 3, 
                borderRadius: 4, 
                overflow: 'hidden',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                border: '1px solid #e0f2fe',
                background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)'
              }}
            >
              <CardContent>
                <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                  <HealthAndSafetyIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                    Try Our Disease Prediction Assistant
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ mb: 3, color: '#37474f' }}>
                    Get AI-powered predictions based on your symptoms using our advanced health assistant.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={handleDiseasePrediction}
                    sx={{
                      borderRadius: 8,
                      py: 1.5,
                      px: 4,
                      boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                      background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-3px) scale(1.02)',
                        boxShadow: '0 6px 14px rgba(156, 39, 176, 0.4)'
                      }
                    }}
                  >
                    Launch Disease Prediction Assistant
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Slide>

          <Box display="flex" justifyContent="flex-start" mb={2}>
            <Zoom in={true} style={{ transitionDelay: '400ms' }}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/records/new')}
                startIcon={<AddIcon />}
                sx={{ 
                  mb: 2,
                  borderRadius: 8,
                  boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)'
                  }
                }}
              >
                Add New Record
              </Button>
            </Zoom>
          </Box>

          <Fade in={true} timeout={1000}>
            <Alert 
              severity="info" 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                backgroundColor: darkMode ? 'rgba(30, 42, 56, 0.8)' : 'rgba(227, 242, 253, 0.8)', 
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: `1px solid ${darkMode ? '#2c3e50' : '#bbdefb'}`,
                '& .MuiAlert-icon': { color: darkMode ? '#90caf9' : '#1976d2' },
                '& .MuiAlert-message': { color: 'text.primary' }
              }}
            >
              <Typography variant="h6" color="primary.main" fontWeight="bold">No Health Records Yet</Typography>
              <Typography variant="body1" color="text.primary">
                You don't have any health records yet. Click 'Add New Record' to create one.
              </Typography>
            </Alert>
          </Fade>
        </motion.div>

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileInputChange}
        />

        <Dialog open={openProfileDialog} onClose={handleProfileDialogClose}>
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
                sx={{ width: 100, height: 100, mb: 2 }}
              >
                {!currentProfile?.avatar && currentProfile?.name?.charAt(0)}
              </Avatar>
              <Button
                variant="contained"
                startIcon={<PhotoCameraIcon />}
                onClick={handleUploadClick}
              >
                Upload Photo
              </Button>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleProfileDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }

  console.log('Rendering records list with data');
  return (
    <Box sx={backgroundStyle}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              color: 'primary.main', 
              fontWeight: 'bold',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
            }}
          >
            Health Records
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Tooltip title="Refresh Records">
              <IconButton
                onClick={handleRefresh}
                sx={{ 
                  transition: 'transform 0.3s', 
                  '&:hover': { transform: 'rotate(180deg)' } 
                }}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="View FAQs">
              <IconButton
                onClick={() => navigate('/records/faq')}
                sx={{ 
                  transition: 'transform 0.3s', 
                  '&:hover': { transform: 'scale(1.1)' } 
                }}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Update Profile Picture">
              <IconButton 
                onClick={handleProfilePictureClick} 
                sx={{ 
                  transition: 'transform 0.3s', 
                  '&:hover': { transform: 'scale(1.1)' } 
                }}
              >
                <Avatar 
                  src={currentProfile?.avatar || ''} 
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    border: '2px solid #1976d2',
                    backgroundColor: currentProfile?.avatar ? 'transparent' : '#1976d2' 
                  }}
                >
                  {!currentProfile?.avatar && currentProfile?.name?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              startIcon={<HomeIcon />}
              sx={{
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 8,
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                py: 1,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Home
            </Button>
          </Box>
        </Box>

        <Slide direction="up" in={true} mountOnEnter unmountOnExit timeout={800}>
          <Card 
            sx={{ 
              mb: 3, 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '1px solid #e0f2fe',
              background: 'linear-gradient(135deg, #bbdefb 0%, #e3f2fd 100%)'
            }}
          >
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" p={2}>
                <HealthAndSafetyIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                  Try Our Disease Prediction Assistant
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 3, color: '#37474f' }}>
                  Get AI-powered predictions based on your symptoms using our advanced health assistant.
                </Typography>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleDiseasePrediction}
                  sx={{
                    borderRadius: 8,
                    py: 1.5,
                    px: 4,
                    boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                    background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
                    color: '#ffffff',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-3px) scale(1.02)',
                      boxShadow: '0 6px 14px rgba(156, 39, 176, 0.4)'
                    }
                  }}
                >
                  Launch Disease Prediction Assistant
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Slide>

        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Zoom in={true} style={{ transitionDelay: '400ms' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => navigate('/records/new')}
              startIcon={<AddIcon />}
              sx={{ 
                mb: 2,
                borderRadius: 8,
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(25, 118, 210, 0.4)'
                }
              }}
            >
              Add New Record
            </Button>
          </Zoom>
        </Box>

        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)', 
            borderRadius: 4, 
            overflow: 'hidden',
            background: darkMode ? 'rgba(30, 30, 30, 0.9)' : 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <style>
            {`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
              .animate-row {
                animation: fadeInUp 0.5s ease forwards;
                opacity: 0;
              }
            `}
          </style>
          <Table>
            <TableHead sx={{ backgroundColor: darkMode ? '#1e3a5f' : '#1976d2' }}>
              <TableRow>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Type</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Doctor</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record, index) => (
                <TableRow 
                  key={record.id}
                  sx={{ 
                    backgroundColor: darkMode 
                      ? index % 2 === 0 ? 'rgba(40, 40, 40, 0.8)' : 'rgba(30, 30, 30, 0.8)'
                      : index % 2 === 0 ? 'rgba(245, 245, 245, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    '&:hover': { backgroundColor: darkMode ? '#2c3e50' : '#e3f2fd' },
                    transition: 'background-color 0.3s'
                  }}
                >
                  <TableCell>{new Date(
                    typeof record.date === 'string' 
                      ? parseInt(record.date) 
                      : Number(record.date) / 1000000
                  ).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</TableCell>
                  <TableCell>{record.record_type}</TableCell>
                  <TableCell>{record.doctor}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleViewRecord(record.id)}
                      sx={{ 
                        textTransform: 'none',
                        boxShadow: 'none',
                        borderRadius: 8,
                        '&:hover': { 
                          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                          transform: 'translateY(-2px)'
                        },
                        transition: 'transform 0.3s, box-shadow 0.3s'
                      }}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileInputChange}
      />

      <Dialog open={openProfileDialog} onClose={handleProfileDialogClose}>
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
              sx={{ width: 100, height: 100, mb: 2 }}
            >
              {!currentProfile?.avatar && currentProfile?.name?.charAt(0)}
            </Avatar>
            <Button
              variant="contained"
              startIcon={<PhotoCameraIcon />}
              onClick={handleUploadClick}
            >
              Upload Photo
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleProfileDialogClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Disease Prediction */}
      <Zoom in={true} style={{ transitionDelay: '800ms' }}>
        <Tooltip title="Try Disease Prediction Assistant" placement="left">
          <Fab
            color="secondary"
            aria-label="disease prediction"
            onClick={handleDiseasePrediction}
            sx={{
              position: 'fixed',
              bottom: 32,
              right: 32,
              zIndex: 1000,
              boxShadow: '0 4px 20px rgba(156, 39, 176, 0.4)',
              background: 'linear-gradient(45deg, #9c27b0 30%, #673ab7 90%)',
              '&:hover': {
                boxShadow: '0 6px 30px rgba(156, 39, 176, 0.6)',
              }
            }}
          >
            <HealthAndSafetyIcon />
          </Fab>
        </Tooltip>
      </Zoom>

      {/* Debug Button - visible only in development */}
      <Box position="fixed" bottom={32} left={32} zIndex={1000}>
        <Tooltip title="Debug localStorage Records" placement="right">
          <Fab
            color="default"
            size="medium"
            onClick={handleShowDebugInfo}
            sx={{
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              '&:hover': {
                boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
              }
            }}
          >
            <BugReportIcon />
          </Fab>
        </Tooltip>
      </Box>

      {/* Success message snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)' }}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Debug Dialog */}
      <Dialog
        open={openDebugDialog}
        onClose={() => setOpenDebugDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Debug Information</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle2" gutterBottom>
            LocalStorage Records Debug Info:
          </Typography>
          <TextField
            multiline
            fullWidth
            value={debugInfo}
            variant="outlined"
            InputProps={{
              readOnly: true,
              sx: { 
                fontFamily: 'monospace', 
                fontSize: '0.85rem',
                maxHeight: '400px',
                overflow: 'auto'
              }
            }}
            rows={20}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDebugDialog(false)} color="primary">
            Close
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem('health_records');
              localStorage.removeItem('record_saved_success');
              localStorage.removeItem('last_saved_record');
              alert('localStorage cleared. Refresh the page to see changes.');
            }} 
            color="error"
          >
            Clear localStorage
          </Button>
          <Button 
            onClick={() => {
              // Create a test record
              const testRecord = {
                id: 'test-' + Date.now(),
                date: Date.now().toString(),
                record_type: 'Debug Test Record',
                description: 'This is a test record created for debugging',
                doctor: 'Debug Doctor',
                patient: 'test-user'
              };
              
              // Add to localStorage
              const records = JSON.parse(localStorage.getItem('health_records') || '[]');
              records.push(testRecord);
              localStorage.setItem('health_records', JSON.stringify(records));
              
              // Update debug info
              handleShowDebugInfo();
              
              // Alert user
              alert('Test record added. Check debug info and refresh page.');
            }} 
            color="primary"
          >
            Add Test Record
          </Button>
          <Button 
            onClick={forceReloadFromLocalStorage} 
            color="primary"
          >
            Force Reload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RecordList; 