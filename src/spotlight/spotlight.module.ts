import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SpotlightService } from './spotlight.service';
import { INSIGHT_SCHEMA_NAME } from 'fluentsearch-types';
import insightSchema from 'fluentsearch-types/dist/entity/insight.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: INSIGHT_SCHEMA_NAME, schema: insightSchema },
    ]),
  ],
  providers: [SpotlightService],
})
export class SpotlightModule {}
