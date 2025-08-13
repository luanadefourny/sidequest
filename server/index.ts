import express, { Application } from 'express';
import cors from 'cors';
import userRouter from './routers/userRouter';
import apiRouter from './routers/apiRouter';

const app: Application = express();
const port: number = 3000;

app.use(cors());
app.use(express.json());
app.use(userRouter);
app.use(apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}!`);
});

//! to run server -> nodemon index.ts, make sure all dependencies and modules are installed and it should work