import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development', // 'production' / 'development' / 'test'
  logLevel: process.env.LOG_LEVEL || 'verbose', // 'verbose' / 'debug' / 'log' / 'warn' / 'error' / 'silent'
  protocol: process.env.PROTOCOL || 'http',
  host: process.env.HOST || 'localhost',
  port: parseInt(process.env.PORT, 10) || 3180,
  jwtSecret: process.env.JWT_SECRET || 'secret',
  bcryptRounds: +process.env.BCRYPT_ROUNDS || 10,
}));
