import { Field, ObjectType } from '@nestjs/graphql';
import {
  BaseFileMetaSchema,
  BaseFileSchema,
  FileTypeEnum,
  ImageMeta,
  VideoMeta,
} from 'fluentsearch-types';

type Duration = VideoMeta['duration'];
@ObjectType()
export class FileInsightVideoDuration implements Duration {
  @Field(() => String)
  original: string;

  @Field(() => Number)
  hour: number;

  @Field(() => Number)
  minute: number;

  @Field(() => Number)
  second: number;
}

@ObjectType()
export class FileInsightMetadata
  implements Partial<BaseFileMetaSchema<ImageMeta & VideoMeta>>
{
  @Field(() => Number)
  size: number;

  @Field(() => String)
  extension: string;

  @Field(() => String)
  contentType: string;

  @Field(() => Number)
  width: number;

  @Field(() => Number)
  height: number;

  @Field(() => Number, { nullable: true })
  fps: number;

  @Field(() => FileInsightVideoDuration, { nullable: true })
  duration: FileInsightVideoDuration;
}

@ObjectType()
export class FileInsightMeta
  implements Partial<BaseFileSchema<FileTypeEnum, Record<string, any>>>
{
  @Field(() => String)
  _id: string;

  @Field(() => String)
  uri: string;

  @Field(() => String)
  uri_thumbnail: string;

  @Field(() => FileInsightMetadata)
  meta: FileInsightMetadata;

  @Field(() => String)
  owner: string;

  @Field(() => String)
  original_filename: string;

  @Field(() => String)
  type: FileTypeEnum;

  @Field(() => String)
  createAt: Date;

  @Field(() => String)
  updateAt: Date;
}
