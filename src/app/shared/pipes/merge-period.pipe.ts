import { Pipe, PipeTransform } from '@angular/core';

import { formatDate, formatTime } from '../helpers/date-format.helpers';

export const ONGOING_TOKEN = 'Ongoing';

@Pipe({ name: 'mergePeriod', standalone: true })
export class MergePeriodPipe implements PipeTransform {
  public transform(startedAt: string, stoppedAt?: string, format = 'dd.MM.yyyy'): string {
    const shortFormat = format
      .replace(/[.\-\/]y+/, '')
      .replace(/y+[.\-\/]/, '')
      .replace(/y+/, '');
    const start = new Date(startedAt);
    const startTime = formatTime(start);

    if (!stoppedAt) {
      return `${formatDate(start, shortFormat)} (${startTime} - ${ONGOING_TOKEN})`;
    }

    const end = new Date(stoppedAt);
    const endTime = formatTime(end);

    if (start.toDateString() === end.toDateString()) {
      return `${formatDate(start, shortFormat)} (${startTime} - ${endTime})`;
    }

    const dateFormat = start.getFullYear() === end.getFullYear() ? shortFormat : format;
    return `${formatDate(start, dateFormat)} (${startTime}) - ${formatDate(end, dateFormat)} (${endTime})`;
  }
}
