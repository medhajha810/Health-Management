import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data stores
const users = [];
const healthRecords = [];
const challengeCompletions = [];
let userIdCounter = 1;
let recordIdCounter = 1;
let challengeCompletionIdCounter = 1;

const PDF_DIR = path.join(process.cwd(), 'pdfs');
if (!fs.existsSync(PDF_DIR)) fs.mkdirSync(PDF_DIR);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PDF_DIR),
  filename: (req, file, cb) => {
    const userId = req.user?.userId || 'unknown';
    const timestamp = Date.now();
    cb(null, `user_${userId}_${timestamp}.pdf`);
  }
});
const upload = multer({ storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes
// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: userIdCounter++,
      email,
      password: hashedPassword,
      name
    };
    users.push(user);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health Record routes
app.post('/api/records', authenticateToken, async (req, res) => {
  try {
    const { type, description, doctor } = req.body;
    const record = {
      id: recordIdCounter++,
      date: new Date(),
      type,
      description,
      doctor,
      patient: req.user.userId
    };
    healthRecords.push(record);
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/records', authenticateToken, async (req, res) => {
  try {
    const records = healthRecords.filter(r => r.patient === req.user.userId);
    res.json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const record = healthRecords.find(r => r.id == req.params.id && r.patient === req.user.userId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const { type, description, doctor } = req.body;
    const record = healthRecords.find(r => r.id == req.params.id && r.patient === req.user.userId);
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    record.type = type;
    record.description = description;
    record.doctor = doctor;
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const idx = healthRecords.findIndex(r => r.id == req.params.id && r.patient === req.user.userId);
    if (idx === -1) {
      return res.status(404).json({ error: 'Record not found' });
    }
    healthRecords.splice(idx, 1);
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Challenge Completion routes
app.post('/api/challenges/complete', authenticateToken, async (req, res) => {
  try {
    const { challengeId } = req.body;
    const completion = {
      id: challengeCompletionIdCounter++,
      user: req.user.userId,
      challengeId,
      completedAt: new Date()
    };
    challengeCompletions.push(completion);
    res.status(201).json(completion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/challenges', authenticateToken, async (req, res) => {
  try {
    const completions = challengeCompletions.filter(c => c.user === req.user.userId);
    res.json(completions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/challenges/leaderboard', async (req, res) => {
  try {
    // Count completions per user
    const leaderboardMap = {};
    challengeCompletions.forEach(c => {
      const user = users.find(u => u.id === c.user);
      if (!user) return;
      if (!leaderboardMap[user.name]) leaderboardMap[user.name] = 0;
      leaderboardMap[user.name]++;
    });
    const leaderboard = Object.entries(leaderboardMap).map(([username, count]) => ({ username, count })).sort((a, b) => b.count - a.count);
    res.json(leaderboard);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload PDF
app.post('/api/records/upload-pdf', authenticateToken, upload.single('pdf'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ message: 'PDF uploaded successfully', filename: req.file.filename });
});

// List user's PDFs
app.get('/api/records/list-pdfs', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const files = fs.readdirSync(PDF_DIR).filter(f => f.startsWith(`user_${userId}_`));
  res.json(files);
});

// Download a user's PDF
app.get('/api/records/download-pdf/:filename', authenticateToken, (req, res) => {
  const userId = req.user.userId;
  const { filename } = req.params;
  if (!filename.startsWith(`user_${userId}_`)) return res.status(403).json({ error: 'Forbidden' });
  const filePath = path.join(PDF_DIR, filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
  res.download(filePath);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 