import { IsString, IsIn } from 'class-validator';

export class UpdateAnnouncementStatusDto {
  @IsString()
  @IsIn(['active','closed'])
  status: 'active' | 'closed';
}
