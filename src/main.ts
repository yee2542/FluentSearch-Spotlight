import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigAppProviderType } from './config/@types/config-app.type';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigAppProviderType = app
    .select(ConfigModule)
    .get(ConfigService)
    .get();

  await app.listen(config.port);
}
bootstrap();
