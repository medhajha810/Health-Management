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

interface HealthRecord {
  id: string;
  date: bigint;
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

  useEffect(() => {
    fetchRecord();
  }, [id, actor]);

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
    try {
      if (!actor || !id) {
        setLoading(false);
        return;
      }
      const result = await actor.get_record(id);
      
      if (!result || !result[0]) {
        setError('Record not found');
        return;
      }
      
      const recordData = result[0];
      setRecord(recordData);
      setEditedRecord({
        record_type: recordData.record_type,
        description: recordData.description,
        doctor: recordData.doctor
      });
      
      // For now, we'll use localStorage to store attachments since we don't have backend support
      const savedAttachments = localStorage.getItem(`attachments-${id}`);
      if (savedAttachments) {
        setAttachments(JSON.parse(savedAttachments));
      }
    } catch (error) {
      setError('Failed to load record details');
      console.error('Error fetching record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (!actor || !id) return;
      const result = await actor.delete_record(id);
      
      if (result) {
        // Clear attachments from localStorage
        localStorage.removeItem(`attachments-${id}`);
        navigate('/records');
      } else {
        setError('Failed to delete record');
      }
    } catch (error) {
      setError('Failed to delete record');
      console.error('Error deleting record:', error);
    } finally {
      setConfirmDelete(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (!actor || !id) return;
      
      if (!editedRecord.record_type || !editedRecord.description || !editedRecord.doctor) {
        setError('Please fill out all fields');
        return;
      }
      
      const result = await actor.update_record(
        id,
        editedRecord.record_type,
        editedRecord.description,
        editedRecord.doctor
      );
      
      if (result) {
        setIsEditing(false);
        fetchRecord();
      } else {
        setError('Failed to update record');
      }
    } catch (error) {
      setError('Failed to update record');
      console.error('Error updating record:', error);
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
            <Typography variant="body1">
              {new Date(Number(record.date) / 1000000).toLocaleDateString()}
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
        <Box mt={4} sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2 }}>
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
                border: '2px dashed #bdbdbd', 
                borderRadius: 2, 
                p: 4, 
                textAlign: 'center',
                backgroundColor: '#ffffff'
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
            component="label" 
            sx={{ 
              border: '2px dashed #bdbdbd', 
              borderRadius: 2, 
              p: 4, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              my: 2,
              backgroundColor: selectedFile ? '#e8f4fd' : '#ffffff',
              transition: 'all 0.3s'
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