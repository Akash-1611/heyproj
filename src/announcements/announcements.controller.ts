import { Controller, Get, Post, Patch, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { AnnouncementsService } from './announcements.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { UpdateAnnouncementStatusDto } from './dto/update-announcement-status.dto';

@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly svc: AnnouncementsService) {}

  @Post()
  create(@Body() dto: CreateAnnouncementDto) {
    return this.svc.create(dto);
  }

  @Get()
  findAll() {
    return this.svc.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAnnouncementStatusDto) {
    if (!['active', 'closed'].includes(dto.status)) {
      throw new BadRequestException('Invalid status');
    }
    const updated = this.svc.updateStatus(id, dto.status);
    if (!updated) throw new NotFoundException('Announcement not found');
    return updated;
  }
}
