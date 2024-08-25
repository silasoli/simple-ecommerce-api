import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudFlareService } from '../services/cloud-flare.service';
import { UploadImgCloudFlareDto } from '../dto/update-img-cloud-flare.dto';
import { IDQueryDTO } from '../../common/dto/id-query.dto';

// @ApiBearerAuth()
@ApiTags('Images')
@Controller('image')
export class CloudFlareController {
  constructor(private readonly service: CloudFlareService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImgCloudFlareDto })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<string> {
    return this.service.uploadImage(file);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteImage(@Param() params: IDQueryDTO): Promise<void> {
    return await this.service.deleteImage(params.id);
  }
}
