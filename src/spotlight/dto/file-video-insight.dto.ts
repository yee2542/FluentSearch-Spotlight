import { Field, ObjectType } from '@nestjs/graphql';
import { FileInsightMeta } from './file-meta.dto';
import { InsightVideoDTO } from './insight-video.dto';

@ObjectType()
export class FileVideoInsightDto {
  @Field(() => FileInsightMeta)
  fileMeta: FileInsightMeta;

  @Field(() => [InsightVideoDTO])
  insights: InsightVideoDTO[];
}
