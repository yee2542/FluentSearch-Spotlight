import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileDocument,
  FILES_SCHEMA_NAME,
  InsightDocument,
  INSIGHT_SCHEMA_NAME,
  ModelEnum,
} from 'fluentsearch-types';
import { Model } from 'mongoose';
import { join } from 'path';
import { ConfigService } from 'src/config/config.service';
import { FileInsightDto } from './dto/file-insight.dto';
import { FileInsightMeta } from './dto/file-meta.dto';
import { FileVideoInsightDto } from './dto/file-video-insight.dto';
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

  async getFileImageInsight(
    fileId: string,
    limit = 100,
  ): Promise<FileInsightDto> {
    const file = await this.fileModel.findById(fileId).lean();
    if (!file) {
      throw new BadRequestException('file not existing');
    }
    const insights = await this.insightModel
      .find({ fileId })
      .limit(limit)
      .lean();
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

  async getDashboardRecentFile(owner: string) {
    const recentFiles = await this.insightModel
      .find({ owner })
      .sort({ createAt: -1 })
      .limit(10);
    const result = await Promise.all(
      recentFiles.map((f) => this.getFileImageInsight(f.fileId, 3)),
    );
    return result;
  }

  async getFileVideoInsight(fileId: string): Promise<FileVideoInsightDto> {
    const file = await this.fileModel.findById(fileId).lean();
    if (!file) {
      throw new BadRequestException('file not existing');
    }
    const { uri, uri_thumbnail } = this.genFileUri(file.owner, fileId);

    const sampleInsight = await this.insightModel.findOne({ fileId });
    if (!sampleInsight)
      throw new BadRequestException(
        'Insight is processing or file _id not existinh',
      );

    const videoInsights = await this.insightModel
      .aggregate([
        // match only fileId
        { $match: { fileId } },

        // project
        { $project: { fps: 1, prob: 1, bbox: 1, keyword: 1 } },
        { $addFields: { cat: '$keyword' } },
        { $unset: ['keyword'] },

        // group by fps
        {
          $group: {
            _id: '$fps',
            // fps: 'fps',
            classes: {
              $push: '$$ROOT',
            },
          },
        },

        // add fps field
        { $addFields: { nFps: '$_id' } },
        { $unset: ['_id'] },
      ])
      .allowDiskUse(true);

    return {
      fileMeta: {
        ...file,
        uri,
        uri_thumbnail,
      } as unknown as FileInsightMeta,
      insights: videoInsights,
      dimension: {
        original_width: file.meta.width,
        original_height: file.meta.height,
        extract_width: sampleInsight?.extractSize?.width || -1,
        extract_height: sampleInsight?.extractSize?.height || -1,
      },
      model: ModelEnum.detection_600,
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

        // distinct
        { $group: { _id: '$fileId' } },

        {
          $addFields: {
            uri: {
              $concat: [
                `${this.configService.get().storage_endpoint}`,
                `${owner}`,
                '/',
                {
                  $toString: '$_id',
                },
              ],
            },
            uri_thumbnail: {
              $concat: [
                `${this.configService.get().storage_endpoint}`,
                `${owner}`,
                '/',
                {
                  $toString: '$_id',
                },
                '/thumbnail',
              ],
            },
          },
        },
      ])
      .allowDiskUse(true);

    return insights;
  }

  async searchAutoComplete(owner: string) {
    const allKeyword = await this.insightModel.distinct('keyword', { owner });
    return allKeyword;
  }
}
