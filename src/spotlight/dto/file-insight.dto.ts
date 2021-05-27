import { Field, ObjectType } from '@nestjs/graphql';
import { FileInsightMeta } from './file-meta.dto';

@ObjectType()
export class FileInsightDto {
  @Field(() => FileInsightMeta)
  fileMeta: FileInsightMeta;

  // @Field()
  // insight: string;
}
