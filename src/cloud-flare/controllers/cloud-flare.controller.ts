import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Delete,
  Param,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudFlareService } from '../services/cloud-flare.service';
import { UploadImgCloudFlareDto } from '../dto/update-img-cloud-flare.dto';
import { IDQueryDTO } from '../../common/dto/id-query.dto';
import { CLOUD_FLARE_ERRORS } from '../constants/cloud-flare.errors';
import { AuthUserJwtGuard } from '../../auth/guards/auth-user-jwt.guard';
import { RoleGuard } from '../../roles/guards/role.guard';
import { Role } from '../../roles/decorators/roles.decorator';
import { Roles } from '../../roles/enums/role.enum';
import { UploadImgCloudFlareResponseDto } from '../dto/update-img-cloud-flare-response.dto';

@ApiBearerAuth()
@ApiTags('Images')
@Controller('image')
@UseGuards(AuthUserJwtGuard, RoleGuard)
export class CloudFlareController {
  constructor(private readonly service: CloudFlareService) {}

  @ApiOperation({ summary: 'Realizar Upload de imagem' })
  @ApiResponse({
    status: 201,
    description: 'Upload realizado com sucesso',
    type: UploadImgCloudFlareResponseDto,
  })
  @ApiResponse({
    status: CLOUD_FLARE_ERRORS.INVALID_IMAGE.getStatus(),
    description: CLOUD_FLARE_ERRORS.INVALID_IMAGE.message,
  })
  @ApiResponse({
    status: CLOUD_FLARE_ERRORS.INVALID_SIZE.getStatus(),
    description: CLOUD_FLARE_ERRORS.INVALID_SIZE.message,
  })
  @ApiResponse({
    status: CLOUD_FLARE_ERRORS.UPLOAD_IMAGE.getStatus(),
    description: CLOUD_FLARE_ERRORS.UPLOAD_IMAGE.message,
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadImgCloudFlareDto })
  @Post('upload')
  @Role([Roles.ADMIN])
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<UploadImgCloudFlareResponseDto> {
    return this.service.uploadImage(file);
  }

  @ApiOperation({ summary: 'Excluir imagem' })
  @ApiResponse({
    status: 204,
    description: 'Exclusão realizada com sucesso',
  })
  @ApiResponse({
    status: CLOUD_FLARE_ERRORS.UPLOAD_IMAGE.getStatus(),
    description: CLOUD_FLARE_ERRORS.DELETE_IMAGE.message,
  })
  @HttpCode(204)
  @Delete(':id')
  @Role([Roles.ADMIN])
  async deleteImage(@Param() params: IDQueryDTO): Promise<void> {
    return await this.service.deleteImage(params.id);
  }
}
