import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpotlightService } from './spotlight.service';
import { FILES_SCHEMA_NAME, INSIGHT_SCHEMA_NAME } from 'fluentsearch-types';
import insightSchema from 'fluentsearch-types/dist/entity/insight.entity';
import { SpotlightResolver } from './spotlight.resolver';
import fileSchema from 'fluentsearch-types/dist/entity/file.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: INSIGHT_SCHEMA_NAME, schema: insightSchema },
      { name: FILES_SCHEMA_NAME, schema: fileSchema },
    ]),
  ],
  providers: [SpotlightService, SpotlightResolver],
})
export class SpotlightModule {}
