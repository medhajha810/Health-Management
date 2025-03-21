import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useAuth } from '../App';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';
import HomeIcon from '@mui/icons-material/Home';
import { useTheme } from './ThemeContext';

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  thumbnailUrl?: string;
  file: File;
}

const NewRecord: React.FC = () => {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [record, setRecord] = useState({
    record_type: '',
    description: '',
    doctor: ''
  });
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [debugDialogOpen, setDebugDialogOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState('');
  const { darkMode } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!record.record_type || !record.description || !record.doctor) {
        throw new Error('Please fill out all fields');
      }

      // Create a new record with current timestamp as ID
      const recordId = Date.now().toString();
      const newRecord = {
        id: recordId,
        date: Date.now().toString(), // Use string representation of timestamp
        record_type: record.record_type,
        description: record.description,
        doctor: record.doctor,
        patient: 'local-user'
      };
      
      console.log('Created new record object:', newRecord);
      
      // Try to save to backend first
      let backendSuccess = false;
      if (actor) {
        try {
          console.log('Attempting to save to backend');
          backendSuccess = await saveToBackend(record.record_type, record.description, record.doctor);
          console.log('Backend save result:', backendSuccess);
        } catch (error) {
          console.error('Error in backend save:', error);
        }
      } else {
        console.log('No actor available, skipping backend save');
      }
      
      // If backend save failed or actor not available, save to localStorage
      if (!backendSuccess) {
        console.log('Saving to localStorage instead');
        saveToLocalStorage(newRecord);
      }

      // Save attachments if any
      if (attachments.length > 0) {
        console.log('Saving attachments');
        const attachmentsToSave = attachments.map(({ id, name, type, url, thumbnailUrl }) => 
          ({ id, name, type, url, thumbnailUrl })
        );
        localStorage.setItem(`attachments-${newRecord.id}`, JSON.stringify(attachmentsToSave));
      }

      // Set success message flags
      localStorage.setItem('record_saved_success', 'true');
      localStorage.setItem('last_saved_record', JSON.stringify(newRecord));
      
      console.log('Record saved successfully, preparing to navigate');
      
      // Add a small delay to ensure localStorage is updated before navigation
      setTimeout(() => {
        console.log('Navigating to records list');
        navigate('/records');
      }, 300);
    } catch (error: any) {
      setError(error.message || 'Failed to create record');
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  // Try to save to backend, return true if successful
  const saveToBackend = async (recordType: string, description: string, doctor: string) => {
    if (!actor) return false;
    
    try {
      const result = await actor.create_record(recordType, description, doctor);
      console.log('Record saved to backend:', result);
      return true;
    } catch (error) {
      console.error('Error saving to backend:', error);
      return false;
    }
  };

  // Save record to localStorage
  const saveToLocalStorage = (record: any) => {
    try {
      // Log the record being saved
      console.log('Saving record to localStorage:', record);
      
      // Ensure record has all required fields
      if (!record.id || !record.date || !record.record_type || !record.doctor) {
        console.error('Record is missing required fields', record);
        throw new Error('Record is missing required fields');
      }
      
      // Get existing records
      const existingRecordsString = localStorage.getItem('health_records');
      console.log('Existing records string from localStorage:', existingRecordsString);
      
      // Parse existing records (or initialize as empty array if null or invalid JSON)
      let existingRecords = [];
      try {
        existingRecords = existingRecordsString ? JSON.parse(existingRecordsString) : [];
        // Verify it's an array
        if (!Array.isArray(existingRecords)) {
          console.error('Existing records is not an array, resetting to empty array');
          existingRecords = [];
        }
      } catch (e) {
        console.error('Error parsing existing records, resetting to empty array:', e);
        existingRecords = [];
      }
      
      console.log('Parsed existing records:', existingRecords);
      
      // Add new record
      existingRecords.push(record);
      
      // Save back to localStorage
      const recordsToSave = JSON.stringify(existingRecords);
      localStorage.setItem('health_records', recordsToSave);
      
      // Verify the save by reading it back
      const savedRecordsString = localStorage.getItem('health_records');
      console.log('Saved records after update:', savedRecordsString);
      
      // Verify it's valid JSON
      try {
        const parsedSavedRecords = JSON.parse(savedRecordsString || '[]');
        console.log('Parsed saved records:', parsedSavedRecords);
        console.log('Number of records after save:', parsedSavedRecords.length);
      } catch (e) {
        console.error('Error parsing saved records:', e);
      }
      
      console.log('Record successfully saved to localStorage');
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      alert('Failed to save record to localStorage. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        const fileReader = new FileReader();
        fileReader.onload = (event) => {
          if (event.target && event.target.result) {
            const newAttachment: FileAttachment = {
              id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
              name: file.name,
              type: file.type,
              url: event.target.result as string,
              file: file
            };
            
            // Create thumbnail for images
            if (file.type.startsWith('image/')) {
              newAttachment.thumbnailUrl = event.target.result as string;
            }
            
            setAttachments(prev => [...prev, newAttachment]);
          }
        };
        fileReader.readAsDataURL(file);
      });
    }
    
    // Clear the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(attachment => attachment.id !== id));
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <InsertPhotoIcon fontSize="large" />;
    } else {
      return <DescriptionIcon fontSize="large" />;
    }
  };

  // Debug function to check localStorage state
  const debugLocalStorage = () => {
    try {
      const healthRecords = localStorage.getItem('health_records');
      const parsedRecords = healthRecords ? JSON.parse(healthRecords) : [];
      
      const debugData = {
        recordsInLocalStorage: parsedRecords,
        currentFormData: record,
        localStorage: {
          health_records: healthRecords,
          record_saved_success: localStorage.getItem('record_saved_success'),
          last_saved_record: localStorage.getItem('last_saved_record')
        }
      };
      
      setDebugInfo(JSON.stringify(debugData, null, 2));
      setDebugDialogOpen(true);
    } catch (error) {
      console.error('Error generating debug info:', error);
      setDebugInfo('Error generating debug info: ' + error);
      setDebugDialogOpen(true);
    }
  };

  // Add test record directly to localStorage (for debugging)
  const addTestRecord = () => {
    try {
      // Create a test record
      const testRecord = {
        id: 'test-' + Date.now(),
        date: Date.now().toString(),
        record_type: 'Test Record',
        description: 'This is a test record created for debugging',
        doctor: 'Test Doctor',
        patient: 'test-user'
      };
      
      // Save to localStorage
      saveToLocalStorage(testRecord);
      
      // Set success message
      localStorage.setItem('record_saved_success', 'true');
      localStorage.setItem('last_saved_record', JSON.stringify(testRecord));
      
      alert('Test record added successfully. You can navigate to Records to view it.');
    } catch (error) {
      console.error('Error adding test record:', error);
      alert('Error adding test record: ' + error);
    }
  };

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
          <Typography variant="h4" component="h1" gutterBottom sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main'
          }}>
            Add New Health Record
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{
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
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} id="record-form">
          <TextField
            fullWidth
            margin="normal"
            required
            label="Record Type"
            name="record_type"
            value={record.record_type}
            onChange={handleChange}
            placeholder="E.g. Vaccination, Check-up, Test Results"
          />

          <TextField
            fullWidth
            margin="normal"
            required
            label="Doctor"
            name="doctor"
            value={record.doctor}
            onChange={handleChange}
            placeholder="Doctor's name"
          />

          <TextField
            fullWidth
            margin="normal"
            required
            label="Description"
            name="description"
            multiline
            rows={4}
            value={record.description}
            onChange={handleChange}
            placeholder="Detailed description of the health record"
          />

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
                component="label"
                startIcon={<AttachFileIcon />}
                sx={{
                  textTransform: 'none',
                  backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 4px 10px rgba(33, 150, 243, 0.3)',
                  color: '#ffffff',
                  py: 1,
                  px: 3
                }}
              >
                Add Files
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                />
              </Button>
            </Box>
            
            {attachments.length === 0 ? (
              <Box 
                sx={{ 
                  border: '2px dashed #bdbdbd', 
                  borderRadius: 2, 
                  p: 4, 
                  textAlign: 'center',
                  backgroundColor: '#ffffff'
                }}
              >
                <AttachFileIcon sx={{ fontSize: 40, color: '#9e9e9e', mb: 1 }} />
                <Typography color="text.secondary">
                  Drop files here or click "Add Files" to upload attachments
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2} mb={3}>
                {attachments.map((attachment) => (
                  <Grid item xs={12} sm={6} md={4} key={attachment.id}>
                    <Card sx={{ 
                      borderRadius: 4, 
                      overflow: 'hidden', 
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      backgroundColor: darkMode ? '#263238' : '#ffffff'
                    }}>
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
                      <CardContent sx={{ py: 1, position: 'relative' }}>
                        <Typography variant="body2" noWrap title={attachment.name}>
                          {attachment.name}
                        </Typography>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleRemoveAttachment(attachment.id)}
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

          <Box display="flex" justifyContent="space-between" mt={4} mb={2}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/records')}
            >
              Cancel
            </Button>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={debugLocalStorage}
                sx={{ mr: 2 }}
              >
                Debug
              </Button>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                form="record-form"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Save Record'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
      
      {/* Debug Dialog */}
      <Dialog
        open={debugDialogOpen}
        onClose={() => setDebugDialogOpen(false)}
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
          <Button onClick={() => setDebugDialogOpen(false)} color="primary">
            Close
          </Button>
          <Button 
            onClick={() => {
              localStorage.removeItem('health_records');
              alert('localStorage records cleared.');
              debugLocalStorage();
            }} 
            color="error"
          >
            Clear Records
          </Button>
          <Button 
            onClick={addTestRecord} 
            color="primary"
          >
            Add Test Record
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default NewRecord; 