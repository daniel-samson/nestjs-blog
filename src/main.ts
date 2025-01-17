import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { AppLoggingService } from './app-logging.service';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useLogger(new AppLoggingService('App'));
  const logger = new AppLoggingService('bootstrap');

  const configService = app.get(ConfigService);
  const corsOptions: CorsOptions = configService.get<CorsOptions>('cors');
  app.enableCors(corsOptions);
  logger.log(`Enabling cors ${corsOptions.origin}`);

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  const url = `${configService.get<string>(
    'app.protocol',
  )}://${configService.get<string>('app.host')}:${configService.get<number>(
    'app.port',
  )}`;
  logger.log(`Listening at ${url}`);

  await app.listen(configService.get<number>('app.port'));
}
bootstrap();
