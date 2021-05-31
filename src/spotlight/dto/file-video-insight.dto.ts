import { Field, ObjectType } from '@nestjs/graphql';
import { ModelEnum } from 'fluentsearch-types';
import { FileInsightMeta } from './file-meta.dto';
import { InsightVideoDTO } from './insight-video.dto';

@ObjectType()
export class Dimension {
  @Field(() => Number)
  original_width: number;
  @Field(() => Number)
  original_height: number;

  @Field(() => Number)
  extract_width: number;
  @Field(() => Number)
  extract_height: number;
}

@ObjectType()
export class FileVideoInsightDto {
  @Field(() => FileInsightMeta)
  fileMeta: FileInsightMeta;

  @Field(() => [InsightVideoDTO])
  insights: InsightVideoDTO[];

  @Field(() => Dimension)
  dimension: Dimension;

  @Field(() => ModelEnum)
  model: ModelEnum;
}
