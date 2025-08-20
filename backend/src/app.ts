
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
// Serve uploaded profile photos statically (must be after app is declared)
app.use('/uploads/profile-photos', express.static(path.join(__dirname, '../uploads/profile-photos')));

// Log every incoming request path and method
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

// Homepage route
app.get('/', (req, res) => {
  res.send('Erasmus Exam API is running');
});


// TODO: Add more routes for users, exams, questions, etc.

import apiRoutes from './routes';
app.use('/api', apiRoutes);

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
