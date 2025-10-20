import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(logger);

app.use('/', notesRoutes);
app.use('/auth', authRoutes);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
