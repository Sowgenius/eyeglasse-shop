import { globalCatch } from '@middlewares/global-catch';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { env } from './config';
import router from './routes';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

app.use('/api', router);

app.use(globalCatch);

export default app;
