import { Field, ObjectType } from '@nestjs/graphql';
import { InsightBBox } from './insight.dto';

@ObjectType()
export class InsightClass {
  @Field(() => InsightBBox)
  bbox: InsightBBox;

  @Field(() => Number)
  prob: number;

  @Field(() => Number)
  fps: number;

  @Field(() => String)
  cat: string;
}

@ObjectType()
export class InsightVideoDTO {
  @Field(() => [InsightClass])
  classes: InsightClass[];

  @Field(() => Number)
  nFps: number;
}
