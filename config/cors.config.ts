import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { registerAs } from '@nestjs/config';

const corsOptions: CorsOptions = {
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  // allowedHeaders: '*',
  origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:4200',
};

export default registerAs('cors', () => corsOptions);
