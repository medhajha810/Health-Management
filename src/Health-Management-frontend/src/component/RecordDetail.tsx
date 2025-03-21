import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  DialogContentText,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Chip
} from '@mui/material';
import { useAuth } from '../App';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import SyncIcon from '@mui/icons-material/Sync';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AttachmentIcon from '@mui/icons-material/Attachment';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PersonIcon from '@mui/icons-material/Person';
import ShareIcon from '@mui/icons-material/Share';
import { formatDate } from '../utils/formatDate';
import { useTheme } from './ThemeContext';

interface HealthRecord {
  id: string;
  date: string | bigint;
  record_type: string;
  description: string;
  doctor: string;
  patient: any;
  attachments?: FileAttachment[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
}

interface AbhaRecord {
  id: string;
  date: string;
  facility: string;
  recordType: string;
  description: string;
  doctorName: string;
}

const RecordDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [record, setRecord] = useState<HealthRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [editedRecord, setEditedRecord] = useState<{
    record_type: string;
    description: string;
    doctor: string;
  }>({
    record_type: '',
    description: '',
    doctor: ''
  });
  const [syncWithAbha, setSyncWithAbha] = useState(false);
  const [abhaRecords, setAbhaRecords] = useState<AbhaRecord[]>([]);
  const [abhaLinked, setAbhaLinked] = useState(false);
  const [syncingAbha, setSyncingAbha] = useState(false);
  const { darkMode } = useTheme();

  // Add debugging function
  const debugStorageIssues = () => {
    try {
      console.log('RecordDetail: Debug Storage - Current ID:', id);
      
      // Check sessionStorage
      const keys = Object.keys(sessionStorage);
      console.log('RecordDetail: All sessionStorage keys:', keys);
      
      const currentRecordRaw = sessionStorage.getItem('currentRecord');
      console.log('RecordDetail: Raw currentRecord in sessionStorage:', currentRecordRaw);
      
      if (currentRecordRaw) {
        try {
          const parsedRecord = JSON.parse(currentRecordRaw);
          console.log('RecordDetail: Parsed record:', parsedRecord);
          
          // Verify if parsed record has all required fields
          if (!parsedRecord.id || !parsedRecord.date || !parsedRecord.record_type || !parsedRecord.doctor) {
            console.error('RecordDetail: Parsed record is missing required fields');
          }
        } catch (e) {
          console.error('RecordDetail: Failed to parse record from sessionStorage:', e);
        }
      }
      
      // Check localStorage
      const localRecords = localStorage.getItem('health_records');
      if (localRecords) {
        try {
          const parsedRecords = JSON.parse(localRecords);
          console.log(`RecordDetail: Found ${parsedRecords.length} records in localStorage`);
          
          if (id) {
            const matchingRecord = parsedRecords.find((r: any) => r.id === id);
            console.log('RecordDetail: Matching record in localStorage:', matchingRecord);
          }
        } catch (e) {
          console.error('RecordDetail: Failed to parse records from localStorage:', e);
        }
      } else {
        console.log('RecordDetail: No health_records found in localStorage');
      }
    } catch (e) {
      console.error('RecordDetail: Error in debugStorageIssues:', e);
    }
  };
   
  useEffect(() => {
    console.log('RecordDetail: useEffect triggered with ID:', id);
    debugStorageIssues();
    fetchRecord();
  }, [id]);

  // Move actor dependency to a separate useEffect to avoid re-fetching when actor changes
  useEffect(() => {
    if (actor && !record) {
      console.log('RecordDetail: Actor changed and no record found, fetching again');
      fetchRecord();
    }
  }, [actor]);

  useEffect(() => {
    // Check if the user profile has a linked ABHA ID
    const checkAbhaLink = async () => {
      try {
        // This would be a real API call to check the user's profile
        // For now, we'll use the user context data from localStorage
        const currentProfileId = localStorage.getItem('currentProfileId');
        const userProfiles = localStorage.getItem('userProfiles');
        
        if (currentProfileId && userProfiles) {
          const parsedProfiles = JSON.parse(userProfiles);
          const profile = parsedProfiles.find((p: any) => p.id === currentProfileId);
          
          if (profile && profile.abhaId && profile.abhaCardLinked) {
            setAbhaLinked(true);
          }
        }
      } catch (error) {
        console.error('Error checking ABHA link:', error);
      }
    };
    
    checkAbhaLink();
  }, []);

