import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const dataSource = new DataSource({
    type: configService.get<'mysql'>('database.type'),
    host: configService.get<string>('database.host'),
    port: configService.get<number>('database.port'),
    username: configService.get<string>('database.username'),
    password: configService.get<string>('database.password'),
    database: configService.get<string>('database.database'),
    synchronize: false,
    // autoLoadEntities: true,
    migrations: [join(__dirname, '..', 'migrations/*{.ts,.js}')],
  });

  await dataSource.initialize();

  console.log('initialized data source');
  console.log('running migrations');
  await dataSource.runMigrations();
  console.log('done');
  dataSource.close();
  await app.close();
}

bootstrap();
