import React, { useEffect, useState } from 'react';
import * as fcl from '@onflow/fcl';
import { Button, Box, Typography, Link } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

const FlowAuth: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [showRecovery, setShowRecovery] = useState(false);

  useEffect(() => {
    fcl.currentUser().subscribe(setUser);
  }, []);

  const logIn = () => fcl.authenticate();
  const logOut = () => fcl.unauthenticate();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
      {user && user.addr ? (
        <>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            Connected: {user.addr}
          </Typography>
          <Button variant="outlined" color="secondary" onClick={logOut}>
            Logout
          </Button>
        </>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1 }}>
          <Button variant="contained" color="primary" onClick={logIn}>
            Connect with Flow
          </Button>
          <Link
            component="button"
            variant="body2"
            sx={{ mt: 1, color: 'primary.main', textDecoration: 'underline', cursor: 'pointer' }}
            onClick={() => setShowRecovery(true)}
          >
            Recover Account
          </Link>
          <Dialog open={showRecovery} onClose={() => setShowRecovery(false)}>
            <DialogTitle>Account Recovery</DialogTitle>
            <DialogContent>
              Account recovery for Flow wallets is coming soon. Please ensure you have access to your wallet recovery phrase or use your wallet provider's recovery options.
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowRecovery(false)} color="primary">Close</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </Box>
  );
};

export default FlowAuth; 