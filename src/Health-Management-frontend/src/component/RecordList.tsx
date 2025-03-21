import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Alert
} from '@mui/material';
import { useAuth } from '../App';

interface HealthRecord {
  id: string;
  date: bigint;
  record_type: string;
  description: string;
  doctor: string;
  patient: any;
}

const RecordList: React.FC = () => {
  const navigate = useNavigate();
  const { actor } = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecords();
  }, [actor]);

  const fetchRecords = async () => {
    try {
      if (!actor) return;
      const result = await actor.get_health_records();
      setRecords(result);
    } catch (error) {
      setError('Failed to load records');
      console.error('Error fetching records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (id: string) => {
    navigate(`/records/${id}`);
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
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (records.length === 0) {
    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Health Records
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/records/new')}
          sx={{ mb: 2 }}
        >
          Add New Record
        </Button>
        <Alert severity="info">
          You don't have any health records yet. Click 'Add New Record' to create one.
        </Alert>
      </div>
    );
  }

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Health Records
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/records/new')}
        sx={{ mb: 2 }}
      >
        Add New Record
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{new Date(Number(record.date) / 1000000).toLocaleDateString()}</TableCell>
                <TableCell>{record.record_type}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewRecord(record.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default RecordList; 