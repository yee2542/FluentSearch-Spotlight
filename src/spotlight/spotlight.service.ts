import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FileDocument,
  FILES_SCHEMA_NAME,
  InsightDocument,
  INSIGHT_SCHEMA_NAME,
} from 'fluentsearch-types';
import { Model } from 'mongoose';
import { FileInsightDto } from './dto/file-insight.dto';
import { FileInsightMeta } from './dto/file-meta.dto';

@Injectable()
export class SpotlightService {
  constructor(
    @InjectModel(INSIGHT_SCHEMA_NAME)
    private readonly insightModel: Model<InsightDocument>,
    @InjectModel(FILES_SCHEMA_NAME)
    private readonly fileModel: Model<FileDocument>,
  ) {}

  async getFileInsight(fileId: string): Promise<FileInsightDto> {
    const file = await this.fileModel.findById(fileId);
    if (!file) {
      throw new BadRequestException('file not existing');
    }
    const insights = await this.insightModel.find({ fileId });
    return {
      fileMeta: file as unknown as FileInsightMeta,
      insights: insights,
    };
  }
}
