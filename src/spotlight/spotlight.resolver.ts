import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileInsightDto } from './dto/file-insight.dto';
import { SpotlightService } from './spotlight.service';

@Resolver()
export class SpotlightResolver {
  constructor(private readonly spotlightService: SpotlightService) {}
  @Query(() => FileInsightDto)
  async GetFileInsight(@Args('fileId') fileId: string) {
    return this.spotlightService.getFileInsight(fileId);
  }
}