  const fetchRecord = async () => {
    console.log('RecordDetail: fetchRecord called with ID:', id);
    try {
      setLoading(true);
      
      if (!id) {
        setError('Record ID is missing');
        setLoading(false);
        return;
      }
      
      // First, check if we have the record in sessionStorage
      console.log('RecordDetail: Checking sessionStorage for record');
      const sessionRecord = sessionStorage.getItem('currentRecord');
      console.log('RecordDetail: Raw record from sessionStorage:', sessionRecord);
      
      if (sessionRecord) {
        try {
          const parsedRecord = JSON.parse(sessionRecord);
          console.log('RecordDetail: Parsed record from sessionStorage:', parsedRecord);
          
          if (parsedRecord && parsedRecord.id === id) {
            console.log('RecordDetail: Found matching record in sessionStorage, using it');
            setRecord(parsedRecord);
            setEditedRecord({
              record_type: parsedRecord.record_type || '',
              description: parsedRecord.description || '',
              doctor: parsedRecord.doctor || ''
            });
            
            // Load attachments if any
            loadAttachments(id);
            setLoading(false);
            return;
          } else {
            console.log('RecordDetail: Session record ID does not match requested ID');
            if (parsedRecord) {
              console.log('RecordDetail: Session record ID:', parsedRecord.id, 'Requested ID:', id);
            }
          }
        } catch (e) {
          console.error('RecordDetail: Error parsing session record:', e);
        }
      } else {
        console.log('RecordDetail: No record found in sessionStorage');
      }
      
      // Try to get from local storage if not found in session
      console.log('RecordDetail: Checking localStorage for record');
      const localRecords = localStorage.getItem('health_records');
      console.log('RecordDetail: health_records exists in localStorage:', localRecords ? 'Yes' : 'No');
      
      if (localRecords) {
        try {
          const parsedRecords = JSON.parse(localRecords);
          console.log('RecordDetail: Parsed records from localStorage, count:', Array.isArray(parsedRecords) ? parsedRecords.length : 'Not an array');
          
          if (!Array.isArray(parsedRecords)) {
            console.error('RecordDetail: health_records is not an array:', typeof parsedRecords);
            throw new Error('Invalid format for health_records in localStorage');
          }
          
          // For debugging, show all record IDs
          if (parsedRecords.length > 0) {
            console.log('RecordDetail: All record IDs in localStorage:', parsedRecords.map((r: any) => r.id));
          }
          
          const foundRecord = parsedRecords.find((r: any) => r.id === id);
          console.log('RecordDetail: Found record in localStorage:', foundRecord ? 'Yes' : 'No');
          
          if (foundRecord) {
            console.log('RecordDetail: Using record from localStorage');
            // Add field validation to ensure we have all required fields
            if (!foundRecord.id || !foundRecord.record_type || !foundRecord.doctor) {
              console.error('RecordDetail: Record from localStorage is missing required fields:', foundRecord);
              setError('The record is missing required fields');
              setLoading(false);
              return;
            }
            
            setRecord(foundRecord);
            setEditedRecord({
              record_type: foundRecord.record_type,
              description: foundRecord.description || '',
              doctor: foundRecord.doctor
            });
            
            // Update sessionStorage with this record for future use
            sessionStorage.setItem('currentRecord', JSON.stringify(foundRecord));
            
            // Load attachments if any
            loadAttachments(id);
            setLoading(false);
            return;
          } else {
            console.log('RecordDetail: No matching record found in localStorage with ID:', id);
          }
        } catch (e) {
          console.error('RecordDetail: Error parsing local records:', e);
        }
      } else {
        console.log('RecordDetail: No records found in localStorage');
      }
      
      // If not found locally, try to fetch from backend
      if (actor) {
        console.log('RecordDetail: Attempting to fetch from backend');
        let retryCount = 0;
        const maxRetries = 2;
        
        while (retryCount <= maxRetries) {
          try {
            if (retryCount > 0) {
              console.log(`RecordDetail: Retry attempt ${retryCount} of ${maxRetries}`);
            }
            
            const result = await actor.get_record(id);
            console.log('RecordDetail: Backend response:', result);
            
            if (!result || !Array.isArray(result) || result.length === 0) {
              console.log('RecordDetail: Backend returned empty result');
              if (retryCount < maxRetries) {
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
                continue;
              }
              setError(`Record with ID ${id} was not found in the backend`);
              setLoading(false);
              return;
            }
            
            const recordData = result[0];
            console.log('RecordDetail: Found record in backend:', recordData);
            
            // Validate backend record data
            if (!recordData.id || !recordData.record_type || !recordData.doctor) {
              console.error('RecordDetail: Record from backend is missing required fields:', recordData);
              setError('The record from the backend is missing required fields');
              setLoading(false);
              return;
            }
            
            setRecord(recordData);
            setEditedRecord({
              record_type: recordData.record_type,
              description: recordData.description || '',
              doctor: recordData.doctor
            });
            
            // Update sessionStorage with this record for future use
            sessionStorage.setItem('currentRecord', JSON.stringify(recordData));
            
            // Also update localStorage for offline access
            try {
              const localRecords = JSON.parse(localStorage.getItem('health_records') || '[]');
              if (!localRecords.some((r: any) => r.id === id)) {
                localRecords.push(recordData);
                localStorage.setItem('health_records', JSON.stringify(localRecords));
                console.log('RecordDetail: Added record to localStorage for future offline access');
              }
            } catch (storageError) {
              console.error('RecordDetail: Error updating localStorage:', storageError);
            }
            
            // Load attachments if any
            loadAttachments(id);
            setLoading(false);
            return;
          } catch (error) {
            console.error(`RecordDetail: Error fetching from backend (attempt ${retryCount+1}):`, error);
            // Only increment retry if error is potentially recoverable
            if (error instanceof Error && 
               (error.message.includes('network') || 
                error.message.includes('timeout') || 
                error.message.includes('connection'))) {
              retryCount++;
              if (retryCount <= maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                continue;
              }
            } else {
              // Non-recoverable error, break out of retry loop
              break;
            }
          }
        }
        
        // If we got here, all retries failed
        console.error('RecordDetail: All backend fetch attempts failed');
        setError('Failed to fetch record from backend. Please check your connection.');
      } else {
        console.log('RecordDetail: Backend not available to fetch record');
        setError(`No active backend connection available. Record with ID ${id} not found locally.`);
      }
    } catch (error) {
      setError('Failed to load record. Please try again later.');
      console.error('RecordDetail: Error in fetchRecord:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAttachments = (recordId: string) => {
    try {
      const storedAttachments = localStorage.getItem(`attachments-${recordId}`);
      if (storedAttachments) {
        setAttachments(JSON.parse(storedAttachments));
      }
    } catch (error) {
      console.error('Error loading attachments:', error);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      if (!record || !id) {
        throw new Error('Record not found');
      }
      
      // Try to delete from backend first
      let deletedFromBackend = false;
      if (actor) {
        try {
          deletedFromBackend = await actor.delete_record(id);
          console.log('Record deleted from backend:', deletedFromBackend);
        } catch (error) {
          console.error('Error deleting from backend:', error);
        }
      }
      
      // Always try to delete from local storage as well
      try {
        // Get existing records
        const localRecords = JSON.parse(localStorage.getItem('health_records') || '[]');
        
        // Remove record with matching ID
        const updatedRecords = localRecords.filter((r: any) => r.id !== id);
        
        // Save updated records
        localStorage.setItem('health_records', JSON.stringify(updatedRecords));
        
        // Remove attachments
        localStorage.removeItem(`attachments-${id}`);
        
        console.log('Record removed from local storage');
      } catch (error) {
        console.error('Error removing from local storage:', error);
      }
      
      // Set success message
      localStorage.setItem('record_deleted_success', 'true');
      localStorage.setItem('deleted_record_type', record.record_type);
      
      navigate('/records');
    } catch (error) {
      setError('Failed to delete record');
      console.error('Error deleting record:', error);
    } finally {
      setLoading(false);
      setConfirmDelete(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      
      if (!record || !id) {
        throw new Error('Record not found');
      }
      
      // Create updated record object
      const updatedRecord = {
        ...record,
        record_type: editedRecord.record_type,
        description: editedRecord.description,
        doctor: editedRecord.doctor
      };
      
      // Try to update in backend first
      let updatedInBackend = false;
      if (actor) {
        try {
          updatedInBackend = await actor.update_record(
            id,
            editedRecord.record_type,
            editedRecord.description,
            editedRecord.doctor
          );
          console.log('Record updated in backend:', updatedInBackend);
        } catch (error) {
          console.error('Error updating in backend:', error);
        }
      }
      
      // Always update in local storage
      try {
        // Get existing records
        const localRecords = JSON.parse(localStorage.getItem('health_records') || '[]');
        
        // Replace record with matching ID
        const updatedRecords = localRecords.map((r: any) => 
          r.id === id ? updatedRecord : r
        );
        
        // Save updated records
        localStorage.setItem('health_records', JSON.stringify(updatedRecords));
        
        // Update session storage too
        sessionStorage.setItem('currentRecord', JSON.stringify(updatedRecord));
        
        console.log('Record updated in local storage');
      } catch (error) {
        console.error('Error updating in local storage:', error);
      }
      
      // Update state
      setRecord(updatedRecord);
      setIsEditing(false);
      
      // Set success message
      localStorage.setItem('record_updated_success', 'true');
    } catch (error) {
      setError('Failed to update record');
      console.error('Error updating record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddAttachment = () => {
    if (!selectedFile || !id) return;
    
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (e.target && e.target.result) {
        const newAttachment: FileAttachment = {
          id: Date.now().toString(),
          name: selectedFile.name,
          type: selectedFile.type,
          url: e.target.result as string,
        };
        
        // Create thumbnail for images
        if (selectedFile.type.startsWith('image/')) {
          newAttachment.thumbnailUrl = e.target.result as string;
        }
        
        const updatedAttachments = [...attachments, newAttachment];
        setAttachments(updatedAttachments);
        
        // Save to localStorage (temporary solution until backend support)
        localStorage.setItem(`attachments-${id}`, JSON.stringify(updatedAttachments));
        
        setSelectedFile(null);
        setShowAttachmentDialog(false);
      }
    };
    fileReader.readAsDataURL(selectedFile);
  };

  const handleDeleteAttachment = (attachmentId: string) => {
    if (!id) return;
    
    const updatedAttachments = attachments.filter(attachment => attachment.id !== attachmentId);
    setAttachments(updatedAttachments);
    
    // Update localStorage
    localStorage.setItem(`attachments-${id}`, JSON.stringify(updatedAttachments));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <InsertPhotoIcon fontSize="large" />;
    } else {
      return <DescriptionIcon fontSize="large" />;
    }
  };

  const handleSyncWithAbha = async () => {
    setSyncingAbha(true);
    
    try {
      // Check if we have ABHA details stored
      const abhaUserDetailsStr = sessionStorage.getItem('abha_user_details');
      const abhaToken = sessionStorage.getItem('abha_token');
      
      // This would be a real API call to the ABHA system
      // For demo purposes, we'll simulate fetching records after a delay
      setTimeout(() => {
        // Demo ABHA records - in a real app, these would come from the ABHA API
        const demoRecords: AbhaRecord[] = [
          {
            id: 'abha-1',
            date: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
            facility: 'Apollo Hospitals',
            recordType: 'Lab Report',
            description: 'Complete Blood Count (CBC)',
            doctorName: 'Dr. Sharma'
          },
          {
            id: 'abha-2',
            date: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
            facility: 'AIIMS Delhi',
            recordType: 'Imaging',
            description: 'Chest X-Ray',
            doctorName: 'Dr. Gupta'
          },
          {
            id: 'abha-3',
            date: new Date(Date.now() - 864000000).toISOString(), // 10 days ago
            facility: 'Max Healthcare',
            recordType: 'Prescription',
            description: 'Medication for hypertension',
            doctorName: 'Dr. Patel'
          }
        ];
        
        // If we have ABHA details, add more personalized records
        if (abhaUserDetailsStr && abhaToken) {
          const abhaUserDetails = JSON.parse(abhaUserDetailsStr);
          
          // Add records based on the medical conditions from ABHA
          if (abhaUserDetails.conditions && abhaUserDetails.conditions.includes("Hypertension")) {
            demoRecords.push({
              id: 'abha-4',
              date: new Date(Date.now() - 1209600000).toISOString(), // 14 days ago
              facility: 'Heart Care Clinic',
              recordType: 'Vital Signs',
              description: 'Blood Pressure Monitoring',
              doctorName: 'Dr. Sharma'
            });
          }
          
          // Add records based on allergies from ABHA
          if (abhaUserDetails.allergies && abhaUserDetails.allergies.includes("Penicillin")) {
            demoRecords.push({
              id: 'abha-5',
              date: new Date(Date.now() - 15552000000).toISOString(), // 180 days ago
              facility: 'City General Hospital',
              recordType: 'Allergy Test',
              description: 'Comprehensive Allergy Panel',
              doctorName: 'Dr. Khan'
            });
          }
        }
        
        setAbhaRecords(demoRecords);
        setSyncWithAbha(true);
        setSyncingAbha(false);
        
        // Show success message
        alert("Successfully synced with ABHA system. Found " + demoRecords.length + " records.");
      }, 2000);
    } catch (error) {
      console.error('Error syncing with ABHA:', error);
      setSyncingAbha(false);
      alert("Failed to sync with ABHA system. Please try again later.");
    }
  };
  
  const handleImportAbhaRecord = (abhaRecord: AbhaRecord) => {
    // This would actually import the record via API
    // For demo, we'll just show an alert
    alert(`Record "${abhaRecord.description}" would be imported from ABHA system`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/records')}
          >
            Back to Records
          </Button>
        </Box>
      </Container>
    );
  }

  if (!record) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mt: 2 }}>
          Record not found
        </Alert>
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/records')}
          >
            Back to Records
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ 
        p: 3, 
        mt: 2,
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 20px rgba(0,0,0,0.15)'
        }
      }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main'
          }}>
            Record Details
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{
                mr: 1,
                textTransform: 'none',
                fontWeight: 'bold',
                borderRadius: 2,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                py: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.25)'
                }
              }}
            >
              <HomeIcon sx={{ mr: 1 }} /> Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ 
                mr: 1,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }
              }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmDelete(true)}
              sx={{ 
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                }
              }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Date:</strong> {formatDate(record.date)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Type
            </Typography>
            <Typography variant="body1">
              {record.record_type}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Doctor
            </Typography>
            <Typography variant="body1">
              {record.doctor}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">
              {record.description}
            </Typography>
          </Grid>
        </Grid>

        {/* After the record details section and before attachments */}
        {abhaLinked && (
          <Box mt={4}>
            <Divider sx={{ mb: 3 }} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Box display="flex" alignItems="center">
                <HealthAndSafetyIcon sx={{ color: '#4caf50', mr: 1 }} />
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  ABHA Health Records
                </Typography>
              </Box>
              
              <Button
                variant="outlined"
                color="primary"
                startIcon={<SyncIcon />}
                onClick={handleSyncWithAbha}
                disabled={syncingAbha}
                sx={{
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                  }
                }}
              >
                {syncingAbha ? 'Syncing...' : 'Sync with ABHA'}
              </Button>
            </Box>
            
            {syncWithAbha ? (
              abhaRecords.length > 0 ? (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {abhaRecords.map((record) => (
                    <Grid item xs={12} key={record.id}>
                      <Card 
                        sx={{ 
                          p: 2, 
                          borderRadius: 2,
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'translateY(-3px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.12)'
                          }
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Box display="flex" alignItems="center" mb={1}>
                              <Typography variant="h6" fontWeight="medium">
                                {record.description}
                              </Typography>
                              <Chip 
                                label={record.recordType} 
                                size="small" 
                                color="primary" 
                                sx={{ ml: 1 }}
                              />
                            </Box>
                            
                            <Typography variant="body2" color="text.secondary">
                              Facility: {record.facility}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Doctor: {record.doctorName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Date: {new Date(record.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleImportAbhaRecord(record)}
                            sx={{ 
                              borderRadius: 2,
                              textTransform: 'none'
                            }}
                          >
                            Import Record
                          </Button>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Alert severity="info" sx={{ mb: 3 }}>
                  No records found in the ABHA system for this health record category.
                </Alert>
              )
            ) : (
              <Alert severity="info" sx={{ mb: 3 }}>
                Sync with ABHA to view and import your health records from the national digital health ecosystem.
              </Alert>
            )}
          </Box>
        )}

        {/* Attachments Section */}
        <Box mt={4} sx={{ 
          backgroundColor: darkMode ? '#1e2830' : '#f5f5f5', 
          p: 3, 
          borderRadius: 2 
        }}>
          <Divider sx={{ mb: 2 }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6" sx={{ color: '#1976d2', display: 'flex', alignItems: 'center' }}>
              <AttachFileIcon sx={{ mr: 1 }} /> Attachments
            </Typography>
            <Button
              variant="contained"
              startIcon={<AttachFileIcon />}
              onClick={() => setShowAttachmentDialog(true)}
              sx={{ 
                backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Add Attachment
            </Button>
          </Box>
          
          {attachments.length === 0 ? (
            <Box 
              sx={{ 
                border: '2px dashed',
                borderColor: darkMode ? '#455a64' : '#e0e0e0',
                borderRadius: 2,
                p: 4, 
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: '100px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: darkMode ? 'rgba(33, 150, 243, 0.15)' : '#ffffff',
                transition: 'all 0.3s ease'
              }}
            >
              <AttachFileIcon sx={{ fontSize: 40, color: '#9e9e9e', mb: 1 }} />
              <Typography color="text.secondary">
                No attachments for this record. Click "Add Attachment" to upload files.
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {attachments.map((attachment) => (
                <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                  <Card sx={{ 
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                    }
                  }}>
                    <CardActionArea 
                      onClick={() => attachment.type.startsWith('image/') && setSelectedImage(attachment.url)}
                    >
                      {attachment.thumbnailUrl ? (
                        <CardMedia
                          component="img"
                          height="140"
                          image={attachment.thumbnailUrl}
                          alt={attachment.name}
                        />
                      ) : (
                        <Box 
                          display="flex" 
                          justifyContent="center" 
                          alignItems="center" 
                          sx={{ height: 140, bgcolor: '#e8f4fd' }}
                        >
                          {getFileIcon(attachment.type)}
                        </Box>
                      )}
                    </CardActionArea>
                    <CardContent sx={{ py: 1, position: 'relative' }}>
                      <Typography variant="body2" noWrap title={attachment.name}>
                        {attachment.name}
                      </Typography>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDeleteAttachment(attachment.id)}
                        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onClose={() => setIsEditing(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Health Record</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Type"
            name="record_type"
            value={editedRecord.record_type}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Doctor"
            name="doctor"
            value={editedRecord.doctor}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            name="description"
            multiline
            rows={4}
            value={editedRecord.description}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary" variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this record? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Attachment Dialog */}
      <Dialog 
        open={showAttachmentDialog} 
        onClose={() => setShowAttachmentDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          elevation: 8,
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontSize: '1.2rem' }}>
          <Box display="flex" alignItems="center">
            <AttachFileIcon sx={{ mr: 1 }} />
            Add Attachment
          </Box>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Box textAlign="center" mb={2}>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Upload documents, images, or other files related to this health record
            </Typography>
          </Box>
          {selectedFile && selectedFile.type.startsWith('image/') && (
            <Box 
              sx={{ 
                mb: 2, 
                textAlign: 'center',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                p: 1
              }}
            >
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#1976d2' }}>
                Preview
              </Typography>
              <img 
                src={URL.createObjectURL(selectedFile)} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%',
                  maxHeight: '200px',
                  objectFit: 'contain'
                }} 
              />
            </Box>
          )}
          <Box 
            sx={{
              border: '2px dashed',
              borderColor: selectedFile ? '#2196f3' : darkMode ? '#455a64' : '#e0e0e0',
              borderRadius: 2,
              p: 2,
              textAlign: 'center',
              cursor: 'pointer',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedFile 
                ? darkMode ? 'rgba(33, 150, 243, 0.15)' : '#e8f4fd' 
                : darkMode ? '#1e2830' : '#ffffff',
              transition: 'all 0.3s ease'
            }}
          >
            <input
              type="file"
              hidden
              accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
            />
            <AttachFileIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            {selectedFile ? (
              <Typography variant="body1">{selectedFile.name}</Typography>
            ) : (
              <Typography variant="body1" align="center">
                Drag & drop a file here, or click to select
                <Typography variant="body2" color="text.secondary" mt={1}>
                  (Images, PDFs, Word documents)
                </Typography>
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setShowAttachmentDialog(false)}
            sx={{ textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddAttachment} 
            color="primary" 
            variant="contained"
            disabled={!selectedFile}
            sx={{ 
              textTransform: 'none',
              px: 3
            }}
          >
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      {/* Image Viewer Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="lg"
      >
        <DialogContent sx={{ p: 0 }}>
          {selectedImage && (
            <img 
              src={selectedImage} 
              alt="Attachment Preview" 
              style={{ width: '100%', display: 'block' }} 
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecordDetail; 