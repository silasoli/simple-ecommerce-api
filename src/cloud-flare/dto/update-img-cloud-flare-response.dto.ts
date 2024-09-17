import { ApiProperty } from '@nestjs/swagger';
import { UploadImageResponse } from '../types/cloud-flare.types';

export class UploadImgCloudFlareResponseDto {
  constructor(data: UploadImageResponse) {
    const { id, filename, uploaded, requireSignedURLs, variants } = data;

    return {
      id,
      filename,
      uploaded,
      requireSignedURLs,
      url: variants.find((url) => url.endsWith('public')) || variants[0],
    };
  }

  @ApiProperty({ required: true })
  id: string;

  @ApiProperty({ required: true })
  filename: string;

  @ApiProperty({ required: true })
  uploaded: string;

  @ApiProperty({ required: true })
  requireSignedURLs: boolean;

  @ApiProperty({ required: true })
  url: string;
}
