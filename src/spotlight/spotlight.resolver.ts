import { Query, Resolver } from '@nestjs/graphql';
import { FileInsightDto } from './dto/file-insight.dto';

@Resolver()
export class SpotlightResolver {
  @Query(() => FileInsightDto)
  async GetFileInsight() {
    return {};
  }
}
