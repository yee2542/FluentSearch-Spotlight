import { Args, Query, Resolver } from '@nestjs/graphql';
import { FileInsightDto } from './dto/file-insight.dto';
import { FileInsightMeta } from './dto/file-meta.dto';
import { SearchDTO } from './dto/search.dto';
import { SpotlightService } from './spotlight.service';

@Resolver()
export class SpotlightResolver {
  constructor(private readonly spotlightService: SpotlightService) {}
  @Query(() => FileInsightDto)
  async GetFileInsight(@Args('fileId') fileId: string) {
    return this.spotlightService.getFileInsight(fileId);
  }

  @Query(() => SearchDTO)
  async GetSearch(
    @Args('owner') owner: string,
    @Args('word') word: string,
  ): Promise<SearchDTO> {
    const res = await this.spotlightService.searchByKeyword(owner, word);
    return {
      results: res as unknown as FileInsightMeta,
    };
  }
}
