import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cyclePeriod', standalone: true })
export class CyclePeriodPipe implements PipeTransform {
  public transform(startedAt: string, stoppedAt?: string): string {
    const start = new Date(startedAt);
    const startDate = this.formatDate(start);
    const startTime = this.fortmatTime(start);

    if (!stoppedAt) {
      return `${startDate} (${startTime} - Ongoing)`;
    }

    const end = new Date(stoppedAt);
    const endTime = this.fortmatTime(end);

    if (start.toDateString() === end.toDateString()) {
      return `${startDate} (${startTime} - ${endTime})`;
    }

    return `${startDate} (${startTime}) - ${this.formatDate(end)} (${endTime})`;
  }

  // In a real project we would have separated file with formats
  private formatDate(d: Date): string {
    return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private fortmatTime(d: Date): string {
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
}
