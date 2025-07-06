import React, { useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Avatar,
  Box,
  Fade
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Auth: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    if (!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!isLogin && name.trim().length < 2) {
      setError('Please enter your name.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validate()) return;
    setLoading(true);
    try {
      if (isLogin) {
        const res = await axios.post('/api/login', { email, password });
        localStorage.setItem('token', res.data.token);
        setSuccess('Login successful!');
        setTimeout(() => onAuth(), 500);
      } else {
        await axios.post('/api/register', { email, password, name });
        setSuccess('Registration successful! Please login.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || 'Unknown error. Please check your backend connection.'
      );
    }
    setLoading(false);
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
        py: 6
      }}
    >
      <Fade in timeout={600}>
        <Card elevation={8} sx={{ maxWidth: 370, width: '100%', borderRadius: 4, p: 2, boxShadow: '0 8px 32px rgba(25, 118, 210, 0.15)' }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, mb: 1 }}>
                <LockOutlinedIcon fontSize="large" />
              </Avatar>
              <Typography variant="h5" fontWeight="bold" color="primary.main" gutterBottom>
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                {isLogin ? 'Login to access your health dashboard.' : 'Register to start your health journey.'}
              </Typography>
            </Box>
            <form onSubmit={handleSubmit} autoComplete="off">
              {!isLogin && (
                <TextField
                  label="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  fullWidth
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    )
                  }}
                />
              )}
              <TextField
                label="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                fullWidth
                margin="normal"
                required
                type="email"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
              <TextField
                label="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                fullWidth
                margin="normal"
                required
                type={showPassword ? 'text' : 'password'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlinedIcon color="primary" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(v => !v)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
              {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                sx={{ mt: 3, mb: 1, borderRadius: 2, fontWeight: 'bold', boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)' }}
                disabled={loading}
              >
                {loading ? (isLogin ? 'Logging in...' : 'Registering...') : (isLogin ? 'Login' : 'Register')}
              </Button>
              <Button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
                fullWidth
                sx={{
                  textTransform: 'none',
                  background: 'none',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  mb: 1,
                  '&:hover': { background: 'rgba(25, 118, 210, 0.04)' }
                }}
              >
                {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Fade>
    </Box>
  );
};

export default Auth; 