import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useAuth } from '../App';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome to Health Management System
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage your health records easily and securely
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Health Records
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              View and manage your health records, including medical history,
              prescriptions, and test results.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/records')}
              sx={{ mt: 'auto' }}
            >
              View Records
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 240,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Add new health records, schedule appointments, or update your
              personal information.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/records/new')}
              sx={{ mt: 'auto' }}
            >
              Add New Record
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 