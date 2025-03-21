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
  CardMedia
} from '@mui/material';
import { useAuth } from '../App';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import DescriptionIcon from '@mui/icons-material/Description';

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
      if (!actor) throw new Error('Not authenticated');
      
      if (!record.record_type || !record.description || !record.doctor) {
        throw new Error('Please fill out all fields');
      }

      const result = await actor.create_record(
        record.record_type,
        record.description,
        record.doctor
      );
      if (attachments.length > 0) {
        const recordId = result.id;
        const attachmentsToSave = attachments.map(({ id, name, type, url, thumbnailUrl }) => 
          ({ id, name, type, url, thumbnailUrl })
        );
        localStorage.setItem(`attachments-${recordId}`, JSON.stringify(attachmentsToSave));
      }

      navigate('/records');
    } catch (error: any) {
      setError(error.message || 'Failed to create record');
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
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

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Add New Health Record
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
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
          <Box mt={4} sx={{ backgroundColor: '#f5f5f5', p: 3, borderRadius: 2 }}>
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
                  backgroundImage: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  color: 'white',
                  fontWeight: 'bold'
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
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.15)'
                      }
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

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/records')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Save Record'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewRecord; 