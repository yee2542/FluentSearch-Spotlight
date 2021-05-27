import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import {
  BBoxResponseAPI,
  FileTypeEnum,
  InsightSchema,
  LanguageEnum,
  ModelEnum,
} from 'fluentsearch-types';

registerEnumType(ModelEnum, { name: 'InsightModelEnum' });
registerEnumType(LanguageEnum, { name: 'InsightLanguageEnum' });
registerEnumType(FileTypeEnum, { name: 'InsightFileTypeEnum' });

@ObjectType()
export class InsightBBox implements BBoxResponseAPI {
  @Field(() => Number)
  xmax: number;

  @Field(() => Number)
  ymax: number;

  @Field(() => Number)
  ymin: number;

  @Field(() => Number)
  xmin: number;
}
@ObjectType()
export class InsightDTO implements Omit<InsightSchema, 'result'> {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  owner: string;

  @Field(() => String)
  keyword: string;

  @Field(() => ModelEnum)
  model: ModelEnum;

  @Field(() => InsightBBox, { nullable: true })
  bbox?: BBoxResponseAPI;

  @Field(() => Number)
  prob: number;

  @Field(() => LanguageEnum)
  lang: LanguageEnum;

  @Field(() => String)
  fileId: string;

  @Field(() => FileTypeEnum)
  fileType: FileTypeEnum;

  @Field(() => Number, { nullable: true })
  fps?: number;

  @Field(() => String)
  createAt: Date;

  @Field(() => String)
  updateAt: Date;
}
