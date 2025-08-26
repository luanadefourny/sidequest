import { app } from './app';
import cors from 'cors';
import express from 'express';
import path from 'path';
import { PORT, CLIENT } from './env';

app.use(
  cors({
    origin: CLIENT,
    credentials: true,
  }),
);
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}!`);
});

