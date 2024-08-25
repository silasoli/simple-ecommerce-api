import { ApiProperty } from '@nestjs/swagger';


export class ProfilePictureFileDto {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

export class UploadImgCloudFlareDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: ProfilePictureFileDto;
}
