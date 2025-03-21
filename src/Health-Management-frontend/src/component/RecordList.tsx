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
  Box
} from '@mui/material';
import useAuth from '../App';

interface HealthRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  doctor: string;
}

const RecordList: React.FC = () => {
  const navigate = useNavigate();
  const { actor } : any = useAuth();
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      if (actor) {
        const records = await actor.getHealthRecords();
        setRecords(records);
      }
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (id: string) => {
    navigate(`/records/${id}`);
  };

  if (loading) {
    return <Typography>Loading records...</Typography>;
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" gutterBottom>
            Health Records
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
          >
            Home
          </Button>
        </Box>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate('/records/new')}
        sx={{ mb: 2 }}
      >
        Add New Record
      </Button>
      <TableContainer component={Paper} sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <Table>
        <TableHead sx={{ backgroundColor: '#1976d2' }}>
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
                  backgroundColor: index % 2 === 0 ? '#f5f5f5' : 'white',
                  '&:hover': { backgroundColor: '#e3f2fd' }
                }}
              >
                <TableCell>{new Date(Number(record.date) / 1000000).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.doctor}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleViewRecord(record.id)}
                    sx={{ 
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }
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
    </div>
  );
};

export default RecordList; 