import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health Record Schema
const healthRecordSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  type: String,
  description: String,
  doctor: String,
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String
});

const User = mongoose.model('User', userSchema);

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
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = new User({
      email,
      password: hashedPassword,
      name
    });
    
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health Record routes
app.post('/api/records', authenticateToken, async (req, res) => {
  try {
    const { type, description, doctor } = req.body;
    const record = new HealthRecord({
      type,
      description,
      doctor,
      patient: req.user.userId
    });
    
    await record.save();
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/records', authenticateToken, async (req, res) => {
  try {
    const records = await HealthRecord.find({ patient: req.user.userId });
    res.json(records);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      patient: req.user.userId
    });
    
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
    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, patient: req.user.userId },
      { type, description, doctor },
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/records/:id', authenticateToken, async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      patient: req.user.userId
    });
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 