import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const challenges = [
  'Drink 8 glasses of water today!',
  'Walk 10,000 steps.',
  'Eat 5 servings of fruits and vegetables.',
  'Take a 10-minute mindfulness break.',
  'Do 20 minutes of exercise.',
  'Get at least 7 hours of sleep tonight.',
  'Stretch for 5 minutes after waking up.'
];

const HealthChallenge: React.FC = () => {
  const [challenge, setChallenge] = useState(challenges[Math.floor(Math.random() * challenges.length)]);
  const [completed, setCompleted] = useState(false);
  const [shared, setShared] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);
  const token = localStorage.getItem('token');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [badgeCount, setBadgeCount] = useState(0);
  const [lastBadgeCount, setLastBadgeCount] = useState(0);
  const [streak, setStreak] = useState(0);

  const newChallenge = () => {
    setChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
    setCompleted(false);
    setShared(false);
  };

  const share = () => {
    const text = `I just completed my health challenge: "${challenge}" on the Health Management System! 🚀`;
    if (navigator.share) {
      navigator.share({ title: 'Health Challenge', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Challenge copied to clipboard!');
    }
    setShared(true);
  };

  const fetchCompletedChallenges = async () => {
    try {
      const res = await axios.get('/api/challenges', { headers: { Authorization: `Bearer ${token}` } });
      setCompletedChallenges(Array.isArray(res.data.completions) ? res.data.completions.map((c: any) => c.challengeId) : []);
      setLastBadgeCount(badgeCount);
      setBadgeCount(res.data.badges || 0);
      // Calculate streak (number of consecutive days with completions)
      const dates = Array.isArray(res.data.completions) ? res.data.completions.map((c: any) => c.completedAt?.slice(0, 10)).filter(Boolean) : [];
      const uniqueDates = Array.from(new Set(dates)).sort().reverse();
      let currentStreak = 0;
      let today = new Date();
      for (let i = 0; i < uniqueDates.length; i++) {
        const date = new Date(uniqueDates[i] as string);
        if (i === 0 && date.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)) break;
        if (i > 0) {
          today.setDate(today.getDate() - 1);
          if (date.toISOString().slice(0, 10) !== today.toISOString().slice(0, 10)) break;
        }
        currentStreak++;
      }
      setStreak(currentStreak);
    } catch {}
  };

  const handleComplete = async (challengeId: string) => {
    await axios.post('/api/challenges/complete', { challengeId }, { headers: { Authorization: `Bearer ${token}` } });
    await fetchCompletedChallenges();
    if (badgeCount > lastBadgeCount) {
      setSnackbarMsg(`New badge earned! 🏅 Total badges: ${badgeCount}`);
    } else {
      setSnackbarMsg('Challenge completed! 🏅');
    }
    setSnackbarOpen(true);
    // Trigger leaderboard refresh event
    window.dispatchEvent(new Event('refreshLeaderboard'));
  };

  useEffect(() => {
    fetchCompletedChallenges();
  }, [token]);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 4, mb: 2, borderRadius: 4, maxWidth: 420, mx: 'auto', background: 'linear-gradient(90deg, #e3f2fd 0%, #bbdefb 100%)' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
        Daily Health Challenge
      </Typography>
      <Typography variant="body1" sx={{ mb: 2, fontWeight: 500 }}>
        {challenge}
      </Typography>
      {completedChallenges.length > 0 && (
        <Typography color="secondary" sx={{ mt: 1, mb: 2, fontWeight: 'bold' }}>
          🏅 You have completed {completedChallenges.length} challenge{completedChallenges.length > 1 ? 's' : ''}!
        </Typography>
      )}
      {badgeCount > 0 && (
        <Typography color="secondary" sx={{ mt: 1, mb: 2, fontWeight: 'bold' }}>
          🏅 You have {badgeCount} badge{badgeCount > 1 ? 's' : ''}!
          {streak > 1 && (
            <span style={{ marginLeft: 8, color: '#1976d2' }}>🔥 Streak: {streak} days</span>
          )}
        </Typography>
      )}
      <Button
        variant={completed ? 'outlined' : 'contained'}
        color={completed ? 'success' : 'primary'}
        onClick={async () => {
          await handleComplete(challenge);
          setCompleted(true);
        }}
        disabled={completed}
        sx={{ mr: 2 }}
      >
        {completed ? 'Completed!' : 'Mark as Done'}
      </Button>
      <Button variant="text" onClick={newChallenge}>
        New Challenge
      </Button>
      {completed && (
        <Button variant="outlined" color="secondary" onClick={share} sx={{ ml: 2 }}>
          {shared ? 'Shared!' : 'Share'}
        </Button>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <MuiAlert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </Paper>
  );
};

export default HealthChallenge; 