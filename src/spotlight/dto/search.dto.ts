import { Field, ObjectType } from '@nestjs/graphql';
import { FileInsightMeta } from './file-meta.dto';

@ObjectType()
export class SearchDTO {
  @Field(() => [FileInsightMeta])
  results: FileInsightMeta;
}
