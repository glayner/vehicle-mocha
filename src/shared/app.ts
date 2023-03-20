import 'dotenv/config';
import express from 'express';
import modules from '../modules';
import Middlewares from './middlewares';

const app = express();

app.use(express.json());

app.use(express.static('public'));

app.use(modules);

app.use(Middlewares.error);

export default app;
