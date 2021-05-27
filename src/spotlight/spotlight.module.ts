import { Module } from '@nestjs/common';
import { SpotlightService } from './spotlight.service';

@Module({
  providers: [SpotlightService]
})
export class SpotlightModule {}
