import { Field, ObjectType } from '@nestjs/graphql';
import { FileInsightMeta } from './file-meta.dto';
import { InsightDTO } from './insight.dto';

@ObjectType()
export class FileInsightDto {
  @Field(() => FileInsightMeta)
  fileMeta: FileInsightMeta;

  @Field(() => [InsightDTO])
  insights: InsightDTO[];
}
