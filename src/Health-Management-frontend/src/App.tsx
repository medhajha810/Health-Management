import React, { useEffect, useState, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
import FAQ from './component/FAQ';
import HelpIcon from '@mui/icons-material/Help';
import AboutLanding from './component/AboutLanding';
import SimpleWelcome from './component/SimpleWelcome';
import LandingPage from './component/LandingPage';
import { ThemeProvider, CssBaseline } from '@mui/material';
import SimpleNotifications from './component/SimpleNotifications';
import TeleHealth from './component/TeleHealth';
import HealthAnalytics from './component/HealthAnalytics';
import HealthDataVisualization from './component/HealthDataVisualization';
import { applyLoaderFix } from './utils/loaderFix';

// Create a notification context directly in App.tsx to avoid circular dependencies
export interface NotificationContextType {
  addNotification: (notification: any) => void;
}

export const NotificationContext = React.createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<any[]>([]);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('health_notifications');
      if (savedNotifications) {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(parsedNotifications) && parsedNotifications.length > 0) {
          setNotifications(parsedNotifications);
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  const addNotification = (notification: any) => {
    // Check if the notification already exists
    setNotifications(prev => {
      // Don't add duplicates
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      return [...prev, notification];
    });

    // Save to localStorage
    try {
      const savedNotifications = localStorage.getItem('health_notifications');
      let notificationsArray = [];
      
      if (savedNotifications) {
        notificationsArray = JSON.parse(savedNotifications);
        // Make sure it's an array
        if (!Array.isArray(notificationsArray)) {
          notificationsArray = [];
        }
      }
      
      // Only add if not already present
      if (!notificationsArray.some((n: any) => n.id === notification.id)) {
        notificationsArray.unshift(notification); // Add to beginning
        localStorage.setItem('health_notifications', JSON.stringify(notificationsArray));
      }
    } catch (error) {
      console.error('Error saving notification to localStorage:', error);
    }

    // Also make available globally
    if (window) {
      window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
    }
  };

  // Effect to set up global notification access
  useEffect(() => {
    (window as any).addHealthNotification = addNotification;
    return () => {
      delete (window as any).addHealthNotification;
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Get canister ID from environment variables with a fallback
const backendCanisterId: string = (process.env.CANISTER_ID_HEALTHCHAIN_BACKEND as string) || 'p5w3h-viaaa-aaaah-arcmq-cai';

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
  const [initializingBackend, setInitializingBackend] = useState(true);
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentProfile, profiles } = useUser();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if current route is the welcome/about landing page or project details page
  const isWelcomePage = location.pathname === '/welcome' || location.pathname === '/project-details' || location.pathname === '/welcome/details';

  useEffect(() => {
    const init = async () => {
      try {
        await initBackend();
      } catch (error) {
        console.error("Failed to initialize backend:", error);
      } finally {
        setInitializingBackend(false);
      }
    };
    
    init();
  }, []);

  const initBackend = async () => {
    try {
      const agent = new HttpAgent({
        host: 'https://ic0.app'
      });
    
      if (process.env.DFX_NETWORK !== 'ic') {
        try {
          await agent.fetchRootKey().catch(err => {
            console.warn('Unable to fetch root key. Check to ensure that your local replica is running');
          });
        } catch (err) {
          console.warn('Error fetching root key:', err);
        }
      }
        
      const actor = createActor(backendCanisterId, {
        agent,
      });
    
      setActor(actor);
      console.log('Actor initialized with canisterId:', backendCanisterId);
      return actor;
    } catch (error) {
      console.error('Failed to initialize backend:', error);
      // Don't block the UI, just return null actor
      return null;
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
        {/* Only show AppBar when not on the welcome page or project details */}
        {!isWelcomePage && (
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                Health Management System
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Home">
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/dashboard')}
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
                
                <Tooltip title="View FAQs">
                  <IconButton 
                    sx={{ 
                      ml: 1,
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.2)' }, 
                      transition: 'all 0.3s' 
                    }}
                    onClick={() => navigate('/records/faq')}
                  >
                    <HelpIcon />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Contact Support">
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/contact')}
                    sx={{ 
                      ml: 1,
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

                <Tooltip title="User profile (click for menu, double-click for profile)">
                  <IconButton
                    size="large"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleMenu}
                    onDoubleClick={() => navigate('/profile')}
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
                  <MenuItem onClick={() => { 
                    handleClose(); 
                    navigate('/profile');
                  }}>
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
        )}

        {/* Container with padding only when not on welcome page or project details */}
        <Box sx={{ 
          mt: isWelcomePage ? 0 : 4,
          maxWidth: isWelcomePage ? '100%' : 'lg',
          px: isWelcomePage ? 0 : 3,
          mx: 'auto'
        }}>
          <Routes>
            <Route path="/" element={<Navigate to="/project-details" />} />
            <Route path="/welcome" element={<SimpleWelcome />} />
            <Route path="/welcome/details" element={<LandingPage />} />
            <Route path="/project-details" element={<AboutLanding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/records/faq" element={<FAQ />} />
            <Route path="/records/new" element={<NewRecord />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/records" element={<RecordList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/notifications" element={<SimpleNotifications />} />
            <Route path="/telehealth" element={<TeleHealth />} />
            <Route path="/analytics" element={<HealthAnalytics />} />
            <Route path="/fitness" element={<HealthDataVisualization />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </AppContext.Provider>
  );
}

function App() {
  // Force hide any loader that might be present
  useEffect(() => {
    // Simple direct approach to remove the loader
    const loader = document.getElementById("loading");
    if (loader) {
      loader.style.display = "none";
    }
    
    // Make sure body is visible and scrollable
    document.body.style.display = "block";
    document.body.style.overflow = "auto";
  }, []);

  return (
    <CustomThemeProvider>
      <UserProvider>
        <NotificationProvider>
          <Box 
            sx={{ 
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
              backgroundColor: theme => theme.palette.mode === 'dark' ? theme.palette.background.default : '#f5f5f5',
            }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<Navigate to="/project-details" />} />
                <Route path="/welcome" element={<SimpleWelcome />} />
                <Route path="/welcome/details" element={<LandingPage />} />
                <Route path="/project-details" element={<AboutLanding />} />
                <Route path="/*" element={<AppContent />} />
              </Routes>
            </Router>
          </Box>
        </NotificationProvider>
      </UserProvider>
    </CustomThemeProvider>
  );
}

export default App; 