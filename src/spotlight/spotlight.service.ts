import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileDocument,
  FILES_SCHEMA_NAME,
  InsightDocument,
  INSIGHT_SCHEMA_NAME,
} from 'fluentsearch-types';
import { Model } from 'mongoose';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import { FileInsightDto } from './dto/file-insight.dto';
import { FileInsightMeta } from './dto/file-meta.dto';
import { InsightDTO } from './dto/insight.dto';

@Injectable()
export class SpotlightService {
  constructor(
    @InjectModel(INSIGHT_SCHEMA_NAME)
    private readonly insightModel: Model<InsightDocument>,
    @InjectModel(FILES_SCHEMA_NAME)
    private readonly fileModel: Model<FileDocument>,
    private readonly configService: ConfigService,
  ) {}

  private genFileUri(userId: string, fileId: string) {
    const uri = new URL(
      join(userId, fileId),
      this.configService.get().storage_endpoint,
    ).href;
    const uri_thumbnail = new URL(
      join(userId, fileId, 'thumbnail'),
      this.configService.get().storage_endpoint,
    ).href;
    return {
      uri,
      uri_thumbnail,
    };
  }

  async getFileInsight(fileId: string): Promise<FileInsightDto> {
    const file = await this.fileModel.findById(fileId).lean();
    if (!file) {
      throw new BadRequestException('file not existing');
    }
    console.log(file);
    console.log(typeof file.owner);
    console.log(typeof fileId);
    const insights = await this.insightModel.find({ fileId }).lean();
    const { uri, uri_thumbnail } = this.genFileUri(file.owner, fileId);
    return {
      fileMeta: {
        ...file,
        uri,
        uri_thumbnail,
      } as unknown as FileInsightMeta,
      insights: insights as unknown as InsightDTO[],
    };
  }

  async searchByKeyword(owner: string, keyword: string) {
    const insights = await this.insightModel
      .aggregate([
        // owner
        {
          $match: {
            owner,
          },
        },
        {
          $match: {
            keyword: {
              $regex: `${keyword.toLocaleLowerCase()}`,
              $options: 'i',
            },
          },
        },

        {
          $addFields: {
            uri: {
              $concat: [
                `${this.configService.get().storage_endpoint}`,
                '$owner',
                '/',
                {
                  $toString: '$_id',
                },
              ],
            },
            uri_thumbnail: {
              $concat: [
                `${this.configService.get().storage_endpoint}`,
                '$owner',
                '/',
                {
                  $toString: '$_id',
                },
                '/thumbnail',
              ],
            },
          },
        },
        // {
        //   $addFields: {
        //     uri: { $toObjectId: '$fileId' },
        //   },
        // },
        // {
        //   $lookup: {
        //     from: FILES_SCHEMA_NAME,
        //     localField: 'refsId',
        //     foreignField: '_id',
        //     as: 'insights',
        //   },
        // },

        // { $unwind: '$insights' },
      ])
      .allowDiskUse(true);

    console.log(insights);
    console.log(JSON.stringify(insights, null, 2));

    return insights;
  }
}
