import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE ?? 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: +process.env.DB_PORT ?? 3306,
  username: process.env.DB_USERNAME ?? 'blog',
  password: process.env.DB_PASSWORD ?? 'secret',
  database: process.env.DB_DATABASE ?? 'blog',
}));
