import { Injectable } from '@nestjs/common';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';

export type Status = 'active' | 'closed';
export interface Announcement {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
}

@Injectable()
export class AnnouncementsService {
  private items: Announcement[] = [];

  create(dto: CreateAnnouncementDto): Announcement {
    const now = new Date().toISOString();
    const item: Announcement = {
      id: Date.now().toString(),
      title: dto.title,
      description: dto.description,
      status: 'active',
      createdAt: now,
    };
    this.items.push(item);
    return item;
  }

  findAll(): Announcement[] {
    return [...this.items].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)); // newest first
  }

  updateStatus(id: string, status: Status): Announcement | null {
    const idx = this.items.findIndex(x => x.id === id);
    if (idx === -1) return null;
    this.items[idx].status = status;
    return this.items[idx];
  }
}
