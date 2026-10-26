import http from 'node:http';
import { app } from './app.js';
import { env } from './config/env.js';

const server = http.createServer(app);

server.listen(env.port, () => {
  console.log(`TRAMED running on http://localhost:${env.port}`);
});
