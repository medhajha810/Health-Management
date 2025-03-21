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
  CardActionArea
} from '@mui/material';
import { useAuth } from '../App';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';

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

  useEffect(() => {
    fetchRecord();
  }, [id, actor]);

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
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Record Details
          </Typography>
          <Box>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mr: 1 }}
            >
              Home
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setIsEditing(true)}
              sx={{ mr: 1 }}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setConfirmDelete(true)}
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