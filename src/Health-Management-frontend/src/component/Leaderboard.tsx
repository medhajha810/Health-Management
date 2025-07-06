import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, ListItem, ListItemText, Button, Box, Card, CardContent, Avatar, Divider } from '@mui/material';
import { useUser } from './UserContext';
import * as fcl from '@onflow/fcl';
import axios from 'axios';
import getRecordsScript from '../flow/get_records.cdc?raw';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

interface LeaderboardEntry {
  username: string;
  flowCount: number;
  challengeCount: number;
  badges: number;
  total: number;
}

const Leaderboard: React.FC = () => {
  const { profiles, currentProfile } = useUser();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userBadges, setUserBadges] = useState<number | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const username = profiles[0]?.name;
  const prevRankRef = React.useRef<number | null>(null);
  const [myFlowCount, setMyFlowCount] = useState<number>(0);
  const [myChallengeCount, setMyChallengeCount] = useState<number>(0);
  const [myBadges, setMyBadges] = useState<number>(0);

  // Fetch Flow record count for a user
  const fetchFlowCount = async (flowAddress: string) => {
    try {
      const result = await fcl.query({
        cadence: getRecordsScript,
        args: (arg, t) => [arg(flowAddress, t.Address)]
      });
      return result.length;
    } catch {
      return 0;
    }
  };

  const fetchChallengeLeaderboard = async () => {
    try {
      const res = await axios.get('/api/challenges/leaderboard');
      // [{ username, count }]
      return res.data;
    } catch {
      return [];
    }
  };

  const fetchLeaderboard = async () => {
    setLoading(true);
    // Fetch challenge leaderboard from backend
    const challengeLeaderboard = await fetchChallengeLeaderboard();
    // Map usernames to challenge counts and badges
    const challengeMap = Object.fromEntries(
      challengeLeaderboard.map((e: { username: string; count: number; badges?: number }) => [e.username, { count: e.count, badges: e.badges || 0 }])
    );
    // For each user, get Flow record count and challenge count
    const promises = profiles.map(async (profile) => {
      const flowCount = profile.flowAddress ? await fetchFlowCount(profile.flowAddress) : 0;
      const challengeCount = challengeMap[profile.name]?.count || 0;
      const badges = challengeMap[profile.name]?.badges || 0;
      return {
        username: profile.name,
        flowCount,
        challengeCount,
        badges,
        total: flowCount + challengeCount
      };
    });
    const results = await Promise.all(promises);
    setEntries(results.filter(e => e.flowCount > 0 || e.challengeCount > 0).sort((a, b) => b.total - a.total));
    // Highlight user and show rank
    const idx = results.findIndex(e => e.username === username);
    if (idx !== -1) {
      setUserRank(idx + 1);
      setUserBadges(results[idx].badges);
      if (prevRankRef.current && idx + 1 < prevRankRef.current) {
        setSnackbarMsg(`Congrats! Your leaderboard rank improved to #${idx + 1}`);
        setSnackbarOpen(true);
      }
      prevRankRef.current = idx + 1;
    }
    setLoading(false);
  };

  // Fetch current user's Flow and challenge data
  useEffect(() => {
    const fetchMyStats = async () => {
      if (!currentProfile) return;
      let flowCount = 0;
      if (currentProfile.flowAddress) {
        flowCount = await fetchFlowCount(currentProfile.flowAddress);
      }
      // Find challenge and badge count from leaderboard
      const challengeLeaderboard = await fetchChallengeLeaderboard();
      const myEntry = challengeLeaderboard.find((e: any) => e.username === currentProfile.name);
      setMyFlowCount(flowCount);
      setMyChallengeCount(myEntry?.count || 0);
      setMyBadges(myEntry?.badges || 0);
    };
    fetchMyStats();
  }, [currentProfile]);

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Poll every 10s
    // Listen for refreshLeaderboard event
    const refreshHandler = () => fetchLeaderboard();
    window.addEventListener('refreshLeaderboard', refreshHandler);
    return () => {
      clearInterval(interval);
      window.removeEventListener('refreshLeaderboard', refreshHandler);
    };
  }, [profiles]);

  return (
    <Box>
      {currentProfile && (
        <Card elevation={4} sx={{ mb: 3, p: 2, background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)', border: '2px solid #1976d2', borderRadius: 4 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={currentProfile.avatar || ''} sx={{ width: 56, height: 56, bgcolor: '#1976d2', fontWeight: 'bold', fontSize: 28 }}>
              {!currentProfile.avatar && currentProfile.name?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold" color="primary.main">{currentProfile.name}</Typography>
              <Typography variant="body2" color="text.secondary">Flow Address: {currentProfile.flowAddress || 'Not linked'}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <Typography variant="body1">Flow Records: <b>{myFlowCount}</b></Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body1">Challenges: <b>{myChallengeCount}</b></Typography>
                <Divider orientation="vertical" flexItem />
                <Typography variant="body1">🏅 Badges: <b>{myBadges}</b></Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}
      <Paper elevation={2} sx={{ p: 3, mt: 2, borderRadius: 4, maxWidth: 520, mx: 'auto', background: 'linear-gradient(90deg, #fffde7 0%, #ffe082 100%)' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
          Live Leaderboard
        </Typography>
        {userRank && (
          <Typography sx={{ mb: 1, color: 'primary.main', fontWeight: 'bold' }}>
            Your Rank: #{userRank} {userBadges !== null && `| 🏅 Badges: ${userBadges}`}
          </Typography>
        )}
        {loading ? (
          <Typography>Loading...</Typography>
        ) : entries.length === 0 ? (
          <Typography>No leaderboard data yet. Mint a record or complete a challenge!</Typography>
        ) : (
          <List>
            {entries.map((entry, idx) => (
              <ListItem key={entry.username} sx={entry.username === username ? { background: '#ffe082', borderRadius: 2 } : {}}>
                <ListItemText
                  primary={<b>{idx + 1}. {entry.username}</b>}
                  secondary={<>
                    {entry.flowCount > 0 && <span>Flow Records: {entry.flowCount} </span>}
                    {entry.challengeCount > 0 && <span>Challenges: {entry.challengeCount} </span>}
                    {entry.badges > 0 && <span>🏅 Badges: {entry.badges}</span>}
                  </>}
                />
              </ListItem>
            ))}
          </List>
        )}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
          <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMsg}
          </MuiAlert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Leaderboard; 