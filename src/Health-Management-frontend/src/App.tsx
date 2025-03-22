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
import LandingPage from './component/LandingPage';
import { ThemeProvider, CssBaseline } from '@mui/material';

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
  const isWelcomePage = location.pathname === '/' || location.pathname === '/welcome' || location.pathname === '/project-details';

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
            <Route path="/" element={<AboutLanding />} />
            <Route path="/welcome" element={<AboutLanding />} />
            <Route path="/project-details" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/records/faq" element={<FAQ />} />
            <Route path="/records/new" element={<NewRecord />} />
            <Route path="/records/:id" element={<RecordDetail />} />
            <Route path="/records" element={<RecordList />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Box>
    </AppContext.Provider>
  );
}

function App() {
  // Use state to track loader status
  const [loaderHidden, setLoaderHidden] = useState(false);

  useEffect(() => {
    // Check for bypass and minimal mode parameters
    const urlParams = new URLSearchParams(window.location.search);
    const bypassLoading = urlParams.has('bypass');
    const minimalMode = urlParams.has('minimal');
    
    // Force hide the loader if in bypass mode
    if (bypassLoading || minimalMode) {
      const loader = document.getElementById("loading");
      if (loader) {
        loader.style.display = "none";
      }
      setLoaderHidden(true);
    } else {
      // Regular loader hide mechanism
      const hideLoader = () => {
        const loader = document.getElementById("loading");
        if (loader) {
          loader.style.opacity = "0";
          setTimeout(() => {
            loader.style.display = "none";
            setLoaderHidden(true);
          }, 300);
        } else {
          // If loader is not found, still mark as hidden to allow rendering
          setLoaderHidden(true);
        }
      };

      // Execute immediately and also after a timeout as fallback
      hideLoader();
      const timer = setTimeout(hideLoader, 1000);
      
      // Clear timeout to prevent memory leaks
      return () => {
        clearTimeout(timer);
      };
    }

    // Direct access to any route based on URL parameters
    const directRoute = urlParams.get('route');
    if (directRoute) {
      window.location.hash = `#/${directRoute}`;
    }
    // Backwards compatibility for direct dashboard access
    else if (urlParams.has('direct') || urlParams.get('direct') === 'dashboard') {
      window.location.hash = '#/dashboard';
    }
  }, []);
  
  // Ensure app only renders when loader is hidden
  return (
    <CustomThemeProvider>
      <UserProvider>
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            width: '100%',
            overflow: 'auto'
          }}
        >
          <Router>
            <AppContent />
          </Router>
        </Box>
      </UserProvider>
    </CustomThemeProvider>
  );
}

export default App; 