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
  Alert
} from '@mui/material';
import { useAuth } from '../App';

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

      navigate('/records');
    } catch (error: any) {
      setError(error.message || 'Failed to create record');
      console.error('Error creating record:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Health Record
        </Typography>

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