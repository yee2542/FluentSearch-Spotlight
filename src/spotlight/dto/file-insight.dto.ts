import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileInsightDto {
  @Field()
  fileMeta: string;

  @Field()
  insight: [];
}
