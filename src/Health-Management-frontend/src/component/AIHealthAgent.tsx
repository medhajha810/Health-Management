import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, CircularProgress } from '@mui/material';

const AIHealthAgent: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setLoading(true);
    try {
      const res = await fetch('/api/ai/health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      if (!res.ok) throw new Error('AI backend error');
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: 'ai', text: data.reply || 'Sorry, I could not process your request.' }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Sorry, I could not process your request.' }]);
    }
    setLoading(false);
    setInput('');
  };

  return (
    <Paper elevation={4} sx={{ p: 3, maxWidth: 420, mx: 'auto', mt: 4, borderRadius: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
        AI Health Assistant
      </Typography>
      <Box sx={{ minHeight: 180, maxHeight: 260, overflowY: 'auto', mb: 2, background: '#f9f9f9', borderRadius: 2, p: 1 }}>
        {messages.length === 0 && (
          <Typography variant="body2" color="text.secondary">Ask me anything about your health, fitness, or medical records!</Typography>
        )}
        {messages.map((msg, idx) => (
          <Box key={idx} sx={{ mb: 1, textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                background: msg.sender === 'user' ? 'primary.light' : 'grey.200',
                color: msg.sender === 'user' ? 'white' : 'text.primary',
                fontWeight: msg.sender === 'user' ? 600 : 400
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
        {loading && <CircularProgress size={22} sx={{ display: 'block', mx: 'auto', my: 1 }} />}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
          placeholder="Type your question..."
          size="small"
          fullWidth
        />
        <Button variant="contained" onClick={sendMessage} disabled={loading || !input.trim()}>
          Send
        </Button>
      </Box>
    </Paper>
  );
};

export default AIHealthAgent; 