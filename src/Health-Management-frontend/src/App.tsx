import React, { useEffect, useState, createContext, useContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { HttpAgent } from '@dfinity/agent';
import { AppBar, Toolbar, Typography, Container, Box, IconButton, Menu, MenuItem, Avatar, Tooltip } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import Dashboard from './component/Dashboard';
import RecordList from './component/RecordList';
import RecordDetail from './component/RecordDetail';
import NewRecord from './component/NewRecord';
import UserProfile from './component/UserProfile';
import { CustomThemeProvider, useTheme } from './component/ThemeContext';
import { UserProvider, useUser } from './component/UserContext';
import { createActor } from '../../declarations/healthchain_backend';
import Contact from './component/Contact';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

// Get canister ID from environment variables with a fallback
const backendCanisterId: string = (process.env.CANISTER_ID_HEALTHCHAIN_BACKEND as string) || 'asrmz-lmaaa-aaaaa-qaaeq-cai';

interface AppContextType {
  actor: any;
}

export const AppContext = createContext<AppContextType>({
  actor: null,
});

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppProvider');
  }
  return context;
};

function AppContent() {
  const [actor, setActor] = useState<any>(null);
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentProfile, profiles } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    initBackend();
  }, []);

  const initBackend = async () => {
    try {
        const agent = new HttpAgent();
      
          if (process.env.DFX_NETWORK !== 'ic') {
            agent.fetchRootKey().catch(err => {
              console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
            });
          }
          
          const actor = createActor(backendCanisterId, {
            agent,
          });
      
          setActor(actor);
    } catch (error) {
      console.error('Failed to initialize backend:', error);
    }
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppContext.Provider value={{ actor }}>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
              Health Management System
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tooltip title="Home">
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/')}
                  sx={{ 
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Search records">
                <IconButton 
                  color="inherit" 
                  component="a" 
                  href="/search"
                  sx={{ 
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <SearchIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Contact Support">
                <IconButton 
                  color="inherit" 
                  component="a" 
                  href="/contact"
                  sx={{ 
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <SupportAgentIcon />
                </IconButton>
              </Tooltip>
              
              <IconButton 
                sx={{ 
                  ml: 1, 
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)'
                  }
                }} 
                onClick={toggleDarkMode} 
                color="inherit"
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>

              <Tooltip title="User profile">
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ 
                    color: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {currentProfile?.avatar ? (
                    <Avatar alt={currentProfile.name} src={currentProfile.avatar} sx={{ width: 32, height: 32 }} />
                  ) : (
                    <AccountCircleIcon />
                  )}
                </IconButton>
              </Tooltip>
              
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                PaperProps={{
                  sx: {
                    "& .MuiMenuItem-root": {
                      color: darkMode ? 'white' : 'text.primary'
                    }
                  }
                }}
              >
                <MenuItem onClick={() => { handleClose(); window.location.href = '/profile'; }}>
                  Profile Settings
                </MenuItem>
                {profiles.length > 1 && (
                  <MenuItem onClick={handleClose}>
                    Switch Profile
                  </MenuItem>
                )}
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/records" element={<RecordList />} />
            <Route path="/records/new" element={<NewRecord />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Container>
      </Box>
    </AppContext.Provider>
  );
}

function App() {
  return (
    <CustomThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </CustomThemeProvider>
  );
}

export default App; 